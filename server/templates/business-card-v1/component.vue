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
  organizationWebsite: string
  organizationAddress: string
  personName: string
  personTitle: string
  personPhone: string
  personEmail: string
  tagline: string
}>()

const side = 360
</script>

<template>
  <CanvasRoot :width="width" :height="height" background-color="#FFFFFF">
    <!-- Brand side -->
    <MeshGradient :primary="colorPrimary" :accent="colorAccent" :width="side" :height="height" />
    <ImageNode v-if="organizationLogo" :src="organizationLogo" :style="{ x: side / 2 - 80, y: height / 2 - 110, width: 160, height: 160, fit: 'contain' }" />
    <View
      v-else
      :style="{ x: side / 2 - 70, y: height / 2 - 110, width: 140, height: 140, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 70, borderColor: 'rgba(255,255,255,0.7)', borderWidth: 4 }">
      <Text :style="{ x: 70, y: 32, fontSize: 72, fontWeight: 'bold', fontFamily: organizationFont, color: '#FFFFFF', textAlign: 'center' }">{{ organizationInitial }}</Text>
    </View>
    <Text
      :style="{ x: 20, y: height / 2 + 74, fontSize: 24, fontWeight: 'bold', fontFamily: organizationFont, color: '#FFFFFF', textAlign: 'center', maxWidth: side - 40, maxLines: 2, lineHeight: 30 }"
      >{{ organizationName }}</Text
    >

    <!-- Details -->
    <Text :style="{ x: side + 56, y: 74, fontSize: 52, fontWeight: 'bold', fontFamily: organizationFont, color: colorPrimary, maxWidth: width - side - 100, maxLines: 1 }">{{ personName }}</Text>
    <Text :style="{ x: side + 56, y: 140, fontSize: 26, fontFamily: organizationFont, color: colorAccent, letterSpacing: 2, maxWidth: width - side - 100, maxLines: 1 }">{{
      personTitle.toUpperCase()
    }}</Text>
    <View :style="{ x: side + 56, y: 196, width: 56, height: 5, backgroundColor: colorAccent, borderRadius: 2 }" />
    <Text :style="{ x: side + 56, y: 224, fontSize: 24, fontStyle: 'italic', fontFamily: organizationFont, color: '#64748B', maxWidth: width - side - 100, maxLines: 1 }">{{ tagline }}</Text>

    <template v-for="(line, index) in [personPhone, personEmail, organizationWebsite, organizationAddress]" :key="index">
      <View :style="{ x: side + 56, y: 296 + index * 56 + 8, width: 14, height: 14, backgroundColor: colorAccent, borderRadius: 7 }" />
      <Text :style="{ x: side + 86, y: 296 + index * 56, fontSize: 24, fontFamily: organizationFont, color: '#1E293B', maxWidth: width - side - 130, maxLines: 2, lineHeight: 30 }">{{ line }}</Text>
    </template>
    <View :style="{ x: width - 10, y: 0, width: 10, height, backgroundColor: onColor(colorPrimary) === '#FFFFFF' ? colorPrimary : colorAccent }" />
  </CanvasRoot>
</template>
