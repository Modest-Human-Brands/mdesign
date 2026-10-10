import { z } from 'zod'

import registerTemplate, { resolutionOf } from '~/server/utils/template-registry'
import { baseFonts, brandProps, clean, defaultOrganization, organizationSchema } from '../_shared/organization'
import Component from './component.vue'

export const directorHudSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  camera: z.string(),
  scene: z.string(),
  take: z.string(),
  roll: z.string(),
  timecode: z.string(),
  fps: z.string(),
  iso: z.string(),
  organization: organizationSchema,
})

export type DirectorHudPayload = z.infer<typeof directorHudSchema>

const placeholders: DirectorHudPayload = {
  title: 'Behind the scenes',
  subtitle: 'Day 3 · Rooftop sequence',
  camera: 'A-CAM',
  scene: '12B',
  take: '04',
  roll: 'A007',
  timecode: '10:24:18:12',
  fps: '24 FPS',
  iso: 'ISO 800',
  organization: defaultOrganization,
}

registerTemplate({
  id: 'director-hud-v1',
  label: 'Director HUD',
  shortLabel: 'Director HUD',
  category: 'Social',
  description: 'A 16:9 camera viewfinder overlay with recording indicator, timecode, frame guides and a lower-third title.',
  resolution: resolutionOf(1920, 1080),
  fonts: [...baseFonts, { name: 'JetBrainsMono', family: 'JetBrains Mono', weights: [400, 700] }],
  component: Component,
  schema: directorHudSchema,
  placeholders,
  transformPayload: async (raw: DirectorHudPayload) => ({
    ...(await brandProps(raw.organization)),
    title: raw.title || placeholders.title,
    subtitle: clean(raw.subtitle, placeholders.subtitle),
    camera: raw.camera || placeholders.camera,
    scene: raw.scene || placeholders.scene,
    take: raw.take || placeholders.take,
    roll: raw.roll || placeholders.roll,
    timecode: raw.timecode || placeholders.timecode,
    fps: raw.fps || placeholders.fps,
    iso: raw.iso || placeholders.iso,
  }),
})
