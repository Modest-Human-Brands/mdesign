// server/utils/template-registry.ts
import type { Component } from 'vue'
import type { z } from 'zod'

import type { TemplateFont } from '~/server/utils/fonts'

export interface OutputResolution {
  width: number
  height: number
  aspectRatio: string
}

export type TemplateCategory = 'Collateral' | 'Social' | 'Stationery' | 'Display'

export interface DesignTemplate {
  id: string
  label: string
  shortLabel?: string
  category: TemplateCategory
  description: string
  /** Fixed design size in pixels; `render` multiplies it by `dpi`. */
  resolution: OutputResolution
  /** Fonts the template uses, fetched on demand (see server/utils/fonts.ts). */
  fonts?: TemplateFont[]
  component: Component
  schema: z.ZodObject<any, any>
  placeholders: Record<string, any>
  transformPayload: (rawData: any) => Promise<Record<string, any>>
}

export const templateRegistry: Record<string, DesignTemplate> = {}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/** '1600 x 900' -> { width: 1600, height: 900, aspectRatio: '16:9' } */
export function resolutionOf(width: number, height: number, aspectRatio?: string): OutputResolution {
  const divisor = gcd(width, height)
  return { width, height, aspectRatio: aspectRatio ?? `${width / divisor}:${height / divisor}` }
}

export default function registerTemplate(definition: DesignTemplate) {
  templateRegistry[definition.id] = definition
}
