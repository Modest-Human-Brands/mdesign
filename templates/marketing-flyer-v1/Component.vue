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
  organizationPhone: string
  organizationEmail: string
  organizationWebsite: string
  organizationAddress: string
  headline: string
  subheadline: string
  offer: string
  heroImage: string
  features: string[]
  callToAction: string
}>()
</script>

<template>
  <div
    class="leading-normal relative size-full overflow-hidden bg-white text-[#0f172a]"
    :style="{ fontFamily: organizationFont }"
  >
    <header
      class="absolute inset-x-0 top-0 h-[820px] rounded-b-[80px] text-white"
      :style="{ background: gradient }"
    >
      <div class="absolute top-16 right-[72px] left-[72px] flex items-center gap-5">
        <img
          v-if="organizationLogo"
          :src="organizationLogo"
          alt=""
          class="size-[72px] object-contain"
        />
        <span class="truncate text-[32px] font-bold">{{ organizationName }}</span>
      </div>
      <h1
        class="absolute top-[200px] right-[72px] left-[72px] line-clamp-4 text-[104px] leading-[112px] font-bold"
      >
        {{ headline }}
      </h1>
      <p
        class="absolute bottom-[100px] left-[72px] line-clamp-2 w-[760px] text-[32px] leading-[44px] text-[#e2e8f0]"
      >
        {{ subheadline }}
      </p>
    </header>

    <span
      v-if="offer"
      class="absolute top-[640px] right-[72px] flex size-[220px] items-center justify-center rounded-full bg-[#facc15] p-6 text-center text-[48px] leading-[54px] font-bold text-[#1f2937] shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
      >{{ offer }}</span
    >

    <img
      v-if="heroImage"
      :src="heroImage"
      alt=""
      class="absolute top-[900px] right-[72px] left-[72px] h-[300px] w-[1056px] rounded-[32px] object-cover"
    />

    <ul
      class="absolute right-[72px] left-[72px] flex flex-col gap-[38px]"
      :style="{ top: heroImage ? '1250px' : '930px' }"
    >
      <li v-for="(item, index) in features" :key="index" class="flex items-center gap-7">
        <span
          class="flex size-12 shrink-0 items-center justify-center rounded-full"
          :style="{ backgroundColor: colorAccent }"
        >
          <span class="size-4 rounded-full" :style="{ backgroundColor: onAccent }" />
        </span>
        <span class="truncate text-[36px] text-[#1e293b]">{{ item }}</span>
      </li>
    </ul>

    <span
      class="absolute right-[72px] bottom-[260px] left-[72px] flex h-[110px] items-center justify-center rounded-full text-[44px] font-bold"
      :style="{ backgroundColor: colorPrimary, color: onPrimary }"
      >{{ callToAction }}</span
    >
    <footer
      class="absolute right-[72px] bottom-[60px] left-[72px] flex justify-between gap-8 border-t-[3px] border-[#e2e8f0] pt-7 text-[28px] text-[#334155]"
    >
      <div class="min-w-0">
        <p class="truncate">{{ organizationPhone }}</p>
        <p class="mt-2 truncate">{{ organizationEmail }}</p>
      </div>
      <div class="min-w-0 text-right">
        <p class="truncate" :style="{ color: colorAccent }">{{ organizationWebsite }}</p>
        <p class="mt-2 truncate text-[24px] text-[#64748b]">{{ organizationAddress }}</p>
      </div>
    </footer>
  </div>
</template>