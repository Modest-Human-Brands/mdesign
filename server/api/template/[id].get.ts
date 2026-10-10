// server/api/template/[id].get.ts
import { defineEventHandler, getRouterParam, HTTPError } from 'nitro/h3'

import { handleApiError } from '~/server/utils/api-error'
import { templateRegistry } from '~/server/utils/template-registry'
import { parseSchemaToJsonSchema } from '~/server/utils/zod-to-json-schema'

import '~/server/templates'

export default defineEventHandler((event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw new HTTPError({ statusCode: 400, statusMessage: 'Template ID is required' })

    const template = templateRegistry[id]
    if (!template) throw new HTTPError({ statusCode: 404, statusMessage: 'Template not found' })

    return {
      id: template.id,
      label: template.label,
      shortLabel: template.shortLabel ?? template.label,
      category: template.category,
      description: template.description,
      resolution: template.resolution,
      sampleUrl: `/api/template/${template.id}/sample.png`,
      schema: parseSchemaToJsonSchema(template.schema, template.placeholders),
    }
  } catch (error: unknown) {
    return handleApiError(error, 'template/[id].get')
  }
})
