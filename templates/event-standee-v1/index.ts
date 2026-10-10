import { z } from 'zod'

import { brandProps, list, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

export const schema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  venue: z.string().min(1),
  highlights: z.array(z.string()).min(1),
  registerLabel: z.string().min(1),
  registerUrl: z.string().optional(),
})

export default {
  id: 'event-standee-v1',
  label: 'Event Standee',
  shortLabel: 'Standee',
  category: 'Display',
  description:
    'A tall 1:2.5 roll-up banner with event title, schedule, highlights and a registration call to action.',
  resolution: { width: 800, height: 2000, aspectRatio: '2 / 5' },
  component: Component,
  schema,
  placeholders: {
    eyebrow: 'Annual meet 2026',
    title: 'Creators Summit',
    subtitle: 'A day of talks, workshops and screenings for independent filmmakers.',
    date: '21 November 2026',
    time: '10:00 AM – 6:00 PM',
    venue: 'Nandan Auditorium, Kolkata',
    highlights: [
      'Keynote on modern storytelling',
      'Hands-on cinematography lab',
      'Short film screening',
      'Networking lunch',
    ],
    registerLabel: 'Register free',
    registerUrl: 'modesthumanbrands.com/summit',
  },
  transformPayload: (values, org) => ({
    ...brandProps(org),
    eyebrow: text(values.eyebrow),
    title: text(values.title),
    subtitle: text(values.subtitle),
    date: text(values.date),
    time: text(values.time),
    venue: text(values.venue),
    highlights: list(values.highlights, 5),
    registerLabel: text(values.registerLabel),
    registerUrl: text(values.registerUrl),
  }),
} satisfies DesignTemplateDefinition