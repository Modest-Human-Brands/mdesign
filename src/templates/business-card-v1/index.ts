import { z } from 'zod'

import { brandProps, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

export const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  tagline: z.string().optional(),
})

export default {
  id: 'business-card-v1',
  label: 'Corporate Business Card',
  shortLabel: 'Business Card',
  category: 'Stationery',
  description: 'Standard 3.5" x 2" visiting card (300 DPI).',
  resolution: { width: 1050, height: 600, aspectRatio: '7 / 4', dpi: 300 },
  component: Component,
  schema,
  placeholders: {
    fullName: 'Aarav Sharma',
    jobTitle: 'Creative Director',
    email: 'aarav@modesthumanbrands.com',
    phone: '+91 98200 12345',
    tagline: 'Crafting intentional visual identities.',
  },
  transformPayload: (values, org) => ({
    ...brandProps(org),
    fullName: text(values.fullName),
    jobTitle: text(values.jobTitle),
    email: text(values.email),
    phone: text(values.phone),
    tagline: text(values.tagline),
  }),
} satisfies DesignTemplateDefinition