<script setup lang="ts">
import { CanvasRoot, View, Text, ImageNode, MeshGradient } from '../../canvas/elements'
import { onColor } from '../_shared/organization'

const props = defineProps<{
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
  coverEyebrow: string
  coverTitle: string
  coverDescription: string
  flap: { heading: string; text: string }
  insideLeft: { heading: string; text: string }
  servicesHeading: string
  serviceItems: string[]
  decorImage: string
  ctaLabel: string
  ctaPhone: string
  ctaNote: string
}>()

// Designed on a 1240 x 874 grid, three panels of equal width
const k = props.width / 1240
const u = (n: number) => n * k
const panel = props.width / 3
const font = props.organizationFont
</script>

<template>
  <CanvasRoot :width="width" :height="height" background-color="#FFFFFF">
    <!-- Panel 1: flap -->
    <View :style="{ x: 0, y: 0, width: panel, height }">
      <MeshGradient :primary="colorPrimary" :accent="colorAccent" :width="panel" :height="height" />
      <View
        :style="{
          x: u(30),
          y: u(60),
          width: panel - u(60),
          height: height - u(120),
          backgroundColor: '#FFFFFF',
          borderRadius: u(20),
          shadowColor: 'rgba(0,0,0,0.22)',
          shadowBlur: u(30),
          shadowOffsetY: u(12),
        }">
        <Text :style="{ x: u(28), y: u(36), fontSize: u(26), fontWeight: 'bold', fontFamily: font, color: colorPrimary, maxWidth: panel - u(116), lineHeight: u(34), maxLines: 2 }">{{
          flap.heading
        }}</Text>
        <Text :style="{ x: u(28), y: u(104), fontSize: u(14), fontFamily: font, color: '#334155', maxWidth: panel - u(116), lineHeight: u(23), maxLines: 11 }">{{ flap.text }}</Text>
        <View :style="{ x: u(28), y: u(400), width: u(40), height: u(4), backgroundColor: colorAccent, borderRadius: u(2) }" />
        <Text :style="{ x: u(28), y: u(424), fontSize: u(20), fontWeight: 'bold', fontFamily: font, color: colorPrimary, maxWidth: panel - u(116) }">{{ servicesHeading }}</Text>
        <template v-for="(item, index) in serviceItems" :key="index">
          <View :style="{ x: u(28), y: u(474) + index * u(40) + u(5), width: u(10), height: u(10), backgroundColor: colorAccent, borderRadius: u(5) }" />
          <Text :style="{ x: u(52), y: u(474) + index * u(40), fontSize: u(16), fontFamily: font, color: '#1E293B', maxWidth: panel - u(140), maxLines: 1 }">{{ item }}</Text>
        </template>
      </View>
    </View>

    <!-- Panel 2: inside -->
    <View :style="{ x: panel, y: 0, width: panel, height, backgroundColor: '#F8FAFC' }">
      <View
        :style="{
          x: u(30),
          y: u(60),
          width: panel - u(60),
          height: u(210),
          backgroundColor: '#FFFFFF',
          borderRadius: u(20),
          shadowColor: 'rgba(15,23,42,0.10)',
          shadowBlur: u(20),
          shadowOffsetY: u(8),
        }">
        <ImageNode v-if="organizationLogo" :src="organizationLogo" :style="{ x: u(28), y: u(28), width: u(56), height: u(56), fit: 'contain' }" />
        <View v-else :style="{ x: u(28), y: u(28), width: u(56), height: u(56), backgroundColor: colorPrimary, borderRadius: u(28) }">
          <Text :style="{ x: u(28), y: u(14), fontSize: u(26), fontWeight: 'bold', fontFamily: font, color: onColor(colorPrimary), textAlign: 'center' }">{{ organizationInitial }}</Text>
        </View>
        <Text :style="{ x: u(104), y: u(44), fontSize: u(20), fontWeight: 'bold', fontFamily: font, color: colorPrimary, maxWidth: panel - u(190), maxLines: 1 }">{{ organizationName }}</Text>
        <Text :style="{ x: u(28), y: u(108), fontSize: u(13), fontFamily: font, color: '#64748B', maxWidth: panel - u(116), maxLines: 1 }">{{ organizationEmail }}</Text>
        <Text :style="{ x: u(28), y: u(132), fontSize: u(13), fontFamily: font, color: '#64748B', maxWidth: panel - u(116), maxLines: 1 }">{{ organizationPhone }} · {{ organizationWebsite }}</Text>
        <Text :style="{ x: u(28), y: u(158), fontSize: u(13), fontFamily: font, color: '#64748B', maxWidth: panel - u(116), lineHeight: u(19), maxLines: 2 }">{{ organizationAddress }}</Text>
      </View>
      <View :style="{ x: u(30), y: u(320), width: u(40), height: u(4), backgroundColor: colorAccent, borderRadius: u(2) }" />
      <Text :style="{ x: u(30), y: u(344), fontSize: u(28), fontWeight: 'bold', fontFamily: font, color: colorPrimary, maxWidth: panel - u(60), lineHeight: u(36), maxLines: 2 }">{{
        insideLeft.heading
      }}</Text>
      <Text :style="{ x: u(30), y: u(430), fontSize: u(15), fontFamily: font, color: '#475569', maxWidth: panel - u(60), lineHeight: u(25), maxLines: 14 }">{{ insideLeft.text }}</Text>
    </View>

    <!-- Panel 3: cover -->
    <View :style="{ x: panel * 2, y: 0, width: panel, height }">
      <MeshGradient :primary="colorPrimary" :accent="colorAccent" :width="panel" :height="height" />
      <View :style="{ x: 0, y: 0, width: panel, height, backgroundColor: 'rgba(15,23,42,0.35)' }" />
      <ImageNode v-if="decorImage" :src="decorImage" :style="{ x: panel - u(250), y: height - u(300), width: u(300), height: u(300), fit: 'contain', opacity: 0.35 }" />
      <Text :style="{ x: u(40), y: u(240), fontSize: u(14), fontFamily: font, fontWeight: 'bold', letterSpacing: u(4), color: '#E2E8F0', maxWidth: panel - u(80), maxLines: 1 }">{{
        coverEyebrow.toUpperCase()
      }}</Text>
      <Text :style="{ x: u(40), y: u(280), fontSize: u(52), fontWeight: 'bold', fontFamily: font, color: '#FFFFFF', maxWidth: panel - u(80), lineHeight: u(60), maxLines: 4 }">{{ coverTitle }}</Text>
      <Text :style="{ x: u(40), y: u(540), fontSize: u(18), fontFamily: font, color: '#E2E8F0', maxWidth: panel - u(80), lineHeight: u(28), maxLines: 4 }">{{ coverDescription }}</Text>
      <View :style="{ x: u(40), y: u(722), width: u(230), height: u(52), backgroundColor: '#FFFFFF', borderRadius: u(26) }">
        <Text :style="{ x: u(115), y: u(15), fontSize: u(17), fontWeight: 'bold', fontFamily: font, color: colorPrimary, textAlign: 'center', maxLines: 1 }">{{ ctaLabel }}</Text>
      </View>
      <Text :style="{ x: u(40), y: u(798), fontSize: u(16), fontWeight: 'bold', fontFamily: font, color: '#FFFFFF', maxWidth: panel - u(80), maxLines: 1 }">{{ ctaPhone }}</Text>
      <Text :style="{ x: u(40), y: u(824), fontSize: u(12), fontFamily: font, color: '#CBD5E1', maxWidth: panel - u(80), maxLines: 1 }">{{ ctaNote }}</Text>
    </View>
  </CanvasRoot>
</template>
