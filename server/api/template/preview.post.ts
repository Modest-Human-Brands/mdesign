// server/api/template/preview.post.ts
// Live preview: a base64 PNG (1x) plus warnings. `?draft=true` never rejects partial input.
import { defineEventHandler, getQuery, HTTPError, readBody } from 'nitro/h3'
import { z } from 'zod'

import { handleApiError } from '~/server/utils/api-error'
import { buildVariantVariables, mergeTemplateVariables, parseDpi, renderTemplatePng } from '~/server/utils/render-design'
import { templateRegistry } from '~/server/utils/template-registry'

import '~/server/templates'

const previewRequestSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
  variant: z.enum(['sample', 'branded', 'filled']).default('filled'),
  organizationId: z.string().optional(),
  variables: z.record(z.string(), z.any()).default({}),
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { templateId, variant, variables, organizationId } = previewRequestSchema.parse(await readBody(event))
    const draft = ['1', 'true'].includes(String(query.draft))
    const dpi = parseDpi(query.dpi, 1)

    const template = templateRegistry[templateId]
    if (!template) throw new HTTPError({ statusCode: 404, statusMessage: `Template '${templateId}' not found.` })

    const input = organizationId ? { ...variables, organizationId } : variables
    let renderVariables: Record<string, any>
    let warnings: { field: string; message: string; code: string }[] = []

    if (variant !== 'filled' || draft) {
      // Sample / branded / live typing: never rejects; unfilled fields show their `{{Field Label}}` token
      ;({ variables: renderVariables, warnings } = buildVariantVariables(template, variant, input))
    } else {
      // Strict: placeholders backfill missing fields and invalid input is a 400
      renderVariables = mergeTemplateVariables(template, input)
      const validation = template.schema.safeParse(renderVariables)
      if (!validation.success) return handleApiError(validation.error, 'preview.post/schema')
    }

    const png = await renderTemplatePng(template, renderVariables, dpi)

    return {
      imageBase64: `data:image/png;base64,${png.toString('base64')}`,
      resolution: template.resolution,
      variant,
      ...(draft || variant !== 'filled' ? { warnings } : {}),
    }
  } catch (error: unknown) {
    return handleApiError(error, 'template/preview.post')
  }
})
