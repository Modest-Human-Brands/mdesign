import { z } from 'zod'

import { brandProps, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

export const schema = z.object({
  production: z.string().min(1, 'Production is required'),
  director: z.string().min(1),
  cinematographer: z.string().min(1),
  scene: z.string().min(1),
  take: z.string().min(1),
  roll: z.string().min(1),
  date: z.string().min(1),
  notes: z.string().optional(),
})

export default {
  id: 'slate-clapper-v1',
  label: 'Production Slate',
  shortLabel: 'Slate',
  category: 'Social',
  description: 'A 16:9 clapperboard card with production, director, scene, take and roll fields.',
  resolution: { width: 1600, height: 900, aspectRatio: '16 / 9' },
  component: Component,
  schema,
  placeholders: {
    production: 'Untitled Brand Film',
    director: 'A. Sharma',
    cinematographer: 'R. Das',
    scene: '12B',
    take: '04',
    roll: 'A007',
    date: '2026-10-10',
    notes: 'Wide, golden hour, handheld',
  },
  transformPayload: (values, org) => ({
    ...brandProps(org),
    production: text(values.production),
    director: text(values.director),
    cinematographer: text(values.cinematographer),
    scene: text(values.scene),
    take: text(values.take),
    roll: text(values.roll),
    date: text(values.date),
    notes: text(values.notes),
  }),
} satisfies DesignTemplateDefinition