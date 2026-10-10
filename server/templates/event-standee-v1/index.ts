import { z } from 'zod'

import registerTemplate, { resolutionOf } from '~/server/utils/template-registry'
import { baseFonts, brandProps, clean, cleanList, defaultOrganization, organizationSchema } from '../_shared/organization'
import Component from './component.vue'

export const eventStandeeSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.string(),
  time: z.string(),
  venue: z.string(),
  highlights: z.array(z.string()),
  registerLabel: z.string(),
  registerUrl: z.string().optional(),
  organization: organizationSchema,
})

export type EventStandeePayload = z.infer<typeof eventStandeeSchema>

const placeholders: EventStandeePayload = {
  eyebrow: 'Annual meet 2026',
  title: 'Creators Summit',
  subtitle: 'A day of talks, workshops and screenings for independent filmmakers.',
  date: '21 November 2026',
  time: '10:00 AM – 6:00 PM',
  venue: 'Nandan Auditorium, Kolkata',
  highlights: ['Keynote on modern storytelling', 'Hands-on cinematography lab', 'Short film screening', 'Networking lunch'],
  registerLabel: 'Register free',
  registerUrl: 'modesthumanbrands.com/summit',
  organization: defaultOrganization,
}

registerTemplate({
  id: 'event-standee-v1',
  label: 'Event Standee',
  shortLabel: 'Standee',
  category: 'Display',
  description: 'A tall 1:2.5 roll-up banner with event title, schedule, highlights and a registration call to action.',
  resolution: resolutionOf(800, 2000, '1:2.5'),
  fonts: baseFonts,
  component: Component,
  schema: eventStandeeSchema,
  placeholders,
  transformPayload: async (raw: EventStandeePayload) => ({
    ...(await brandProps(raw.organization)),
    eyebrow: clean(raw.eyebrow, placeholders.eyebrow),
    title: raw.title || placeholders.title,
    subtitle: clean(raw.subtitle, placeholders.subtitle),
    date: raw.date || placeholders.date,
    time: raw.time || placeholders.time,
    venue: raw.venue || placeholders.venue,
    highlights: cleanList(raw.highlights ?? placeholders.highlights, 5),
    registerLabel: raw.registerLabel || placeholders.registerLabel,
    registerUrl: clean(raw.registerUrl, placeholders.registerUrl),
  }),
})
