import { z } from 'zod'

import registerTemplate, { resolutionOf } from '~/server/utils/template-registry'
import { baseFonts, brandProps, clean, cleanList, defaultOrganization, organizationSchema } from '../_shared/organization'
import Component from './component.vue'

export const terminalCardSchema = z.object({
  topic: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  hint: z.string().optional(),
  handle: z.string().optional(),
  organization: organizationSchema,
})

export type TerminalCardPayload = z.infer<typeof terminalCardSchema>

const placeholders: TerminalCardPayload = {
  topic: 'JavaScript',
  question: 'What does this print?  console.log(0.1 + 0.2 === 0.3)',
  options: ['true', 'false', 'undefined', 'TypeError'],
  hint: 'Floating point numbers are stored in binary.',
  handle: '@modesthumanbrands',
  organization: defaultOrganization,
}

registerTemplate({
  id: 'terminal-card-v1',
  label: 'Terminal Question Card',
  shortLabel: 'Terminal card',
  category: 'Social',
  description: 'A 16:9 developer quiz card styled as a terminal window, with lettered answer options.',
  resolution: resolutionOf(1600, 900),
  fonts: [...baseFonts, { name: 'JetBrainsMono', family: 'JetBrains Mono', weights: [400, 700] }],
  component: Component,
  schema: terminalCardSchema,
  placeholders,
  transformPayload: async (raw: TerminalCardPayload) => ({
    ...(await brandProps(raw.organization)),
    topic: raw.topic || placeholders.topic,
    question: raw.question || placeholders.question,
    options: cleanList(raw.options ?? placeholders.options, 4),
    hint: clean(raw.hint, placeholders.hint),
    handle: clean(raw.handle, placeholders.handle),
  }),
})
