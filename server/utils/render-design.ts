// server/utils/render-design.ts
// Variable resolution, canvas rendering and image encoding shared by the render, preview and sample endpoints.
import { HTTPError } from 'nitro/h3'
import sharp from 'sharp'

import { renderComponentToCanvas } from '~/server/canvas/core'
import type { ApiValidationErrorDetail } from '~/server/utils/api-error'
import { ensureFonts, resolveBrandFont } from '~/server/utils/fonts'
import { neutralOrganization, resolveOrganization } from '~/server/utils/organization-store'
import type { DesignTemplate } from '~/server/utils/template-registry'
import { deepMerge, getTokenPayload } from '~/server/utils/token-payload'

const RENDER_TIMEOUT_MS = 30_000

export const IMAGE_FORMATS = ['png', 'webp', 'jpeg', 'gif', 'svg'] as const
export type ImageFormat = (typeof IMAGE_FORMATS)[number]

export const MIME_TYPES: Record<ImageFormat, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
}

export function parseFormat(value: unknown): ImageFormat {
  const format = String(value || 'png').toLowerCase()
  const normalized = format === 'jpg' ? 'jpeg' : format
  if (!(IMAGE_FORMATS as readonly string[]).includes(normalized)) {
    throw new HTTPError({ statusCode: 400, statusMessage: 'Bad Request', data: { errors: [{ field: 'format', message: `format must be one of ${IMAGE_FORMATS.join(', ')}`, code: 'invalid_value' }] } })
  }
  return normalized as ImageFormat
}

export function parseDpi(value: unknown, fallback: number): number {
  const dpi = Number(value)
  return Number.isFinite(dpi) && dpi > 0 ? Math.min(3, Math.max(0.5, dpi)) : fallback
}

export function mergeTemplateVariables(template: DesignTemplate, variables: Record<string, any> = {}) {
  const orgInput = variables.organizationId || variables.organization || variables.orgId
  const organization = resolveOrganization(orgInput, template.placeholders?.organization)

  return { ...template.placeholders, ...variables, organization }
}

function setPath(target: any, path: PropertyKey[], value: any) {
  let cursor = target
  for (let i = 0; i < path.length - 1; i++) {
    cursor = cursor?.[path[i] as any]
    if (cursor == null) return
  }
  if (path.length > 0) cursor[path.at(-1) as any] = value
}

export type PreviewVariant = 'sample' | 'branded' | 'filled'

/**
 * Variables for a preview variant. Every dynamic field the user has not filled shows its own `{{Field Label}}` token.
 * - sample:  neutral organisation + tokens (static picker images)
 * - branded: the client's organisation + tokens
 * - filled:  the client's organisation + the user's data over tokens (live)
 * Invalid user values never fail the render: they are dropped (the field shows its token again) and reported as warnings.
 */
export function buildVariantVariables(template: DesignTemplate, variant: PreviewVariant, variables: Record<string, any> = {}) {
  const warnings: ApiValidationErrorDetail[] = []
  const tokens = getTokenPayload(template)

  if (variant === 'sample') {
    return { variables: { ...tokens, organization: neutralOrganization }, warnings }
  }

  const organization = resolveOrganization(variables.organizationId || variables.organization || variables.orgId, template.placeholders?.organization)
  if (variant === 'branded') {
    return { variables: { ...tokens, organization }, warnings }
  }

  const userData = { ...variables }
  for (const key of ['organizationId', 'orgId', 'organization']) delete userData[key]

  const cleaned = structuredClone(userData)
  if (template.schema) {
    // Validate against the demo placeholders so only the user's own values can fail
    const result = template.schema.safeParse({ ...deepMerge(template.placeholders, cleaned), organization })
    if (!result.success) {
      for (const issue of result.error.issues) {
        warnings.push({ field: issue.path.join('.'), message: issue.message, code: issue.code })
        setPath(cleaned, issue.path, undefined)
      }
    }
  }

  return { variables: { ...deepMerge(tokens, cleaned), organization }, warnings }
}

/** Makes sure the template's fonts and the organisation's brand font are registered; an unavailable brand font falls back to the default. */
async function prepareFonts(template: DesignTemplate, variables: Record<string, any>) {
  await ensureFonts(template.fonts ?? [])

  const wanted = variables.organization?.branding?.font
  if (!wanted) return variables

  const font = await resolveBrandFont(wanted)
  if (font === wanted) return variables
  return { ...variables, organization: { ...variables.organization, branding: { ...variables.organization.branding, font } } }
}

/** Renders the template to a PNG at `width*dpi` x `height*dpi` pixels. */
export async function renderTemplatePng(template: DesignTemplate, rawVariables: Record<string, any>, dpi = 2): Promise<Buffer> {
  const render = async () => {
    const variables = await prepareFonts(template, rawVariables)
    const props = await template.transformPayload(variables)
    return renderComponentToCanvas(template.component, props, { width: template.resolution.width, height: template.resolution.height, dpi })
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new HTTPError({ statusCode: 504, statusMessage: 'Render timed out.' })), RENDER_TIMEOUT_MS)
  })

  try {
    return await Promise.race([render(), timeout])
  } finally {
    clearTimeout(timer)
  }
}

/** Encodes a rendered PNG into the requested format with Sharp. SVG wraps the pixel-perfect raster. */
export async function encodeImage(png: Buffer, format: ImageFormat, size: { width: number; height: number }): Promise<Buffer> {
  switch (format) {
    case 'webp': {
      return sharp(png).webp({ quality: 90 }).toBuffer()
    }
    case 'jpeg': {
      return sharp(png).flatten({ background: '#ffffff' }).jpeg({ quality: 90, mozjpeg: true }).toBuffer()
    }
    case 'gif': {
      return sharp(png).gif().toBuffer()
    }
    case 'svg': {
      return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}"><image width="${size.width}" height="${size.height}" href="data:image/png;base64,${png.toString('base64')}"/></svg>`
      )
    }
    default: {
      return png
    }
  }
}
