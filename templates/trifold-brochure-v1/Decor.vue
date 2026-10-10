<script setup lang="ts">
import { computed } from 'vue'

// Decorative blobs and leaf shared by the brochure panels. Geometry is in Figma units (735 x 520 frame).
const props = defineProps<{ accent: string; leafImageUrl: string }>()

const NEUTRAL = '#D9D9D9'
const tint = computed(() => `${props.accent}33`)

type Shape = {
  x: number
  y: number
  w: number
  h: number
  r: [number, number, number, number]
  tone: 'neutral' | 'accent' | 'tint'
}

const shapes: Shape[] = [
  { x: -26.2, y: -32.75, w: 131.02, h: 104.79, r: [90, 60, 110, 70], tone: 'neutral' },
  { x: 6.55, y: -29.47, w: 78.61, h: 65.49, r: [60, 50, 70, 40], tone: 'accent' },
  { x: 111.36, y: -45.84, w: 150.67, h: 124.43, r: [110, 60, 90, 130], tone: 'tint' },
  { x: -39.3, y: 399.5, w: 196.52, h: 150.63, r: [130, 150, 70, 110], tone: 'tint' },
  { x: 58.96, y: 406.05, w: 124.47, h: 78.59, r: [70, 90, 50, 60], tone: 'accent' },
  { x: 157.22, y: 458.44, w: 98.26, h: 85.14, r: [60, 80, 40, 70], tone: 'neutral' },
]

function shapeStyle(shape: Shape) {
  // Mimic CSS corner-radius clamping so overlapping radii never distort the shape
  const [tl, tr, br, bl] = shape.r
  const f = Math.min(
    1,
    shape.w / (tl + tr),
    shape.w / (bl + br),
    shape.h / (tl + bl),
    shape.h / (tr + br),
  )
  return {
    position: 'absolute' as const,
    left: `${shape.x}px`,
    top: `${shape.y}px`,
    width: `${shape.w}px`,
    height: `${shape.h}px`,
    borderRadius: `${tl * f}px ${tr * f}px ${br * f}px ${bl * f}px`,
    backgroundColor:
      shape.tone === 'accent' ? props.accent : shape.tone === 'tint' ? tint.value : NEUTRAL,
  }
}
</script>

<template>
  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%">
    <div v-for="(shape, index) in shapes" :key="index" :style="shapeStyle(shape)" />
    <img
      v-if="leafImageUrl"
      :src="leafImageUrl"
      alt=""
      style="position: absolute; left: 150px; top: 4px; width: 72px; height: 82px"
    />
  </div>
</template>