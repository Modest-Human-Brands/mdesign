import type { DesignTemplateDefinition } from './types'

const modules = import.meta.glob<{ default: DesignTemplateDefinition }>('./*/index.ts', {
  eager: true,
})

export const templateRegistry: Record<string, DesignTemplateDefinition> = {}

for (const path of Object.keys(modules).sort()) {
  const template = modules[path]?.default
  if (template?.id) templateRegistry[template.id] = template
}

export const getTemplate = (id: string): DesignTemplateDefinition | undefined =>
  templateRegistry[id]
export const getAllTemplates = (): DesignTemplateDefinition[] => Object.values(templateRegistry)

export function categoryFilters(
  templates: DesignTemplateDefinition[],
): { id: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const template of templates)
    counts.set(template.category, (counts.get(template.category) ?? 0) + 1)
  return [
    { id: 'All', count: templates.length },
    ...[...counts].map(([id, count]) => ({ id, count })),
  ]
}