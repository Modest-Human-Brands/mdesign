import { parseSchemaToJsonSchema } from './schemaConverter'
import { emptyValue, schemaDefaults, withDefaults, type Values } from './schema'
import type { DesignTemplateDefinition } from '@templates/types'

export function initialValues(template: DesignTemplateDefinition, draft?: Values): Values {
  const json = parseSchemaToJsonSchema(template.schema, template.placeholders)
  const blank = withDefaults(schemaDefaults(json), emptyValue(json))
  return withDefaults(draft ?? {}, blank) as Values
}