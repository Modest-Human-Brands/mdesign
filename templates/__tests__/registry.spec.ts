import { describe, expect, it } from 'vite-plus/test'

import { emptyOrganization } from '@/domain/organization'
import { parseSchemaToJsonSchema } from '@/domain/schemaConverter'

import { getAllTemplates, getTemplate } from '../registry'

describe('template registry', () => {
  it('auto-discovers every template folder', () => {
    expect(
      getAllTemplates()
        .map((t) => t.id)
        .sort(),
    ).toEqual([
      'business-card-v1',
      'director-hud-v1',
      'event-standee-v1',
      'marketing-flyer-v1',
      'slate-clapper-v1',
      'terminal-card-v1',
      'trifold-brochure-v1',
    ])
    expect(getTemplate('missing')).toBeUndefined()
  })

  it.each(getAllTemplates().map((t) => [t.id, t] as const))(
    '%s has valid placeholders and a form schema',
    (_id, template) => {
      expect(template.schema.safeParse(template.placeholders).success).toBe(true)
      const json = parseSchemaToJsonSchema(template.schema, template.placeholders)
      expect(json.type).toBe('object')
      expect(Object.keys(json.properties ?? {}).length).toBeGreaterThan(0)
      const props = template.transformPayload(template.placeholders, emptyOrganization())
      expect(props.organizationName).toBe('{{Business Name}}')
      expect(props.gradient).toContain('radial-gradient')
    },
  )
})