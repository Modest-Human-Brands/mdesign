<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, ref, watch, useTemplateRef, type ComponentPublicInstance } from 'vue'

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
const { width: stageWidth, height: stageHeight } = useElementSize(stage)

const template = computed(() => wizard.template)
const resolution = computed(() => template.value?.resolution ?? { width: 1200, height: 800 })
const pageCount = computed(() => wizard.pageCount)
const pages = computed(() => Array.from({ length: pageCount.value }, (_, index) => index))

const PADDING = 48
const PAGE_GAP = 24
const zoom = ref(100)

const fitScale = computed(() => {
  const availableWidth = Math.max(120, stageWidth.value - PADDING * 2)
  const availableHeight = Math.max(120, stageHeight.value - PADDING * 2)
  const byWidth = availableWidth / resolution.value.width
  return pageCount.value > 1
    ? byWidth
    : Math.min(byWidth, availableHeight / resolution.value.height)
})
const scale = computed(() => fitScale.value * (zoom.value / 100))

watch(
  () => wizard.templateId,
  () => (zoom.value = 100),
)

const captureElements: (HTMLElement | null)[] = []
function setCapture(element: Element | ComponentPublicInstance | null, index: number) {
  captureElements[index] = element instanceof HTMLElement ? element : null
}

defineExpose({
  getCaptureElements: () =>
    captureElements
      .slice(0, pageCount.value)
      .filter((element): element is HTMLElement => !!element),
})

const label = computed(() => props.label)

const pageProps = (index: number) =>
  pageCount.value > 1 ? { ...wizard.renderedProps, page: index } : wizard.renderedProps
</script>

<template>
  <section
    class="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-dark-500"
    :aria-label="label"
  >
    <p class="px-5 pt-4 text-xs text-light-400">
      {{ label
      }}<span v-if="template">
        · {{ resolution.width }} × {{ resolution.height }} px<span v-if="pageCount > 1">
          · {{ pageCount }} pages</span
        ></span
      >
    </p>

    <div ref="stage" class="no-scrollbar relative flex min-h-0 flex-1 overflow-auto p-12">
      <div v-if="template" class="m-auto flex shrink-0 flex-col" :style="{ gap: `${PAGE_GAP}px` }">
        <div
          v-for="index in pages"
          :key="index"
          class="shadow-doc-page"
          :style="{
            width: `${resolution.width * scale}px`,
            height: `${resolution.height * scale}px`,
          }"
          :aria-label="pageCount > 1 ? `Page ${index + 1} of ${pageCount}` : undefined"
        >
          <div
            class="origin-top-left"
            :style="{
              width: `${resolution.width}px`,
              height: `${resolution.height}px`,
              transform: `scale(${scale})`,
            }"
          >
            <div
              :ref="(element) => setCapture(element, index)"
              class="overflow-hidden bg-white"
              :style="{ width: `${resolution.width}px`, height: `${resolution.height}px` }"
            >
              <component :is="template.component" v-bind="pageProps(index)" />
            </div>
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