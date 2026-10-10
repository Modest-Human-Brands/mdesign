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
  organizationWebsite: string
  organizationAddress: string
  fullName: string
  jobTitle: string
  email: string
  phone: string
  tagline: string
}>()
</script>

<template>
  <div
    class="leading-normal relative flex size-full overflow-hidden bg-white text-[#0f172a]"
    :style="{ fontFamily: organizationFont }"
  >
    <!-- Brand side -->
    <aside
      class="flex h-full w-[360px] shrink-0 flex-col items-center justify-center gap-5 px-5 text-center text-white"
      :style="{ background: gradient }"
    >
      <img v-if="organizationLogo" :src="organizationLogo" alt="" class="size-40 object-contain" />
      <span
        v-else
        class="flex size-36 items-center justify-center rounded-full border-4 border-white/70 bg-white/15 text-[72px] font-bold"
      >
        {{ organizationInitial }}
      </span>
      <span class="line-clamp-2 text-[24px] leading-[30px] font-bold">{{ organizationName }}</span>
    </aside>

    <!-- Details -->
    <div class="flex min-w-0 flex-1 flex-col justify-center px-14">
      <h1 class="truncate text-[52px] leading-[60px] font-bold" :style="{ color: colorPrimary }">
        {{ fullName }}
      </h1>
      <p class="mt-1 truncate text-[26px] tracking-[2px] uppercase" :style="{ color: colorAccent }">
        {{ jobTitle }}
      </p>
      <div class="my-5 h-[5px] w-14 rounded-full" :style="{ backgroundColor: colorAccent }" />
      <p v-if="tagline" class="truncate text-[24px] text-[#64748b] italic">{{ tagline }}</p>
      <ul class="mt-6 flex flex-col gap-3.5 text-[24px] text-[#1e293b]">
        <li
          v-for="line in [phone, email, organizationWebsite, organizationAddress].filter(Boolean)"
          :key="line"
          class="flex items-start gap-4"
        >
          <span
            class="mt-[11px] size-3.5 shrink-0 rounded-full"
            :style="{ backgroundColor: colorAccent }"
          />
          <span class="line-clamp-2 leading-[30px]">{{ line }}</span>
        </li>
      </ul>
    </div>
    <span class="absolute top-0 right-0 h-full w-2.5" :style="{ backgroundColor: colorAccent }" />
  </div>
</template>