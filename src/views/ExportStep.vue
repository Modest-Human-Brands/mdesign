<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

import StageViewport from '@/components/studio/StageViewport.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiSegmentedControl from '@/components/ui/UiSegmentedControl.vue'
import UiTextField from '@/components/ui/UiTextField.vue'
import WizardShell from '@/components/wizard/WizardShell.vue'
import { safeFileName, saveBlob } from '@/domain/download'
import { exportElementToBlob, type ExportFormat } from '@/domain/imageExport'
import { STEPS, useDesignWizardStore } from '@/stores/designWizard'

defineOptions({ name: 'ExportStep' })

const router = useRouter()
const wizard = useDesignWizardStore()
const stage = useTemplateRef<InstanceType<typeof StageViewport>>('stage')

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'svg', label: 'SVG' },
]

const format = ref<ExportFormat>('png')
const scale = ref('2')
const fileName = ref('')
const busy = ref(false)
const error = ref<string | null>(null)
const lastSize = ref<string | null>(null)

const template = computed(() => wizard.template)
const label = computed(() => template.value?.label ?? 'Design')
const defaultName = computed(() => `${template.value?.id ?? 'design'}`)

// 1x is the design size; the "print" option reaches 300 DPI from the 72 DPI design grid
const SCALES = computed(() => [
  { value: '1', label: '1x' },
  { value: '2', label: '2x' },
  { value: '4.1667', label: '300 DPI' },
])

const outputSize = computed(() => {
  const resolution = template.value?.resolution
  if (!resolution) return ''
  const factor = format.value === 'svg' ? 1 : Number(scale.value)
  return `${Math.round(resolution.width * factor)} × ${Math.round(resolution.height * factor)} px`
})

async function download() {
  const element = stage.value?.getCaptureElement()
  const active = template.value
  if (!element || !active) return
  busy.value = true
  error.value = null
  try {
    const blob = await exportElementToBlob({
      element,
      width: active.resolution.width,
      height: active.resolution.height,
      format: format.value,
      scale: Number(scale.value),
    })
    const base = safeFileName(fileName.value || defaultName.value, 'design').replace(
      /\.(png|webp|jpe?g|svg)$/i,
      '',
    )
    saveBlob(blob, `${base}.${format.value === 'jpeg' ? 'jpg' : format.value}`)
    lastSize.value = `${(blob.size / 1024).toFixed(0)} KB`
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Export failed.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <WizardShell
    :step="3"
    title="Export your design"
    subtitle="Rendered in your browser. Nothing is uploaded."
  >
    <UiSegmentedControl v-model="format" label="Format" :options="FORMATS" />
    <UiSegmentedControl
      v-if="format !== 'svg'"
      v-model="scale"
      label="Resolution"
      :options="SCALES"
    />
    <UiTextField v-model="fileName" label="File name" hint="optional" :placeholder="defaultName" />

    <dl class="flex flex-col rounded-lg border border-dark-600 bg-dark-500">
      <div class="flex gap-4 border-b border-dark-600 px-3 py-2.5">
        <dt class="w-28 shrink-0 text-sm text-light-400">Template</dt>
        <dd class="text-sm text-white">{{ label }}</dd>
      </div>
      <div class="flex gap-4 border-b border-dark-600 px-3 py-2.5">
        <dt class="w-28 shrink-0 text-sm text-light-400">Output size</dt>
        <dd class="text-sm text-white">{{ outputSize }}</dd>
      </div>
      <div class="flex gap-4 px-3 py-2.5">
        <dt class="w-28 shrink-0 text-sm text-light-400">Last file</dt>
        <dd class="text-sm text-white">{{ lastSize ?? '—' }}</dd>
      </div>
    </dl>

    <p v-if="error" class="rounded-md bg-alert-600 px-3 py-2 text-sm text-white" role="alert">
      Export failed: {{ error }}
    </p>

    <template #note>{{ `${label} ready to export` }}</template>
    <template #actions>
      <UiButton variant="ghost" @click="router.push(STEPS[2].path)">Back</UiButton>
      <UiButton :disabled="busy || !template" @click="download">{{
        busy ? 'Rendering…' : `Download ${format.toUpperCase()}`
      }}</UiButton>
    </template>

    <template #preview>
      <StageViewport
        ref="stage"
        :label="`Final preview · ${label}`"
        show-download
        :download-disabled="busy"
        @download="download"
      />
    </template>
  </WizardShell>
</template>