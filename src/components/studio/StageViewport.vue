<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, ref, useTemplateRef, watch } from 'vue'

import { useDesignWizardStore } from '@/stores/designWizard'

import StageToolbar from './StageToolbar.vue'

const props = defineProps<{
  label: string
  showDownload?: boolean
  downloadDisabled?: boolean
}>()

const emit = defineEmits<{ download: [] }>()

const wizard = useDesignWizardStore()
const stage = useTemplateRef<HTMLElement>('stage')
const captureRef = useTemplateRef<HTMLElement>('captureTarget')
const { width: stageWidth, height: stageHeight } = useElementSize(stage)

const template = computed(() => wizard.template)
const resolution = computed(() => template.value?.resolution ?? { width: 1200, height: 800 })

const PADDING = 48
const zoom = ref(100)

const fitScale = computed(() => {
  const availableWidth = Math.max(120, stageWidth.value - PADDING * 2)
  const availableHeight = Math.max(120, stageHeight.value - PADDING * 2)
  return Math.min(
    availableWidth / resolution.value.width,
    availableHeight / resolution.value.height,
  )
})
const scale = computed(() => fitScale.value * (zoom.value / 100))

watch(
  () => wizard.templateId,
  () => (zoom.value = 100),
)

defineExpose({
  getCaptureElement: () => captureRef.value,
})

const label = computed(() => props.label)
</script>

<template>
  <section
    class="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-dark-500"
    :aria-label="label"
  >
    <p class="px-5 pt-4 text-xs text-light-400">
      {{ label }}<span v-if="template"> · {{ resolution.width }} × {{ resolution.height }} px</span>
    </p>

    <div ref="stage" class="no-scrollbar relative flex min-h-0 flex-1 overflow-auto p-12">
      <div
        v-if="template"
        class="m-auto shrink-0 shadow-doc-page"
        :style="{
          width: `${resolution.width * scale}px`,
          height: `${resolution.height * scale}px`,
        }"
      >
        <div
          class="origin-top-left"
          :style="{
            width: `${resolution.width}px`,
            height: `${resolution.height}px`,
            transform: `scale(${scale})`,
          }"
        >
          <!-- The element below is what gets captured at full design resolution -->
          <div
            ref="captureTarget"
            class="overflow-hidden bg-white"
            :style="{ width: `${resolution.width}px`, height: `${resolution.height}px` }"
          >
            <component :is="template.component" v-bind="wizard.renderedProps" />
          </div>
        </div>
      </div>
      <p v-else class="m-auto text-sm text-light-400">Select a template to begin.</p>
    </div>

    <StageToolbar
      v-if="template"
      v-model:zoom="zoom"
      class="absolute bottom-6 left-1/2 -translate-x-1/2"
      :show-download="showDownload"
      :download-disabled="downloadDisabled"
      @fit="zoom = 100"
      @download="emit('download')"
    />
  </section>
</template>