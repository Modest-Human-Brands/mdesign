import { z } from 'zod'

import { brandProps, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

export const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  camera: z.string().min(1),
  scene: z.string().min(1),
  take: z.string().min(1),
  roll: z.string().min(1),
  timecode: z.string().min(1),
  fps: z.string().min(1),
  iso: z.string().min(1),
})

export default {
  id: 'director-hud-v1',
  label: 'Director HUD',
  shortLabel: 'Director HUD',
  category: 'Social',
  description:
    'A 16:9 camera viewfinder overlay with recording indicator, timecode, frame guides and a lower-third title.',
  resolution: { width: 1920, height: 1080, aspectRatio: '16 / 9' },
  component: Component,
  schema,
  placeholders: {
    title: 'Behind the scenes',
    subtitle: 'Day 3 · Rooftop sequence',
    camera: 'A-CAM',
    scene: '12B',
    take: '04',
    roll: 'A007',
    timecode: '10:24:18:12',
    fps: '24 FPS',
    iso: 'ISO 800',
  },
  transformPayload: (values, org) => ({
    ...brandProps(org),
    title: text(values.title),
    subtitle: text(values.subtitle),
    camera: text(values.camera),
    scene: text(values.scene),
    take: text(values.take),
    roll: text(values.roll),
    timecode: text(values.timecode),
    fps: text(values.fps),
    iso: text(values.iso),
  }),
} satisfies DesignTemplateDefinition