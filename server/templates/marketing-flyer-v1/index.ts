import { z } from 'zod'

import registerTemplate, { resolutionOf } from '~/server/utils/template-registry'
import { resolveDecor } from '~/server/utils/decor'
import { baseFonts, brandProps, clean, cleanList, defaultOrganization, organizationSchema } from '../_shared/organization'
import Component from './component.vue'

export const marketingFlyerSchema = z.object({
  headline: z.string(),
  subheadline: z.string().optional(),
  offer: z.string().optional(),
  imageUrl: z.string().optional().meta({ 'x-widget': 'image' }),
  features: z.array(z.string()),
  callToAction: z.string(),
  organization: organizationSchema,
})

export type MarketingFlyerPayload = z.infer<typeof marketingFlyerSchema>

const placeholders: MarketingFlyerPayload = {
  headline: 'Make your brand unforgettable',
  subheadline: 'Strategy, identity and film for ambitious small businesses.',
  offer: '20% OFF',
  imageUrl: undefined,
  features: ['Brand strategy workshop', 'Logo and identity system', 'Launch film in 4 weeks', 'Dedicated account manager'],
  callToAction: 'Book a free consultation',
  organization: defaultOrganization,
}

registerTemplate({
  id: 'marketing-flyer-v1',
  label: 'Marketing Flyer',
  shortLabel: 'Flyer',
  category: 'Display',
  description: 'A 2:3 portrait flyer / pamphlet with a hero, optional image, offer badge, feature list and contact footer.',
  resolution: resolutionOf(1200, 1800, '2:3'),
  fonts: baseFonts,
  component: Component,
  schema: marketingFlyerSchema,
  placeholders,
  transformPayload: async (raw: MarketingFlyerPayload) => ({
    ...(await brandProps(raw.organization)),
    headline: raw.headline || placeholders.headline,
    subheadline: clean(raw.subheadline, placeholders.subheadline),
    offer: clean(raw.offer, placeholders.offer),
    heroImage: await resolveDecor(raw.imageUrl),
    features: cleanList(raw.features ?? placeholders.features, 5),
    callToAction: raw.callToAction || placeholders.callToAction,
  }),
})
