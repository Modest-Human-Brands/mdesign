<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  organizationFont: string
  fluidGradient: string
  fileName: string
  question: string
  footerLeft: string
  footerRight: string
}>()

const MAX_CHARS = 56
const MAX_LINES = 5
const LINE_HEIGHT = 34

function wrap(value: string): string[] {
  const lines: string[] = []
  for (const paragraph of value.split('\n')) {
    let line = ''
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const chunks = word.match(new RegExp(`.{1,${MAX_CHARS}}`, 'g')) ?? [word]
      for (const chunk of chunks) {
        if (line && `${line} ${chunk}`.length > MAX_CHARS) {
          lines.push(line)
          line = chunk
        } else {
          line = line ? `${line} ${chunk}` : chunk
        }
      }
    }
    lines.push(line)
  }
  if (lines.length <= MAX_LINES) return lines
  const kept = lines.slice(0, MAX_LINES)
  kept[MAX_LINES - 1] = `${kept[MAX_LINES - 1]!.slice(0, MAX_CHARS - 1)}…`
  return kept
}

const lines = computed(() => wrap(props.question))
const bodyHeight = computed(() => Math.max(lines.value.length, 2) * LINE_HEIGHT + 92)
</script>

<template>
  <div
    class="relative size-full overflow-hidden leading-normal text-white"
    :style="{ background: fluidGradient, fontFamily: organizationFont }"
  >
    <div class="absolute top-1/2 right-[102px] left-[102px] -translate-y-1/2">
      <div
        class="overflow-hidden rounded-[22px] border border-black/25 bg-[#2A2F3E] shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
      >
        <div class="relative flex h-[70px] items-center gap-4 px-[22px]">
          <span class="size-5 rounded-full bg-[#FF5F57]" />
          <span class="size-5 rounded-full bg-[#FEBC2E]" />
          <span class="size-5 rounded-full bg-[#28C840]" />
          <span class="absolute inset-x-0 text-center text-[22px] text-[#6B7385]">{{
            fileName
          }}</span>
        </div>

        <div class="flex flex-col justify-center pr-12 pl-7" :style="{ height: `${bodyHeight}px` }">
          <div
            v-for="(line, index) in lines"
            :key="index"
            class="flex items-baseline whitespace-pre"
            :style="{ height: `${LINE_HEIGHT}px`, fontVariantLigatures: 'none' }"
          >
            <span class="w-12 shrink-0 text-[16px] text-[#6B7385]">{{ index + 1 }}</span>
            <span class="text-[25px] text-[#C9CED9]">{{ line }}</span>
          </div>
        </div>
      </div>

      <div class="mt-7 flex items-center justify-between px-[2px] text-[25px] font-medium">
        <span>{{ footerLeft }}</span>
        <span>{{ footerRight }}</span>
      </div>
    </div>
  </div>
</template>