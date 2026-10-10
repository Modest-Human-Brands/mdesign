import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useNotForm } from 'notform'

import { loadGoogleFont } from '@/domain/fonts'
import { buildFormSchema, emptyFormSchema, validateForm } from '@/domain/formSchema'
import {
  loadOrganization,
  saveOrganization,
  DEFAULT_FONT,
  type OrganizationProfile,
} from '@/domain/organization'
import { organizationFormSchema } from '@/domain/organizationForm'
import { parseSchemaToJsonSchema } from '@/domain/schemaConverter'
import { tokensFor } from '@/domain/tokens'
import {
  emptyValue,
  schemaDefaults,
  toPayload,
  withDefaults,
  type Problem,
  type Values,
} from '@/domain/schema'
import type { JsonSchema } from '@/domain/types'
import { getTemplate } from '@templates/registry'
import type { DesignTemplateDefinition } from '@templates/types'

export const STEPS = [
  { name: 'template', label: 'Template', path: '/studio/template' },
  { name: 'brand', label: 'Brand', path: '/studio/brand' },
  { name: 'details', label: 'Content', path: '/studio/details' },
  { name: 'export', label: 'Export', path: '/studio/export' },
] as const

const DRAFT_KEY = 'mdesign.draft'

interface Draft {
  templateId: string | null
  values: Values
}

/** `override` wins over `base`; empty strings and missing keys fall back to the sample copy. */
function mergeOver(base: unknown, override: unknown): unknown {
  if (override === undefined || override === null || override === '') return base
  if (Array.isArray(override)) return override
  if (
    typeof override === 'object' &&
    base !== null &&
    typeof base === 'object' &&
    !Array.isArray(base)
  ) {
    const result: Values = { ...(base as Values) }
    for (const [key, value] of Object.entries(override))
      result[key] = mergeOver((base as Values)[key], value)
    return result
  }
  return override
}

export const useDesignWizardStore = defineStore('designWizard', () => {
  const draft = useStorage<Partial<Draft>>(DRAFT_KEY, {}, undefined, {
    listenToStorageChanges: false,
  })
  const saved = draft.value

  const initialTemplate = saved?.templateId ? getTemplate(saved.templateId) : undefined
  const templateId = ref<string | null>(initialTemplate?.id ?? null)

  const template = computed<DesignTemplateDefinition | null>(() =>
    templateId.value ? (getTemplate(templateId.value) ?? null) : null,
  )
  const schema = computed<JsonSchema | null>(() =>
    template.value
      ? parseSchemaToJsonSchema(template.value.schema, template.value.placeholders)
      : null,
  )
  const formSchema = computed(() =>
    schema.value ? buildFormSchema(schema.value) : emptyFormSchema,
  )

  const form = useNotForm({
    schema: () => formSchema.value,
    initialValues: initialTemplate ? (saved?.values ?? {}) : {},
  })
  const values = form.values as Values

  const organizationForm = useNotForm({
    schema: organizationFormSchema,
    initialValues: loadOrganization(),
  })
  const organization = organizationForm.values as OrganizationProfile
  const organizationSaved = ref(true)

  const submitAttempted = ref(false)

  const problems = computed<Problem[]>(() =>
    schema.value ? validateForm(formSchema.value, values) : [],
  )

  const pageCount = computed(() => template.value?.pages ?? 1)

  /** Props for the template component: form values over `{{Field Label}}` tokens, plus the organisation's branding. */
  const renderedProps = computed<Record<string, unknown>>(() => {
    const active = template.value
    if (!active || !schema.value) return {}
    const payload = (toPayload(schema.value, values) ?? {}) as Values
    const tokens = tokensFor(active.id, active.schema, active.placeholders)
    return active.transformPayload(mergeOver(tokens, payload) as Values, organization)
  })

  function selectTemplate(id: string | null) {
    if (templateId.value === id) return
    templateId.value = id
    submitAttempted.value = false

    const next = id ? getTemplate(id) : undefined
    if (!next) {
      form.reset({})
      return
    }
    const json = parseSchemaToJsonSchema(next.schema, next.placeholders)
    form.reset(withDefaults(schemaDefaults(json), emptyValue(json)) as Values)
  }

  function setValue(path: (string | number)[], value: unknown) {
    form.setValue(path.join('.'), value)
  }

  function saveOrganizationProfile() {
    saveOrganization(organization)
    organizationSaved.value = true
  }

  function reset() {
    templateId.value = null
    submitAttempted.value = false
    form.reset({})
  }

  watch(organization, () => (organizationSaved.value = false), { deep: true, flush: 'sync' })

  // Web fonts: load the brand font whenever it changes so the stage and exports use it
  watch(
    () => organization.font,
    (family) => {
      if (family && family !== DEFAULT_FONT) void loadGoogleFont(family)
    },
    { immediate: true },
  )

  watch(
    [templateId, values],
    () => {
      draft.value = { templateId: templateId.value, values } satisfies Draft
    },
    { deep: true },
  )

  return {
    templateId,
    template,
    schema,
    values,
    form,
    formSchema,
    organization,
    organizationForm,
    organizationSaved,
    problems,
    submitAttempted,
    renderedProps,
    pageCount,
    selectTemplate,
    setValue,
    saveOrganizationProfile,
    reset,
  }
})