import type { Component } from 'vue'
import type { z } from 'zod'

import type { OrganizationProfile } from '@/domain/organization'

interface OutputResolution {
  width: number
  height: number
  aspectRatio: string
  dpi?: number
}

type TemplateCategory = 'Collateral' | 'Social' | 'Stationery'

// oxlint-disable-next-line typescript/no-explicit-any
type TemplateValues = Record<string, any>

export interface DesignTemplateDefinition {
  id: string
  label: string
  shortLabel: string
  category: TemplateCategory
  description: string
  resolution: OutputResolution
  pages?: number
  component: Component
  schema: z.ZodObject<z.ZodRawShape>
  placeholders: TemplateValues
  transformPayload: (
    values: TemplateValues,
    organization: OrganizationProfile,
  ) => Record<string, unknown>
}