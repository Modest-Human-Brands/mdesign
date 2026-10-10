<script setup lang="ts">
import { CanvasRoot, View, Text, ImageNode, MeshGradient } from '../../canvas/elements'

defineProps<{
  width: number
  height: number
  organizationName: string
  organizationInitial: string
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
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

const MONO = '"JetBrainsMono", "Oxanium", "Exo2", monospace'
const INK = 'rgba(255,255,255,0.92)'
const m = 70 // safe margin
const arm = 60 // frame-corner arm length
const stroke = 5

// L-shaped viewfinder corners: [x, y, horizontal-arm x, vertical-arm y]
const corners = (w: number, h: number) => [
  { x: m, y: m, hx: m, hy: m, vx: m, vy: m },
  { x: w - m - arm, y: m, hx: w - m - arm, hy: m, vx: w - m - stroke, vy: m },
  { x: m, y: h - m - stroke, hx: m, hy: h - m - stroke, vx: m, vy: h - m - arm },
  { x: w - m - arm, y: h - m - stroke, hx: w - m - arm, hy: h - m - stroke, vx: w - m - stroke, vy: h - m - arm },
]
</script>

<template>
  <CanvasRoot :width="width" :height="height" background-color="#000000">
    <MeshGradient :primary="colorPrimary" :accent="colorAccent" :width="width" :height="height" />
    <!-- Vignette -->
    <View :style="{ x: 0, y: 0, width, height, backgroundColor: 'rgba(0,0,0,0.38)' }" />
    <View :style="{ x: 0, y: height * 0.55, width, height: height * 0.45, backgroundColor: 'rgba(0,0,0,0.45)' }" />

    <!-- Viewfinder corners -->
    <template v-for="(c, index) in corners(width, height)" :key="index">
      <View :style="{ x: c.hx, y: c.hy, width: arm, height: stroke, backgroundColor: INK }" />
      <View :style="{ x: c.vx, y: c.vy, width: stroke, height: arm, backgroundColor: INK }" />
    </template>

    <!-- Centre crosshair + rule-of-thirds ticks -->
    <View :style="{ x: width / 2 - 30, y: height / 2 - 1.5, width: 60, height: 3, backgroundColor: 'rgba(255,255,255,0.7)' }" />
    <View :style="{ x: width / 2 - 1.5, y: height / 2 - 30, width: 3, height: 60, backgroundColor: 'rgba(255,255,255,0.7)' }" />
    <View :style="{ x: width / 3 - 1, y: height / 2 - 14, width: 2, height: 28, backgroundColor: 'rgba(255,255,255,0.35)' }" />
    <View :style="{ x: (width / 3) * 2 - 1, y: height / 2 - 14, width: 2, height: 28, backgroundColor: 'rgba(255,255,255,0.35)' }" />

    <!-- Top bar -->
    <View :style="{ x: m + 30, y: m + 34, width: 22, height: 22, backgroundColor: '#EF4444', borderRadius: 11 }" />
    <Text :style="{ x: m + 66, y: m + 30, fontSize: 30, fontWeight: 'bold', fontFamily: MONO, color: INK, letterSpacing: 3 }">REC {{ timecode }}</Text>
    <Text :style="{ x: width - m - 30, y: m + 30, fontSize: 26, fontFamily: MONO, color: INK, textAlign: 'right', letterSpacing: 2 }">{{ camera }} · {{ fps }} · {{ iso }}</Text>

    <!-- Lower third -->
    <View :style="{ x: m + 30, y: height - 420, width: 8, height: 190, backgroundColor: colorAccent }" />
    <Text :style="{ x: m + 66, y: height - 424, fontSize: 96, fontWeight: 'bold', fontFamily: organizationFont, color: '#FFFFFF', maxWidth: width - m * 2 - 400, lineHeight: 108, maxLines: 2 }">{{
      title
    }}</Text>
    <Text :style="{ x: m + 66, y: height - 296, fontSize: 38, fontFamily: organizationFont, color: 'rgba(255,255,255,0.82)', maxWidth: width - m * 2 - 400, maxLines: 1 }">{{ subtitle }}</Text>

    <!-- Bottom info bar -->
    <Text :style="{ x: m + 30, y: height - m - 66, fontSize: 26, fontFamily: MONO, color: INK, letterSpacing: 2 }">SCENE {{ scene }} TAKE {{ take }} ROLL {{ roll }}</Text>
    <ImageNode v-if="organizationLogo" :src="organizationLogo" :style="{ x: width - m - 30 - 56, y: height - m - 80, width: 56, height: 56, fit: 'contain' }" />
    <Text :style="{ x: width - m - 30 - (organizationLogo ? 76 : 0), y: height - m - 64, fontSize: 28, fontWeight: 'bold', fontFamily: organizationFont, color: INK, textAlign: 'right' }">{{
      organizationName
    }}</Text>
  </CanvasRoot>
</template>
