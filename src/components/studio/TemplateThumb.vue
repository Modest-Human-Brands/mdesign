<script setup lang="ts">
import { computed } from 'vue'

import { useDesignWizardStore } from '@/stores/designWizard'
import type { DesignTemplateDefinition } from '@templates/types'

const props = defineProps<{ template: DesignTemplateDefinition }>()

const wizard = useDesignWizardStore()

const MAX_WIDTH = 160
const MAX_HEIGHT = 140

const scale = computed(() =>
  Math.min(
    MAX_WIDTH / props.template.resolution.width,
    MAX_HEIGHT / props.template.resolution.height,
  ),
)
const size = computed(() => ({
  width: props.template.resolution.width * scale.value,
  height: props.template.resolution.height * scale.value,
}))
const payload = computed(() =>
  props.template.transformPayload(props.template.placeholders, wizard.organization),
)
</script>

<template>
  <span class="flex size-full items-center justify-center" aria-hidden="true">
    <span
      class="relative block overflow-hidden rounded-sm shadow-doc-page"
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
    >
      <span
        class="pointer-events-none block origin-top-left bg-white"
        :style="{
          width: `${template.resolution.width}px`,
          height: `${template.resolution.height}px`,
          transform: `scale(${scale})`,
        }"
      >
        <component :is="template.component" v-bind="payload" />
      </span>
    </span>
  </span>
</template>