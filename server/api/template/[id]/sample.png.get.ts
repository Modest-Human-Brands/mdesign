// server/api/template/[id]/sample.png.get.ts
// Neutral sample (unbranded organisation + `{{Field Label}}` tokens) for the template picker. Rendered once per
// process at half size and cached in memory.
import { defineEventHandler, getRouterParam, HTTPError } from 'nitro/h3'

import { handleApiError } from '~/server/utils/api-error'
import { buildVariantVariables, renderTemplatePng } from '~/server/utils/render-design'
import { templateRegistry } from '~/server/utils/template-registry'

import '~/server/templates'

const cache = new Map<string, Promise<Buffer>>()

export default defineEventHandler(async (event) => {
  try {
    const id = (getRouterParam(event, 'id') || '').replace(/\.png$/, '')
    const template = templateRegistry[id]
    if (!template) throw new HTTPError({ statusCode: 404, statusMessage: 'Template not found' })

    let png = cache.get(id)
    if (!png) {
      png = renderTemplatePng(template, buildVariantVariables(template, 'sample').variables, 0.5)
      cache.set(id, png)
      png.catch(() => cache.delete(id))
    }

    return new Response(new Uint8Array(await png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' } })
  } catch (error: unknown) {
    return handleApiError(error, 'template/sample.png.get')
  }
})
