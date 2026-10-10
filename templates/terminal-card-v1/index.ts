import { z } from 'zod'

import { brandProps, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

export const schema = z.object({
  fileName: z.string().optional(),
  question: z.string().min(1, 'Question is required'),
  footer: z.object({
    left: z.string().optional(),
    right: z.string().optional(),
  }),
})

export default {
  id: 'terminal-card-v1',
  label: 'Terminal Question Card',
  shortLabel: 'Terminal Card',
  category: 'Social',
  description:
    'A code-editor window with numbered lines on a fluid brand gradient, with a caption line underneath.',
  resolution: { width: 1280, height: 520, aspectRatio: '32 / 13' },
  component: Component,
  schema,
  placeholders: {
    fileName: '~/question.md',
    question:
      'I never got ask you what you think about @tanstack/vue-query? Does it have a place in a nuxt application?',
    footer: { left: 'yourname.dev/ask', right: 'asked 2 weeks ago' },
  },
  transformPayload: (values, org) => ({
    ...brandProps(org),
    fileName: text(values.fileName),
    question: text(values.question),
    footerLeft: text(values.footer?.left),
    footerRight: text(values.footer?.right),
  }),
} satisfies DesignTemplateDefinition