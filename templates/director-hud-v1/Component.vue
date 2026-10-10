<script setup lang="ts">
defineProps<{
  organizationName: string
  organizationLogo: string
  organizationFont: string
  colorAccent: string
  gradient: string
  title: string
  subtitle: string
  camera: string
  scene: string
  take: string
  roll: string
  timecode: string
  fps: string
  iso: string
}>()

const corner = [
  'top-[70px] left-[70px] border-t-[5px] border-l-[5px]',
  'top-[70px] right-[70px] border-t-[5px] border-r-[5px]',
  'bottom-[70px] left-[70px] border-b-[5px] border-l-[5px]',
  'bottom-[70px] right-[70px] border-r-[5px] border-b-[5px]',
]
</script>

<template>
  <div
    class="leading-normal relative size-full overflow-hidden bg-black text-white/90"
    :style="{ background: gradient, fontFamily: organizationFont }"
  >
    <div class="absolute inset-0 bg-black/40" />
    <div class="absolute inset-x-0 bottom-0 h-[45%] bg-black/45" />

    <span
      v-for="position in corner"
      :key="position"
      class="absolute size-[60px] border-white/90"
      :class="position"
    />

    <span
      class="absolute top-1/2 left-1/2 h-[3px] w-[60px] -translate-x-1/2 -translate-y-1/2 bg-white/70"
    />
    <span
      class="absolute top-1/2 left-1/2 h-[60px] w-[3px] -translate-x-1/2 -translate-y-1/2 bg-white/70"
    />
    <span class="absolute top-1/2 left-1/3 h-7 w-0.5 -translate-y-1/2 bg-white/35" />
    <span class="absolute top-1/2 left-2/3 h-7 w-0.5 -translate-y-1/2 bg-white/35" />

    <div
      class="absolute top-[100px] right-[100px] left-[100px] flex items-center justify-between text-[28px] tracking-[3px]"
    >
      <span class="flex items-center gap-5 font-bold"
        ><span class="size-[22px] rounded-full bg-[#ef4444]" />REC {{ timecode }}</span
      >
      <span class="text-[26px] tracking-[2px]">{{ camera }} · {{ fps }} · {{ iso }}</span>
    </div>

    <div
      class="absolute right-[100px] bottom-[230px] left-[100px] flex gap-7"
      :style="{ fontFamily: organizationFont }"
    >
      <span class="w-2 shrink-0 self-stretch" :style="{ backgroundColor: colorAccent }" />
      <div class="min-w-0">
        <h1 class="line-clamp-2 text-[96px] leading-[108px] font-bold text-white">{{ title }}</h1>
        <p class="mt-3 truncate text-[38px] text-white/80">{{ subtitle }}</p>
      </div>
    </div>

    <div
      class="absolute right-[100px] bottom-[100px] left-[100px] flex items-center justify-between text-[26px] tracking-[2px]"
    >
      <span>SCENE {{ scene }}&nbsp;&nbsp; TAKE {{ take }}&nbsp;&nbsp; ROLL {{ roll }}</span>
      <span class="flex items-center gap-5 font-bold" :style="{ fontFamily: organizationFont }">
        {{ organizationName }}
        <img
          v-if="organizationLogo"
          :src="organizationLogo"
          alt=""
          class="size-14 object-contain"
        />
      </span>
    </div>
  </div>
</template>