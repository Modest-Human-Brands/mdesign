<script setup lang="ts">
defineProps<{
  organizationName: string
  organizationInitial: string
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
  onPrimary: string
  gradient: string
  organizationPhone: string
  organizationEmail: string
  organizationWebsite: string
  organizationAddress: string
  coverEyebrow: string
  coverTitle: string
  coverDescription: string
  flap: { heading: string; text: string }
  insideLeft: { heading: string; text: string }
  servicesHeading: string
  serviceItems: string[]
  decorImage: string
  ctaLabel: string
  ctaPhone: string
  ctaNote: string
}>()
</script>

<template>
  <!-- Designed on a 1240 x 874 grid and scaled 2x to 2480 x 1748 -->
  <div
    class="leading-normal relative size-full overflow-hidden bg-white text-[#0f172a]"
    :style="{ fontFamily: organizationFont }"
  >
    <div
      class="absolute top-0 left-0 flex origin-top-left scale-[2]"
      style="width: 1240px; height: 874px"
    >
      <!-- Panel 1: flap -->
      <section class="relative h-full w-1/3 overflow-hidden" :style="{ background: gradient }">
        <div
          class="absolute top-[60px] right-[30px] bottom-[60px] left-[30px] rounded-[20px] bg-white p-7 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
        >
          <h2 class="text-[26px] leading-[34px] font-bold" :style="{ color: colorPrimary }">
            {{ flap.heading }}
          </h2>
          <p class="mt-7 line-clamp-[11] text-[14px] leading-[23px] text-[#334155]">
            {{ flap.text }}
          </p>
          <div class="absolute right-7 bottom-7 left-7">
            <div class="mb-5 h-1 w-10 rounded-full" :style="{ backgroundColor: colorAccent }" />
            <h3 class="text-[20px] font-bold" :style="{ color: colorPrimary }">
              {{ servicesHeading }}
            </h3>
            <ul class="mt-4 flex flex-col gap-[18px]">
              <li
                v-for="(item, index) in serviceItems"
                :key="index"
                class="flex items-center gap-3 text-[16px] text-[#1e293b]"
              >
                <span
                  class="size-2.5 shrink-0 rounded-full"
                  :style="{ backgroundColor: colorAccent }"
                />
                <span class="truncate">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Panel 2: inside -->
      <section class="relative h-full w-1/3 bg-[#f8fafc]">
        <div
          class="absolute top-[60px] right-[30px] left-[30px] h-[210px] rounded-[20px] bg-white p-7 shadow-[0_8px_20px_rgba(15,23,42,0.10)]"
        >
          <div class="flex items-center gap-5">
            <img
              v-if="organizationLogo"
              :src="organizationLogo"
              alt=""
              class="size-14 object-contain"
            />
            <span
              v-else
              class="flex size-14 items-center justify-center rounded-full text-[26px] font-bold"
              :style="{ backgroundColor: colorPrimary, color: onPrimary }"
            >
              {{ organizationInitial }}
            </span>
            <span class="truncate text-[20px] font-bold" :style="{ color: colorPrimary }">{{
              organizationName
            }}</span>
          </div>
          <p class="mt-6 truncate text-[13px] text-[#64748b]">{{ organizationEmail }}</p>
          <p class="mt-1.5 truncate text-[13px] text-[#64748b]">
            {{ [organizationPhone, organizationWebsite].filter(Boolean).join('  ·  ') }}
          </p>
          <p class="mt-1.5 line-clamp-2 text-[13px] leading-[19px] text-[#64748b]">
            {{ organizationAddress }}
          </p>
        </div>
        <div class="absolute top-[320px] right-[30px] left-[30px]">
          <div class="mb-6 h-1 w-10 rounded-full" :style="{ backgroundColor: colorAccent }" />
          <h2 class="text-[28px] leading-9 font-bold" :style="{ color: colorPrimary }">
            {{ insideLeft.heading }}
          </h2>
          <p class="mt-6 line-clamp-[14] text-[15px] leading-[25px] text-[#475569]">
            {{ insideLeft.text }}
          </p>
        </div>
      </section>

      <!-- Panel 3: cover -->
      <section
        class="relative h-full w-1/3 overflow-hidden text-white"
        :style="{ background: gradient }"
      >
        <div class="absolute inset-0 bg-[#0f172a]/35" />
        <img
          v-if="decorImage"
          :src="decorImage"
          alt=""
          class="absolute -right-[50px] -bottom-[40px] size-[300px] object-contain opacity-35"
        />
        <div class="absolute top-[240px] right-10 left-10">
          <p class="text-[14px] font-bold tracking-[4px] text-[#e2e8f0] uppercase">
            {{ coverEyebrow }}
          </p>
          <h1 class="mt-3 line-clamp-4 text-[52px] leading-[60px] font-bold">{{ coverTitle }}</h1>
          <p class="mt-10 line-clamp-4 text-[18px] leading-7 text-[#e2e8f0]">
            {{ coverDescription }}
          </p>
        </div>
        <div class="absolute right-10 bottom-[52px] left-10">
          <span
            class="flex h-[52px] w-[230px] items-center justify-center rounded-full bg-white text-[17px] font-bold"
            :style="{ color: colorPrimary }"
            >{{ ctaLabel }}</span
          >
          <p class="mt-3 text-[16px] font-bold">{{ ctaPhone }}</p>
          <p class="mt-0.5 text-[12px] text-[#cbd5e1]">{{ ctaNote }}</p>
        </div>
      </section>
    </div>
  </div>
</template>