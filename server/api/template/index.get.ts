// server/api/template/index.get.ts
import { defineEventHandler, getQuery } from 'nitro/h3'

import { handleApiError } from '~/server/utils/api-error'
import { templateRegistry } from '~/server/utils/template-registry'

import '~/server/templates'

/** Template catalogue for the picker. Optional `?category=Social` filter. */
export default defineEventHandler((event) => {
  try {
    const category = getQuery(event).category

    return Object.values(templateRegistry)
      .filter((template) => !category || template.category.toLowerCase() === String(category).toLowerCase())
      .map((template) => ({
        id: template.id,
        label: template.label,
        shortLabel: template.shortLabel ?? template.label,
        category: template.category,
        description: template.description,
        resolution: template.resolution,
        sampleUrl: `/api/template/${template.id}/sample.png`,
      }))
  } catch (error: unknown) {
    return handleApiError(error, 'template/index.get')
  }
})
