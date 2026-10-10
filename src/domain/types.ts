export interface JsonSchema {
  type?: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean'
  title?: string
  description?: string
  properties?: Record<string, JsonSchema>
  required?: string[]
  items?: JsonSchema
  enum?: (string | number)[]
  format?: string
  minimum?: number
  maximum?: number
  default?: unknown
  'x-auto'?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  'x-section'?: string
  'x-column'?: number
  'x-order'?: number
  'x-widget'?: 'decor' | 'image'
  'x-decor-slot'?: string
}

export interface FontSummary {
  /** Google Fonts family, e.g. "Exo 2". */
  family: string
  /** Value stored for branding, e.g. "Exo2". */
  name: string
}