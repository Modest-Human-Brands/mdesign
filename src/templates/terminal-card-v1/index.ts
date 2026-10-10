import { z } from 'zod'

import { brandProps, list, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

export const schema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string()).min(2).max(4),
  hint: z.string().optional(),
  handle: z.string().optional(),
})

export default {
  id: 'terminal-card-v1',
  label: 'Terminal Question Card',
  shortLabel: 'Terminal Card',
  category: 'Social',
  description:
    'A 16:9 developer quiz card styled as a terminal window, with lettered answer options.',
  resolution: { width: 1600, height: 900, aspectRatio: '16 / 9' },
  component: Component,
  schema,
  placeholders: {
    topic: 'JavaScript',
    question: 'What does this print?  console.log(0.1 + 0.2 === 0.3)',
    options: ['true', 'false', 'undefined', 'TypeError'],
    hint: 'Floating point numbers are stored in binary.',
    handle: '@modesthumanbrands',
  },
  transformPayload: (values, org) => ({
    ...brandProps(org),
    topic: text(values.topic),
    question: text(values.question),
    options: list(values.options, 4),
    hint: text(values.hint),
    handle: text(values.handle),
  }),
} satisfies DesignTemplateDefinition