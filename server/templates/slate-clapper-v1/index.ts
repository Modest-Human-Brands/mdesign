import { z } from 'zod'

import registerTemplate, { resolutionOf } from '~/server/utils/template-registry'
import { baseFonts, brandProps, clean, defaultOrganization, organizationSchema } from '../_shared/organization'
import Component from './component.vue'

export const slateClapperSchema = z.object({
  production: z.string(),
  director: z.string(),
  cinematographer: z.string(),
  scene: z.string(),
  take: z.string(),
  roll: z.string(),
  date: z.string(),
  notes: z.string().optional(),
  organization: organizationSchema,
})

export type SlateClapperPayload = z.infer<typeof slateClapperSchema>

const placeholders: SlateClapperPayload = {
  production: 'Untitled Brand Film',
  director: 'A. Sharma',
  cinematographer: 'R. Das',
  scene: '12B',
  take: '04',
  roll: 'A007',
  date: '2026-10-10',
  notes: 'Wide, golden hour, handheld',
  organization: defaultOrganization,
}

registerTemplate({
  id: 'slate-clapper-v1',
  label: 'Production Slate',
  shortLabel: 'Slate',
  category: 'Social',
  description: 'A 16:9 clapperboard card with production, director, scene, take and roll fields.',
  resolution: resolutionOf(1600, 900),
  fonts: [...baseFonts, { name: 'JetBrainsMono', family: 'JetBrains Mono', weights: [400, 700] }],
  component: Component,
  schema: slateClapperSchema,
  placeholders,
  transformPayload: async (raw: SlateClapperPayload) => ({
    ...(await brandProps(raw.organization)),
    production: raw.production || placeholders.production,
    director: raw.director || placeholders.director,
    cinematographer: raw.cinematographer || placeholders.cinematographer,
    scene: raw.scene || placeholders.scene,
    take: raw.take || placeholders.take,
    roll: raw.roll || placeholders.roll,
    date: raw.date || placeholders.date,
    notes: clean(raw.notes, placeholders.notes),
  }),
})
