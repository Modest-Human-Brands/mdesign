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
  eyebrow: string
  title: string
  subtitle: string
  date: string
  time: string
  venue: string
  highlights: string[]
  registerLabel: string
  registerUrl: string
}>()
</script>

<template>
  <CanvasRoot :width="width" :height="height" background-color="#F8FAFC">
    <!-- Hero -->
    <MeshGradient :primary="colorPrimary" :accent="colorAccent" :width="width" :height="900" />
    <View :style="{ x: 0, y: 0, width, height: 900, backgroundColor: 'rgba(15,23,42,0.30)' }" />
    <ImageNode v-if="organizationLogo" :src="organizationLogo" :style="{ x: 64, y: 64, width: 84, height: 84, fit: 'contain' }" />
    <Text :style="{ x: organizationLogo ? 168 : 64, y: 86, fontSize: 34, fontWeight: 'bold', fontFamily: organizationFont, color: '#FFFFFF', maxWidth: 540, maxLines: 1 }">{{ organizationName }}</Text>

    <Text :style="{ x: 64, y: 400, fontSize: 28, fontWeight: 'bold', fontFamily: organizationFont, letterSpacing: 6, color: '#E2E8F0', maxWidth: width - 128, maxLines: 1 }">{{
      eyebrow.toUpperCase()
    }}</Text>
    <Text :style="{ x: 64, y: 456, fontSize: 118, fontWeight: 'bold', fontFamily: organizationFont, color: '#FFFFFF', maxWidth: width - 128, lineHeight: 128, maxLines: 3 }">{{ title }}</Text>
    <Text :style="{ x: 64, y: 760, fontSize: 30, fontFamily: organizationFont, color: '#E2E8F0', maxWidth: width - 128, lineHeight: 42, maxLines: 3 }">{{ subtitle }}</Text>

    <!-- Schedule card -->
    <View :style="{ x: 48, y: 860, width: width - 96, height: 270, backgroundColor: '#FFFFFF', borderRadius: 28, shadowColor: 'rgba(15,23,42,0.25)', shadowBlur: 40, shadowOffsetY: 16 }">
      <Text :style="{ x: 40, y: 34, fontSize: 20, fontWeight: 'bold', fontFamily: organizationFont, letterSpacing: 4, color: colorAccent }">DATE</Text>
      <Text :style="{ x: 40, y: 66, fontSize: 40, fontWeight: 'bold', fontFamily: organizationFont, color: colorPrimary, maxWidth: width - 176, maxLines: 1 }">{{ date }}</Text>
      <Text :style="{ x: 40, y: 134, fontSize: 20, fontWeight: 'bold', fontFamily: organizationFont, letterSpacing: 4, color: colorAccent }">TIME &amp; VENUE</Text>
      <Text :style="{ x: 40, y: 166, fontSize: 30, fontFamily: organizationFont, color: '#334155', maxWidth: width - 176, maxLines: 1 }">{{ time }}</Text>
      <Text :style="{ x: 40, y: 206, fontSize: 30, fontFamily: organizationFont, color: '#334155', maxWidth: width - 176, maxLines: 1 }">{{ venue }}</Text>
    </View>

    <!-- Highlights -->
    <Text :style="{ x: 64, y: 1210, fontSize: 40, fontWeight: 'bold', fontFamily: organizationFont, color: colorPrimary }">What to expect</Text>
    <template v-for="(item, index) in highlights" :key="index">
      <View :style="{ x: 64, y: 1290 + index * 100, width: 56, height: 56, backgroundColor: colorAccent, borderRadius: 28 }">
        <Text :style="{ x: 28, y: 11, fontSize: 28, fontWeight: 'bold', fontFamily: organizationFont, color: onColor(colorAccent), textAlign: 'center' }">{{ index + 1 }}</Text>
      </View>
      <Text :style="{ x: 144, y: 1296 + index * 100, fontSize: 32, fontFamily: organizationFont, color: '#1E293B', maxWidth: width - 208, lineHeight: 40, maxLines: 2 }">{{ item }}</Text>
    </template>

    <!-- Call to action -->
    <View :style="{ x: 48, y: height - 270, width: width - 96, height: 120, backgroundColor: colorPrimary, borderRadius: 60 }">
      <Text :style="{ x: (width - 96) / 2, y: 30, fontSize: 44, fontWeight: 'bold', fontFamily: organizationFont, color: onColor(colorPrimary), textAlign: 'center', maxLines: 1 }">{{
        registerLabel
      }}</Text>
    </View>
    <Text :style="{ x: width / 2, y: height - 120, fontSize: 28, fontFamily: organizationFont, color: '#475569', textAlign: 'center', maxLines: 1 }">{{ registerUrl }}</Text>
  </CanvasRoot>
</template>
