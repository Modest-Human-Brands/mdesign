<script setup lang="ts">
import { encode } from 'uqr'
import { computed } from 'vue'

const props = defineProps<{
  value: string
  color: string
  logo: string
  accent: string
  rounded: boolean
}>()

const FINDER = 7
const matrix = computed(() => {
  try {
    const { data, size } = encode(props.value || ' ', { ecc: 'H', border: 0 })
    return { size, data }
  } catch {
    return { size: 0, data: [] as boolean[][] }
  }
})

const size = computed(() => matrix.value.size)
const center = computed(() => size.value / 2)
const logoRadius = computed(() => size.value * 0.14)

function inFinder(x: number, y: number) {
  const n = size.value
  return (
    (x < FINDER && y < FINDER) || (x >= n - FINDER && y < FINDER) || (x < FINDER && y >= n - FINDER)
  )
}

const dots = computed(() => {
  const { size: n, data } = matrix.value
  const result: { x: number; y: number }[] = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!data[y]?.[x] || (props.rounded && inFinder(x, y))) continue
      const dx = x + 0.5 - center.value
      const dy = y + 0.5 - center.value
      if (Math.hypot(dx, dy) < logoRadius.value + 0.8) continue
      result.push({ x: x + 0.5, y: y + 0.5 })
    }
  }
  return result
})

const finders = computed(() => {
  const n = size.value
  return [
    { x: FINDER / 2, y: FINDER / 2 },
    { x: n - FINDER / 2, y: FINDER / 2 },
    { x: FINDER / 2, y: n - FINDER / 2 },
  ]
})
</script>

<template>
  <svg :viewBox="`0 0 ${size} ${size}`" style="display: block; width: 100%; height: 100%">
    <template v-if="rounded">
      <circle
        v-for="(dot, index) in dots"
        :key="index"
        :cx="dot.x"
        :cy="dot.y"
        r="0.36"
        :fill="color"
      />
    </template>
    <rect
      v-for="(dot, index) in rounded ? [] : dots"
      :key="`s${index}`"
      :x="dot.x - 0.5"
      :y="dot.y - 0.5"
      width="1.02"
      height="1.02"
      :fill="color"
    />
    <g v-for="(finder, index) in rounded ? finders : []" :key="`f${index}`">
      <circle
        :cx="finder.x"
        :cy="finder.y"
        r="2.9"
        fill="none"
        :stroke="color"
        stroke-width="1.1"
      />
      <circle :cx="finder.x" :cy="finder.y" r="1.35" :fill="color" />
    </g>
    <circle :cx="center" :cy="center" :r="logoRadius" fill="#FFFFFF" />
    <image
      v-if="logo"
      :href="logo"
      :x="center - logoRadius * 0.78"
      :y="center - logoRadius * 0.78"
      :width="logoRadius * 1.56"
      :height="logoRadius * 1.56"
      preserveAspectRatio="xMidYMid meet"
    />
    <circle v-else :cx="center" :cy="center" :r="logoRadius * 0.55" :fill="accent" />
  </svg>
</template>