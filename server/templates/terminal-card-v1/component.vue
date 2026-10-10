<script setup lang="ts">
import { CanvasRoot, View, Text, ImageNode, MeshGradient } from '../../canvas/elements'
import { onColor } from '../_shared/organization'

defineProps<{
  width: number
  height: number
  organizationName: string
  organizationInitial: string
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
  topic: string
  question: string
  options: string[]
  hint: string
  handle: string
}>()

const MONO = '"JetBrainsMono", "Oxanium", "Exo2", monospace'
const LETTERS = ['A', 'B', 'C', 'D']
</script>

<template>
  <CanvasRoot :width="width" :height="height" background-color="#05070F">
    <MeshGradient :primary="colorPrimary" :accent="colorAccent" :width="width" :height="height" />
    <View :style="{ x: 0, y: 0, width, height, backgroundColor: 'rgba(5,7,15,0.72)' }" />

    <!-- Window -->
    <View
      :style="{
        x: 90,
        y: 70,
        width: width - 180,
        height: height - 140,
        backgroundColor: '#0D1220',
        borderRadius: 22,
        borderColor: '#1E293B',
        borderWidth: 2,
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowBlur: 60,
        shadowOffsetY: 24,
      }">
      <View :style="{ x: 0, y: 0, width: width - 180, height: 64, backgroundColor: '#111827', borderRadius: [22, 22, 0, 0] }">
        <View :style="{ x: 28, y: 24, width: 16, height: 16, backgroundColor: '#FF5F57', borderRadius: 8 }" />
        <View :style="{ x: 56, y: 24, width: 16, height: 16, backgroundColor: '#FEBC2E', borderRadius: 8 }" />
        <View :style="{ x: 84, y: 24, width: 16, height: 16, backgroundColor: '#28C840', borderRadius: 8 }" />
        <Text :style="{ x: (width - 180) / 2, y: 20, fontSize: 20, fontFamily: MONO, color: '#64748B', textAlign: 'center' }">quiz — {{ topic.toLowerCase() }} — 80x24</Text>
      </View>

      <Text :style="{ x: 56, y: 100, fontSize: 26, fontFamily: MONO, color: '#4ADE80', maxWidth: width - 292, maxLines: 1 }">$ quiz --topic "{{ topic }}"</Text>
      <Text :style="{ x: 56, y: 156, fontSize: 46, fontWeight: 'bold', fontFamily: MONO, color: '#F8FAFC', maxWidth: width - 292, lineHeight: 62, maxLines: 3 }">{{ question }}</Text>

      <template v-for="(option, index) in options" :key="index">
        <View
          :style="{
            x: 56 + (index % 2) * ((width - 292) / 2 + 12),
            y: 372 + Math.floor(index / 2) * 96,
            width: (width - 292) / 2 - 12,
            height: 76,
            backgroundColor: '#111A2E',
            borderRadius: 14,
            borderColor: '#243049',
            borderWidth: 2,
          }">
          <View :style="{ x: 16, y: 16, width: 44, height: 44, backgroundColor: colorAccent, borderRadius: 10 }">
            <Text :style="{ x: 22, y: 7, fontSize: 26, fontWeight: 'bold', fontFamily: MONO, color: onColor(colorAccent), textAlign: 'center' }">{{ LETTERS[index] }}</Text>
          </View>
          <Text :style="{ x: 82, y: 22, fontSize: 28, fontFamily: MONO, color: '#E2E8F0', maxWidth: (width - 292) / 2 - 120, maxLines: 1 }">{{ option }}</Text>
        </View>
      </template>

      <Text :style="{ x: 56, y: height - 140 - 124, fontSize: 22, fontFamily: MONO, color: '#64748B', maxWidth: width - 292, maxLines: 1 }">// hint: {{ hint }}</Text>

      <!-- Footer -->
      <View :style="{ x: 0, y: height - 140 - 64, width: width - 180, height: 64, backgroundColor: '#0A0F1C', borderRadius: [0, 0, 22, 22] }">
        <ImageNode v-if="organizationLogo" :src="organizationLogo" :style="{ x: 56, y: 12, width: 40, height: 40, fit: 'contain' }" />
        <Text :style="{ x: organizationLogo ? 112 : 56, y: 18, fontSize: 24, fontWeight: 'bold', fontFamily: organizationFont, color: '#F8FAFC', maxWidth: 600, maxLines: 1 }">{{
          organizationName
        }}</Text>
        <Text :style="{ x: width - 180 - 56, y: 20, fontSize: 22, fontFamily: MONO, color: colorAccent, textAlign: 'right' }">{{ handle }}</Text>
      </View>
    </View>
  </CanvasRoot>
</template>
