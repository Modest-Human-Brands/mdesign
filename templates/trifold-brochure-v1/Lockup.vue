<script setup lang="ts">
const props = defineProps<{ name: string; logo: string; color: string; accent: string }>()

const SIZE = 40
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
        backgroundColor: accent,
      }"
    />
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