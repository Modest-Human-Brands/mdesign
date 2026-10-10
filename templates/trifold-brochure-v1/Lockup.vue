<script setup lang="ts">
import { computed } from 'vue'

// Logo + uppercase business name. Without a logo a grey "LOGO" circle holds the place.
const props = defineProps<{ name: string; logo: string; color: string }>()

const SIZE = 40
const label = computed(() => Math.max(4, SIZE * 0.16))
</script>

<template>
  <div style="position: relative; display: flex; flex-direction: row; align-items: center">
    <img
      v-if="logo"
      :src="logo"
      alt=""
      :style="{
        flexShrink: 0,
        objectFit: 'contain',
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        marginRight: '8px',
      }"
    />
    <div
      v-else
      :style="{
        flexShrink: 0,
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        marginRight: '8px',
        borderRadius: '999px',
        backgroundColor: '#D9D9D9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${label}px`,
        fontWeight: 700,
        color: '#888888',
      }"
    >
      LOGO
    </div>
    <span
      :style="{
        flex: 1,
        fontSize: '14px',
        lineHeight: 1.25,
        fontWeight: 700,
        letterSpacing: '0.72px',
        textTransform: 'uppercase',
        color: props.color,
      }"
    >
      {{ name }}
    </span>
  </div>
</template>