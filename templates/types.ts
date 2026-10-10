import type { Component } from 'vue'
import type { z } from 'zod'

import type { OrganizationProfile } from '@/domain/organization'

export interface OutputResolution {
  width: number
  height: number
  aspectRatio: string
  dpi?: number
}

export type TemplateCategory = 'Collateral' | 'Social' | 'Stationery' | 'Display'

// Form values are read defensively by each template's transformPayload, so the shape is intentionally loose.
// oxlint-disable-next-line typescript/no-explicit-any
export type TemplateValues = Record<string, any>

export interface DesignTemplateDefinition {
  id: string
  label: string
  shortLabel: string
  category: TemplateCategory
  description: string
  /** Size of one page in design pixels. */
  resolution: OutputResolution
  /** Number of pages (default 1). Multi-page components receive a zero-based `page` prop. */
  pages?: number
  component: Component
  schema: z.ZodObject<z.ZodRawShape>
  /** Sample values: enum / picker defaults for the form and the data the schema is tested against. */
  placeholders: TemplateValues
  /** Props handed to `component`: the form values merged with the organisation's branding. */
  transformPayload: (
    values: TemplateValues,
    organization: OrganizationProfile,
  ) => Record<string, unknown>
}