import { z } from 'zod'

import registerTemplate, { resolutionOf } from '~/server/utils/template-registry'
import { baseFonts, brandProps, clean, defaultOrganization, organizationSchema } from '../_shared/organization'
import Component from './component.vue'

export const businessCardSchema = z.object({
  person: z.object({
    name: z.string(),
    title: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  tagline: z.string().optional(),
  organization: organizationSchema,
})

export type BusinessCardPayload = z.infer<typeof businessCardSchema>

const placeholders: BusinessCardPayload = {
  person: {
    name: 'Aarav Sharma',
    title: 'Creative Director',
    phone: '+91 99999 99999',
    email: 'aarav@modesthumanbrands.com',
  },
  tagline: 'Stories worth watching',
  organization: defaultOrganization,
}

registerTemplate({
  id: 'business-card-v1',
  label: 'Business Card',
  shortLabel: 'Business card',
  category: 'Stationery',
  description: 'A 3.5 x 2 in visiting card at 300 DPI with a branded gradient side and contact details.',
  resolution: resolutionOf(1050, 600, '1.75:1'),
  fonts: baseFonts,
  component: Component,
  schema: businessCardSchema,
  placeholders,
  transformPayload: async (raw: BusinessCardPayload) => {
    const brand = await brandProps(raw.organization)
    return {
      ...brand,
      personName: raw.person?.name || placeholders.person.name,
      personTitle: raw.person?.title || placeholders.person.title,
      personPhone: raw.person?.phone || brand.organizationPhone,
      personEmail: raw.person?.email || brand.organizationEmail,
      tagline: clean(raw.tagline, placeholders.tagline),
    }
  },
})
