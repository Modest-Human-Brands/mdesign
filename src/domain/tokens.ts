// Token payload: every dynamic field of a template holds its own label as `{{Field Label}}`, using the label the
// Content form shows (the schema `title`). Previews show a token wherever the user has not filled a field yet, so it
// is clear which text is dynamic and what it will contain. A short or ambiguous label is prefixed with its section
// (e.g. `{{Flap Heading}}` vs `{{Inside Left Heading}}`) so every token maps to exactly one form field.
import { parseSchemaToJsonSchema } from './schemaConverter'
import type { JsonSchema } from './types'
import type { Values } from './schema'
import type { z } from 'zod'

export const token = (label: string) => `{{${label}}}`

export const isToken = (value: unknown): boolean =>
  typeof value === 'string' && /^\{\{.*\}\}$/.test(value.trim())

/** The text of `value`, or '' when it is empty or still a placeholder token. */
export const realText = (value: unknown): string =>
  typeof value === 'string' && !isToken(value) ? value.trim() : ''

const singular = (label: string) =>
  label.endsWith('s') && !label.endsWith('ss') ? label.slice(0, -1) : label

/** Section of a field: the nearest array (e.g. "Service"), else its top-level group (e.g. "Flap"), else none. */
function sectionOf(parents: JsonSchema[]): string {
  const nearestArray = [...parents].reverse().find((parent) => parent.type === 'array')
  if (nearestArray) return singular(nearestArray.title ?? '')
  return parents[0]?.title ?? ''
}

/** The root object is not a section; everything below it is. */
const parentsFor = (parents: JsonSchema[], node: JsonSchema, isRoot: boolean) =>
  isRoot ? [] : [...parents, node]

const isLeaf = (node: JsonSchema | undefined) =>
  ['string', 'number', 'integer'].includes(node?.type ?? '') && !Array.isArray(node?.enum)

function collectTitles(
  node: JsonSchema | undefined,
  parents: JsonSchema[],
  counts: Map<string, number>,
  isRoot = false,
) {
  if (!node) return
  if (node.type === 'object' && node.properties) {
    for (const child of Object.values(node.properties)) {
      collectTitles(child, parentsFor(parents, node, isRoot), counts)
    }
  } else if (node.type === 'array') {
    collectTitles(node.items, [...parents, node], counts)
  } else if (isLeaf(node)) {
    const title = node.title ?? sectionOf(parents) ?? 'Value'
    counts.set(title, (counts.get(title) ?? 0) + 1)
  }
}

function build(
  node: JsonSchema | undefined,
  placeholder: unknown,
  parents: JsonSchema[],
  counts: Map<string, number>,
  isRoot = false,
): unknown {
  if (!node) return undefined

  if (node.type === 'object' && node.properties) {
    const result: Values = {}
    const source = (placeholder ?? {}) as Values
    for (const [key, child] of Object.entries(node.properties)) {
      const value = build(child, source[key], parentsFor(parents, node, isRoot), counts)
      if (value !== undefined) result[key] = value
    }
    return result
  }

  if (node.type === 'array') {
    const first = Array.isArray(placeholder) ? (placeholder[0] as unknown) : undefined
    const item = build(node.items, first, [...parents, node], counts)
    return item === undefined ? [] : [item]
  }

  // Enums and booleans must stay valid values (they switch layout); everything else becomes its label
  if (Array.isArray(node.enum)) {
    return placeholder !== undefined && node.enum.includes(placeholder as string | number)
      ? placeholder
      : node.enum[0]
  }
  if (node.type === 'boolean') return typeof placeholder === 'boolean' ? placeholder : false

  // Decor / image pickers hold a reference, not text: keep the template's default (or none)
  if (node['x-widget']) return typeof placeholder === 'string' ? placeholder : ''

  if (isLeaf(node)) {
    const section = sectionOf(parents)
    const title = node.title ?? (section || 'Value')
    // Multi-word labels ('Call To Action Label') are already specific; short ones ('Heading') get their section
    const specific = title.includes(' ') && (counts.get(title) ?? 0) <= 1
    return token(
      specific || !section || title.toLowerCase().includes(section.toLowerCase())
        ? title
        : `${section} ${title}`,
    )
  }
  return undefined
}

/** Values holding `{{Field Label}}` for every dynamic field; enums keep their default so layouts stay valid. */
export function buildTokens(schema: JsonSchema, placeholders: Values = {}): Values {
  const counts = new Map<string, number>()
  collectTitles(schema, [], counts, true)
  return (build(schema, placeholders, [], counts, true) ?? {}) as Values
}

const cache = new Map<string, Values>()

/** Cached token payload for a template (keyed by its id). */
export function tokensFor(id: string, schema: z.ZodType, placeholders: Values = {}): Values {
  const hit = cache.get(id)
  if (hit) return structuredClone(hit)
  const tokens = buildTokens(parseSchemaToJsonSchema(schema, placeholders), placeholders)
  cache.set(id, tokens)
  return structuredClone(tokens)
}