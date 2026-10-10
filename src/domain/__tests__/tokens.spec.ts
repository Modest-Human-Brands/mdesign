import { describe, expect, it } from 'vite-plus/test'
import { z } from 'zod'

import { parseSchemaToJsonSchema } from '../schemaConverter'
import { buildTokens, isToken, realText } from '../tokens'

const schema = z.object({
  mode: z.enum(['a', 'b']),
  flap: z.object({ heading: z.string(), text: z.string() }),
  inside: z.object({ heading: z.string() }),
  callToAction: z.object({ label: z.string() }),
  items: z.array(z.string()),
})

describe('tokens', () => {
  const tokens = buildTokens(parseSchemaToJsonSchema(schema, { mode: 'b' }), { mode: 'b' })

  it('labels every dynamic field, prefixing ambiguous names with their section', () => {
    expect(tokens).toMatchObject({
      flap: { heading: '{{Flap Heading}}', text: '{{Flap Text}}' },
      inside: { heading: '{{Inside Heading}}' },
      callToAction: { label: '{{Call To Action Label}}' },
      items: ['{{Item}}'],
    })
  })

  it('keeps enums valid and tells tokens from real text', () => {
    expect(tokens.mode).toBe('b')
    expect(isToken('{{Flap Heading}}')).toBe(true)
    expect(realText('{{Flap Heading}}')).toBe('')
    expect(realText(' Hello ')).toBe('Hello')
  })
})