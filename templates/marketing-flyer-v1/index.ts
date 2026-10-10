import { z } from 'zod'

import { resolveDecor } from '@/domain/decor'

import { brandProps, list, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

export const schema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  subheadline: z.string().optional(),
  offer: z.string().optional(),
  imageUrl: z.string().optional().meta({ 'x-widget': 'image' }),
  features: z.array(z.string()).min(1),
  callToAction: z.string().min(1),
})

export default {
  id: 'marketing-flyer-v1',
  label: 'Marketing Flyer',
  shortLabel: 'Flyer',
  category: 'Display',
  description:
    'A 2:3 portrait flyer / pamphlet with a hero, optional image, offer badge, feature list and contact footer.',
  resolution: { width: 1200, height: 1800, aspectRatio: '2 / 3' },
  component: Component,
  schema,
  placeholders: {
    headline: 'Make your brand unforgettable',
    subheadline: 'Strategy, identity and film for ambitious small businesses.',
    offer: '20% OFF',
    imageUrl: '',
    features: [
      'Brand strategy workshop',
      'Logo and identity system',
      'Launch film in 4 weeks',
      'Dedicated account manager',
    ],
    callToAction: 'Book a free consultation',
  },
  transformPayload: (values, org) => ({
    ...brandProps(org),
    headline: text(values.headline),
    subheadline: text(values.subheadline),
    offer: text(values.offer),
    heroImage: resolveDecor(values.imageUrl),
    features: list(values.features, 5),
    callToAction: text(values.callToAction),
  }),
} satisfies DesignTemplateDefinition