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
  organizationPhone: string
  organizationEmail: string
  organizationWebsite: string
  organizationAddress: string
  headline: string
  subheadline: string
  offer: string
  heroImage: string
  features: string[]
  callToAction: string
}>()
</script>

<template>
  <CanvasRoot :width="width" :height="height" background-color="#FFFFFF">
    <!-- Hero -->
    <MeshGradient :primary="colorPrimary" :accent="colorAccent" :width="width" :height="820" :border-radius="[0, 0, 80, 80]" />
    <ImageNode v-if="organizationLogo" :src="organizationLogo" :style="{ x: 72, y: 64, width: 72, height: 72, fit: 'contain' }" />
    <Text :style="{ x: organizationLogo ? 164 : 72, y: 82, fontSize: 32, fontWeight: 'bold', fontFamily: organizationFont, color: '#FFFFFF', maxWidth: 640, maxLines: 1 }">{{ organizationName }}</Text>

    <Text :style="{ x: 72, y: 220, fontSize: 104, fontWeight: 'bold', fontFamily: organizationFont, color: '#FFFFFF', maxWidth: width - 144, lineHeight: 112, maxLines: 4 }">{{ headline }}</Text>
    <Text :style="{ x: 72, y: 690, fontSize: 32, fontFamily: organizationFont, color: '#E2E8F0', maxWidth: width - 400, lineHeight: 44, maxLines: 2 }">{{ subheadline }}</Text>

    <!-- Offer badge -->
    <View
      v-if="offer"
      :style="{ x: width - 72 - 220, y: 640, width: 220, height: 220, backgroundColor: '#FACC15', borderRadius: 110, shadowColor: 'rgba(0,0,0,0.3)', shadowBlur: 30, shadowOffsetY: 12 }">
      <Text :style="{ x: 15, y: 78, fontSize: 48, fontWeight: 'bold', fontFamily: organizationFont, color: '#1F2937', textAlign: 'center', maxWidth: 190, maxLines: 2, lineHeight: 54 }">{{
        offer
      }}</Text>
    </View>

    <!-- Optional image -->
    <ImageNode v-if="heroImage" :src="heroImage" :style="{ x: 72, y: 900, width: width - 144, height: 300, borderRadius: 32, fit: 'cover' }" />

    <!-- Features -->
    <template v-for="(item, index) in features" :key="index">
      <View :style="{ x: 72, y: (heroImage ? 1250 : 930) + index * 86, width: 48, height: 48, backgroundColor: colorAccent, borderRadius: 24 }">
        <View :style="{ x: 16, y: 16, width: 16, height: 16, backgroundColor: onColor(colorAccent), borderRadius: 8 }" />
      </View>
      <Text :style="{ x: 148, y: (heroImage ? 1252 : 932) + index * 86, fontSize: 36, fontFamily: organizationFont, color: '#1E293B', maxWidth: width - 220, maxLines: 1 }">{{ item }}</Text>
    </template>

    <!-- Call to action + footer -->
    <View :style="{ x: 72, y: height - 330, width: width - 144, height: 110, backgroundColor: colorPrimary, borderRadius: 55 }">
      <Text :style="{ x: (width - 144) / 2, y: 27, fontSize: 44, fontWeight: 'bold', fontFamily: organizationFont, color: onColor(colorPrimary), textAlign: 'center', maxLines: 1 }">{{
        callToAction
      }}</Text>
    </View>
    <View :style="{ x: 72, y: height - 170, width: width - 144, height: 3, backgroundColor: '#E2E8F0' }" />
    <Text :style="{ x: 72, y: height - 140, fontSize: 28, fontFamily: organizationFont, color: '#334155', maxWidth: (width - 144) / 2, maxLines: 1 }">{{ organizationPhone }}</Text>
    <Text :style="{ x: 72, y: height - 100, fontSize: 28, fontFamily: organizationFont, color: '#334155', maxWidth: (width - 144) / 2, maxLines: 1 }">{{ organizationEmail }}</Text>
    <Text :style="{ x: width - 72, y: height - 140, fontSize: 28, fontFamily: organizationFont, color: colorAccent, textAlign: 'right', maxLines: 1 }">{{ organizationWebsite }}</Text>
    <Text :style="{ x: width / 2, y: height - 100, fontSize: 24, fontFamily: organizationFont, color: '#64748B', textAlign: 'right', maxWidth: width / 2 - 72, maxLines: 1 }">{{
      organizationAddress
    }}</Text>
  </CanvasRoot>
</template>
