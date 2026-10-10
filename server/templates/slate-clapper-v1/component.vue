<script setup lang="ts">
import { CanvasRoot, View, Text, ImageNode } from '../../canvas/elements'

defineProps<{
  width: number
  height: number
  organizationName: string
  organizationInitial: string
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
  production: string
  director: string
  cinematographer: string
  scene: string
  take: string
  roll: string
  date: string
  notes: string
}>()

const MONO = '"JetBrainsMono", "Oxanium", "Exo2", monospace'
const INK = '#F8FAFC'
const LINE = '#F8FAFC'
const stripes = Array.from({ length: 12 }, (_, i) => i)
</script>

<template>
  <CanvasRoot :width="width" :height="height" background-color="#1F2937">
    <!-- Board -->
    <View
      :style="{
        x: 120,
        y: 190,
        width: width - 240,
        height: height - 290,
        backgroundColor: '#0B0F19',
        borderRadius: [0, 0, 18, 18],
        borderColor: LINE,
        borderWidth: 6,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowBlur: 50,
        shadowOffsetY: 20,
      }" />

    <!-- Clapper arm (striped) -->
    <View :style="{ x: 120, y: 90, width: width - 240, height: 90, backgroundColor: '#0B0F19', borderColor: LINE, borderWidth: 6, overflow: 'hidden' }">
      <View v-for="i in stripes" :key="i" :style="{ x: i * ((width - 240) / 12) + 6, y: 6, width: (width - 240) / 24, height: 78, backgroundColor: i % 2 === 0 ? INK : colorAccent }" />
    </View>
    <View :style="{ x: 120, y: 190, width: width - 240, height: 6, backgroundColor: LINE }" />

    <!-- Header row -->
    <Text :style="{ x: 160, y: 218, fontSize: 20, fontFamily: MONO, color: '#94A3B8', letterSpacing: 3 }">PRODUCTION</Text>
    <Text :style="{ x: 160, y: 250, fontSize: 56, fontWeight: 'bold', fontFamily: organizationFont, color: INK, maxWidth: width - 540, maxLines: 1 }">{{ production }}</Text>
    <ImageNode v-if="organizationLogo" :src="organizationLogo" :style="{ x: width - 120 - 40 - 90, y: 224, width: 90, height: 90, fit: 'contain' }" />
    <Text v-else :style="{ x: width - 160, y: 230, fontSize: 28, fontWeight: 'bold', fontFamily: organizationFont, color: colorAccent, textAlign: 'right' }">{{ organizationName }}</Text>

    <!-- Grid lines -->
    <View :style="{ x: 120, y: 340, width: width - 240, height: 4, backgroundColor: LINE }" />
    <View :style="{ x: 120, y: 500, width: width - 240, height: 4, backgroundColor: LINE }" />
    <View :style="{ x: 120 + (width - 240) / 3, y: 340, width: 4, height: 300, backgroundColor: LINE }" />
    <View :style="{ x: 120 + ((width - 240) / 3) * 2, y: 340, width: 4, height: 300, backgroundColor: LINE }" />

    <!-- Row 1: scene / take / roll -->
    <Text :style="{ x: 160, y: 360, fontSize: 20, fontFamily: MONO, color: '#94A3B8', letterSpacing: 3 }">SCENE</Text>
    <Text :style="{ x: 160, y: 400, fontSize: 70, fontWeight: 'bold', fontFamily: MONO, color: INK, maxWidth: 400, maxLines: 1 }">{{ scene }}</Text>
    <Text :style="{ x: 120 + (width - 240) / 3 + 40, y: 360, fontSize: 20, fontFamily: MONO, color: '#94A3B8', letterSpacing: 3 }">TAKE</Text>
    <Text :style="{ x: 120 + (width - 240) / 3 + 40, y: 400, fontSize: 70, fontWeight: 'bold', fontFamily: MONO, color: colorAccent, maxWidth: 400, maxLines: 1 }">{{ take }}</Text>
    <Text :style="{ x: 120 + ((width - 240) / 3) * 2 + 40, y: 360, fontSize: 20, fontFamily: MONO, color: '#94A3B8', letterSpacing: 3 }">ROLL</Text>
    <Text :style="{ x: 120 + ((width - 240) / 3) * 2 + 40, y: 400, fontSize: 70, fontWeight: 'bold', fontFamily: MONO, color: INK, maxWidth: 400, maxLines: 1 }">{{ roll }}</Text>

    <!-- Row 2: director / cinematographer / date -->
    <Text :style="{ x: 160, y: 520, fontSize: 20, fontFamily: MONO, color: '#94A3B8', letterSpacing: 3 }">DIRECTOR</Text>
    <Text :style="{ x: 160, y: 560, fontSize: 38, fontFamily: organizationFont, color: INK, maxWidth: (width - 240) / 3 - 60, maxLines: 1 }">{{ director }}</Text>
    <Text :style="{ x: 120 + (width - 240) / 3 + 40, y: 520, fontSize: 20, fontFamily: MONO, color: '#94A3B8', letterSpacing: 3 }">CAMERA</Text>
    <Text :style="{ x: 120 + (width - 240) / 3 + 40, y: 560, fontSize: 38, fontFamily: organizationFont, color: INK, maxWidth: (width - 240) / 3 - 60, maxLines: 1 }">{{ cinematographer }}</Text>
    <Text :style="{ x: 120 + ((width - 240) / 3) * 2 + 40, y: 520, fontSize: 20, fontFamily: MONO, color: '#94A3B8', letterSpacing: 3 }">DATE</Text>
    <Text :style="{ x: 120 + ((width - 240) / 3) * 2 + 40, y: 560, fontSize: 38, fontFamily: MONO, color: INK, maxWidth: (width - 240) / 3 - 60, maxLines: 1 }">{{ date }}</Text>

    <!-- Notes -->
    <Text :style="{ x: 160, y: 660, fontSize: 20, fontFamily: MONO, color: '#94A3B8', letterSpacing: 3 }">NOTES</Text>
    <Text :style="{ x: 160, y: 696, fontSize: 30, fontFamily: organizationFont, color: '#CBD5E1', maxWidth: width - 320, maxLines: 2, lineHeight: 40 }">{{ notes }}</Text>
  </CanvasRoot>
</template>
