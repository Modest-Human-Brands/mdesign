<script setup lang="ts">
defineProps<{
  organizationName: string
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
  onPrimary: string
  onAccent: string
  gradient: string
  eyebrow: string
  title: string
  subtitle: string
  date: string
  time: string
  venue: string
  highlights: string[]
  registerLabel: string
  registerUrl: string
}>()
</script>

<template>
  <div
    class="leading-normal relative size-full overflow-hidden bg-[#f8fafc] text-[#0f172a]"
    :style="{ fontFamily: organizationFont }"
  >
    <header class="absolute inset-x-0 top-0 h-[900px] text-white" :style="{ background: gradient }">
      <div class="absolute inset-0 bg-[#0f172a]/30" />
      <div class="absolute top-16 right-16 left-16 flex items-center gap-5">
        <img
          v-if="organizationLogo"
          :src="organizationLogo"
          alt=""
          class="size-[84px] object-contain"
        />
        <span class="truncate text-[34px] font-bold">{{ organizationName }}</span>
      </div>
      <div class="absolute right-16 bottom-[170px] left-16">
        <p class="truncate text-[28px] font-bold tracking-[6px] text-[#e2e8f0] uppercase">
          {{ eyebrow }}
        </p>
        <h1 class="mt-5 line-clamp-3 text-[118px] leading-[128px] font-bold">{{ title }}</h1>
        <p class="mt-8 line-clamp-3 text-[30px] leading-[42px] text-[#e2e8f0]">{{ subtitle }}</p>
      </div>
    </header>

    <section
      class="absolute top-[860px] right-12 left-12 rounded-[28px] bg-white p-10 shadow-[0_16px_40px_rgba(15,23,42,0.25)]"
    >
      <p class="text-[20px] font-bold tracking-[4px]" :style="{ color: colorAccent }">DATE</p>
      <p class="mt-1 truncate text-[40px] font-bold" :style="{ color: colorPrimary }">{{ date }}</p>
      <p class="mt-6 text-[20px] font-bold tracking-[4px]" :style="{ color: colorAccent }">
        TIME &amp; VENUE
      </p>
      <p class="mt-1 truncate text-[30px] text-[#334155]">{{ time }}</p>
      <p class="truncate text-[30px] text-[#334155]">{{ venue }}</p>
    </section>

    <section class="absolute top-[1210px] right-16 left-16">
      <h2 class="text-[40px] font-bold" :style="{ color: colorPrimary }">What to expect</h2>
      <ol class="mt-8 flex flex-col gap-11">
        <li v-for="(item, index) in highlights" :key="index" class="flex items-center gap-6">
          <span
            class="flex size-14 shrink-0 items-center justify-center rounded-full text-[28px] font-bold"
            :style="{ backgroundColor: colorAccent, color: onAccent }"
            >{{ index + 1 }}</span
          >
          <span class="line-clamp-2 text-[32px] leading-[40px] text-[#1e293b]">{{ item }}</span>
        </li>
      </ol>
    </section>

    <footer class="absolute right-12 bottom-[100px] left-12 text-center">
      <span
        class="flex h-[120px] items-center justify-center rounded-full text-[44px] font-bold"
        :style="{ backgroundColor: colorPrimary, color: onPrimary }"
        >{{ registerLabel }}</span
      >
      <p class="mt-7 truncate text-[28px] text-[#475569]">{{ registerUrl }}</p>
    </footer>
  </div>
</template>