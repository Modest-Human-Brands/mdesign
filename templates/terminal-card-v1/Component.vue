<script setup lang="ts">
import { useGoogleFont } from '../useGoogleFont'

defineProps<{
  organizationName: string
  organizationLogo: string
  organizationFont: string
  colorAccent: string
  onAccent: string
  gradient: string
  topic: string
  question: string
  options: string[]
  hint: string
  handle: string
}>()

useGoogleFont('JetBrains Mono')

const MONO = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
const LETTERS = ['A', 'B', 'C', 'D']
</script>

<template>
  <div
    class="leading-normal relative size-full overflow-hidden bg-[#05070F] text-white"
    :style="{ background: gradient }"
  >
    <div class="absolute inset-0 bg-[#05070F]/70" />

    <div
      class="absolute top-[70px] right-[90px] bottom-[70px] left-[90px] flex flex-col overflow-hidden rounded-[22px] border-2 border-[#1e293b] bg-[#0D1220] shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
      :style="{ fontFamily: MONO }"
    >
      <header class="relative flex h-16 shrink-0 items-center gap-3 bg-[#111827] px-7">
        <span class="size-4 rounded-full bg-[#FF5F57]" />
        <span class="size-4 rounded-full bg-[#FEBC2E]" />
        <span class="size-4 rounded-full bg-[#28C840]" />
        <span class="absolute inset-x-0 text-center text-[20px] text-[#64748b]"
          >quiz — {{ topic.toLowerCase() }} — 80x24</span
        >
      </header>

      <div class="flex min-h-0 flex-1 flex-col px-14 pt-9">
        <p class="truncate text-[26px] text-[#4ade80]">$ quiz --topic "{{ topic }}"</p>
        <h1 class="mt-5 line-clamp-3 text-[46px] leading-[62px] font-bold text-[#f8fafc]">
          {{ question }}
        </h1>

        <div class="mt-auto grid grid-cols-2 gap-6 pb-7">
          <div
            v-for="(option, index) in options"
            :key="index"
            class="flex h-[76px] items-center gap-5 rounded-[14px] border-2 border-[#243049] bg-[#111A2E] px-4"
          >
            <span
              class="flex size-11 shrink-0 items-center justify-center rounded-[10px] text-[26px] font-bold"
              :style="{ backgroundColor: colorAccent, color: onAccent }"
              >{{ LETTERS[index] }}</span
            >
            <span class="truncate text-[28px] text-[#e2e8f0]">{{ option }}</span>
          </div>
        </div>
        <p class="truncate pb-6 text-[22px] text-[#64748b]">// hint: {{ hint }}</p>
      </div>

      <footer
        class="flex h-16 shrink-0 items-center justify-between bg-[#0A0F1C] px-14"
        :style="{ fontFamily: organizationFont }"
      >
        <span class="flex items-center gap-4">
          <img
            v-if="organizationLogo"
            :src="organizationLogo"
            alt=""
            class="size-10 object-contain"
          />
          <span class="text-[24px] font-bold text-[#f8fafc]">{{ organizationName }}</span>
        </span>
        <span class="text-[22px]" :style="{ color: colorAccent, fontFamily: MONO }">{{
          handle
        }}</span>
      </footer>
    </div>
  </div>
</template>