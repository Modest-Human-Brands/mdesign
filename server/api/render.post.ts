// server/api/render.post.ts
// Stateless production render: template + variables in, a finished image (binary) out.
import { defineEventHandler, getQuery, HTTPError, readBody } from 'nitro/h3'
import { z } from 'zod'

import { handleApiError } from '~/server/utils/api-error'
import { encodeImage, MIME_TYPES, mergeTemplateVariables, parseDpi, parseFormat, renderTemplatePng } from '~/server/utils/render-design'
import { templateRegistry } from '~/server/utils/template-registry'

import '~/server/templates'

const renderRequestSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
  organizationId: z.string().optional(),
  variables: z.record(z.string(), z.any()).default({}),
  format: z.string().optional(),
  dpi: z.number().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { templateId, variables, organizationId, ...options } = renderRequestSchema.parse(await readBody(event))

    const format = parseFormat(query.format ?? options.format)
    const dpi = parseDpi(query.dpi ?? options.dpi, 2)

    const template = templateRegistry[templateId]
    if (!template) throw new HTTPError({ statusCode: 404, statusMessage: `Template '${templateId}' not found.` })

    const payload = mergeTemplateVariables(template, organizationId ? { ...variables, organizationId } : variables)

    const validation = template.schema.safeParse(payload)
    if (!validation.success) return handleApiError(validation.error, 'render.post/schema')

    const png = await renderTemplatePng(template, payload, dpi)
    const body = await encodeImage(png, format, template.resolution)

    return new Response(new Uint8Array(body), {
      headers: {
        'Content-Type': MIME_TYPES[format],
        'Content-Disposition': `inline; filename="${template.id}.${format}"`,
        'X-Image-Width': String(Math.round(template.resolution.width * dpi)),
        'X-Image-Height': String(Math.round(template.resolution.height * dpi)),
      },
    })
  } catch (error: unknown) {
    return handleApiError(error, 'render.post')
  }
})
