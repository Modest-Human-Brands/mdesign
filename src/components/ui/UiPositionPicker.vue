<script setup lang="ts">
import { computed, useId } from 'vue'

import type { PositionMap } from '@/domain/types'

const model = defineModel<string>({ required: true })

const props = defineProps<{
  label: string
  values: string[]
  positions: PositionMap
  error?: string
}>()

const id = useId()

const humanize = (value: string) => value.replaceAll('-', ' ').replace(/^./, (c) => c.toUpperCase())

const byAnchor = computed(
  () =>
    new Map(
      Object.entries(props.positions).map(([value, option]) => [option.anchor, value] as const),
    ),
)

const chips = computed(() => props.values.filter((value) => !(value in props.positions)))

const lit = computed(() => {
  const selected = props.positions[model.value]
  return new Set(selected ? (selected.cells ?? [selected.anchor]) : [])
})

const cells = Array.from({ length: 9 }, (_, index) => index)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <span :id="id" class="text-sm font-semi-bold text-light-600">{{ label }}</span>
    <div class="flex items-end gap-3">
      <div
        role="radiogroup"
        :aria-labelledby="id"
        :aria-invalid="error ? 'true' : undefined"
        tabindex="-1"
        class="grid size-24 shrink-0 grid-cols-3 rounded-md border bg-dark-500 p-1 outline-none"
        :class="error ? 'border-alert-500' : 'border-dark-600'"
      >
        <template v-for="cell in cells" :key="cell">
          <button
            v-if="byAnchor.has(cell)"
            type="button"
            role="radio"
            :aria-checked="model === byAnchor.get(cell)"
            :aria-label="humanize(byAnchor.get(cell) ?? '')"
            :title="humanize(byAnchor.get(cell) ?? '')"
            class="flex items-center justify-center rounded-sm outline-none focus-visible:shadow-focus-ring"
            @click="model = byAnchor.get(cell) ?? model"
          >
            <span
              v-if="lit.has(cell)"
              class="h-1.5 w-5 rounded-full bg-accent-400"
              aria-hidden="true"
            />
            <span
              v-else
              class="size-1.5 rounded-full bg-light-400 hover:bg-white"
              aria-hidden="true"
            />
          </button>
          <span v-else class="flex items-center justify-center" aria-hidden="true">
            <span v-if="lit.has(cell)" class="h-1.5 w-5 rounded-full bg-accent-400" />
            <span v-else class="size-0.75 rounded-full bg-dark-600" />
          </span>
        </template>
      </div>

      <div class="flex min-w-0 flex-col gap-1.5">
        <span class="truncate text-xs text-light-400" aria-live="polite">
          {{ model ? humanize(model) : 'Not set' }}
        </span>
        <p v-if="error" class="text-xs text-alert-400" role="alert">{{ error }}</p>
        <div v-if="chips.length > 0" class="flex flex-wrap gap-1.5">
          <button
            v-for="chip in chips"
            :key="chip"
            type="button"
            class="rounded-md border px-2.5 py-1 text-xs font-semi-bold outline-none focus-visible:shadow-focus-ring"
            :class="
              model === chip
                ? 'border-accent-400 bg-dark-600 text-white'
                : 'border-dark-600 bg-dark-500 text-light-400 hover:text-white'
            "
            @click="model = chip"
          >
            {{ humanize(chip) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>