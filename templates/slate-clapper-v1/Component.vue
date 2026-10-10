<script setup lang="ts">
import { useGoogleFont } from '../useGoogleFont'

defineProps<{
  organizationName: string
  organizationLogo: string
  organizationFont: string
  colorAccent: string
  production: string
  director: string
  cinematographer: string
  scene: string
  take: string
  roll: string
  date: string
  notes: string
}>()

useGoogleFont('JetBrains Mono')

const MONO = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
const label = 'text-[20px] tracking-[3px] text-[#94a3b8] uppercase'
</script>

<template>
  <div
    class="leading-normal relative size-full overflow-hidden bg-[#1f2937] text-[#f8fafc]"
    :style="{ fontFamily: organizationFont }"
  >
    <div
      class="absolute top-[90px] right-[120px] left-[120px] flex h-[90px] gap-0 overflow-hidden border-[6px] border-[#f8fafc] bg-[#0B0F19]"
    >
      <span
        v-for="i in 12"
        :key="i"
        class="h-full flex-1"
        :style="{ backgroundColor: i % 2 === 0 ? colorAccent : '#F8FAFC' }"
      />
    </div>

    <div
      class="absolute top-[190px] right-[120px] bottom-[110px] left-[120px] rounded-b-[18px] border-[6px] border-[#f8fafc] bg-[#0B0F19] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div
        class="flex h-[150px] items-center justify-between border-b-4 border-[#f8fafc] px-[34px]"
      >
        <div class="min-w-0">
          <p :class="label" :style="{ fontFamily: MONO }">Production</p>
          <h1 class="mt-1 truncate text-[56px] leading-[68px] font-bold">{{ production }}</h1>
        </div>
        <img
          v-if="organizationLogo"
          :src="organizationLogo"
          alt=""
          class="size-[90px] shrink-0 object-contain"
        />
        <span v-else class="shrink-0 text-[28px] font-bold" :style="{ color: colorAccent }">{{
          organizationName
        }}</span>
      </div>

      <div
        class="grid h-[160px] grid-cols-3 border-b-4 border-[#f8fafc]"
        :style="{ fontFamily: MONO }"
      >
        <div class="border-r-4 border-[#f8fafc] px-[34px] pt-[18px]">
          <p :class="label">Scene</p>
          <p class="mt-2 truncate text-[70px] leading-[80px] font-bold">{{ scene }}</p>
        </div>
        <div class="border-r-4 border-[#f8fafc] px-[34px] pt-[18px]">
          <p :class="label">Take</p>
          <p
            class="mt-2 truncate text-[70px] leading-[80px] font-bold"
            :style="{ color: colorAccent }"
          >
            {{ take }}
          </p>
        </div>
        <div class="px-[34px] pt-[18px]">
          <p :class="label">Roll</p>
          <p class="mt-2 truncate text-[70px] leading-[80px] font-bold">{{ roll }}</p>
        </div>
      </div>

      <div class="grid h-[140px] grid-cols-3">
        <div class="border-r-4 border-[#f8fafc] px-[34px] pt-[18px]">
          <p :class="label" :style="{ fontFamily: MONO }">Director</p>
          <p class="mt-2 truncate text-[38px]">{{ director }}</p>
        </div>
        <div class="border-r-4 border-[#f8fafc] px-[34px] pt-[18px]">
          <p :class="label" :style="{ fontFamily: MONO }">Camera</p>
          <p class="mt-2 truncate text-[38px]">{{ cinematographer }}</p>
        </div>
        <div class="px-[34px] pt-[18px]">
          <p :class="label" :style="{ fontFamily: MONO }">Date</p>
          <p class="mt-2 truncate text-[38px]" :style="{ fontFamily: MONO }">{{ date }}</p>
        </div>
      </div>

      <div class="px-[34px] pt-2">
        <p :class="label" :style="{ fontFamily: MONO }">Notes</p>
        <p class="mt-2 line-clamp-2 text-[30px] leading-10 text-[#cbd5e1]">{{ notes }}</p>
      </div>
    </div>
  </div>
</template>