<script setup lang="ts">
import IconFacebook from '~icons/simple-icons/facebook'
import IconInstagram from '~icons/simple-icons/instagram'
import IconLinkedin from '~icons/simple-icons/linkedin'
import IconYoutube from '~icons/simple-icons/youtube'
import { computed } from 'vue'

import type { SocialKey } from '@/domain/organization'

import Decor from './Decor.vue'
import Lockup from './Lockup.vue'

const props = defineProps<{
  page: number
  organizationName: string
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
  organizationPhone: string
  organizationEmail: string
  organizationAddress: string
  socials: { key: SocialKey; label: string; handle: string }[]
  leafImageUrl: string
  coverEyebrow: string
  coverTitle: string
  coverDescription: string
  flap: { heading: string; text: string }
  insideLeft: { heading: string; text: string }
  insideRight: { heading: string; text: string }
  servicesHeading: string
  serviceItems: string[]
  serviceImageUrl: string
  serviceImageCaption: string
  ctaLabel: string
  ctaPhone: string
  ctaNote: string
  ctaSocialLabel: string
}>()

const FRAME_WIDTH = 735
const SHEET_WIDTH = 2480
const SHEET_HEIGHT = 1748
const k = SHEET_WIDTH / FRAME_WIDTH
const frameHeight = SHEET_HEIGHT / k

const SOCIAL_ICONS = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  linkedin: IconLinkedin,
  youtube: IconYoutube,
}

const MUTED = '#3D3D3D'
const NEUTRAL = '#D9D9D9'
const tint = computed(() => `${props.colorAccent}33`)

const contactSize = (value: string) => (value.length > 26 ? 9.5 : value.length > 22 ? 10.5 : 12)

const panel = (extra: Record<string, string | number>) => ({
  width: '33.3333%',
  height: '100%',
  overflow: 'hidden',
  position: 'relative' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  paddingLeft: '26px',
  paddingRight: '26px',
  ...extra,
})

const heading = { fontSize: '24px', lineHeight: 1.25 }
const body = { fontSize: '12px', lineHeight: 1.5 }
</script>

<template>
  <div
    class="relative size-full overflow-hidden bg-white"
    :style="{ fontFamily: organizationFont, color: '#191919' }"
  >
    <div
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'row',
        width: `${FRAME_WIDTH}px`,
        height: `${frameHeight}px`,
        transform: `scale(${k})`,
        transformOrigin: 'top left',
        backgroundColor: '#FFFFFF',
      }"
    >
      <template v-if="page === 0">
        <div :style="panel({ paddingTop: '96px', backgroundColor: '#FFFFFF' })">
          <Decor :accent="colorAccent" :leaf-image-url="leafImageUrl" />
          <div :style="{ ...heading, position: 'relative', color: colorPrimary }">
            {{ flap.heading }}
          </div>
          <div :style="{ ...body, position: 'relative', color: colorPrimary, marginTop: '8px' }">
            {{ flap.text }}
          </div>
        </div>

        <div :style="panel({ paddingTop: '40px', backgroundColor: tint })">
          <Lockup
            :name="organizationName"
            :logo="organizationLogo"
            :color="colorPrimary"
            :accent="colorAccent"
          />

          <div
            :style="{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px 8px 26px 12px',
            }"
          >
            <div
              v-if="organizationPhone"
              :style="{
                ...body,
                fontSize: `${contactSize(organizationPhone)}px`,
                color: colorPrimary,
                marginBottom: '8px',
              }"
            >
              {{ organizationPhone }}
            </div>
            <div
              v-if="organizationEmail"
              :style="{
                ...body,
                fontSize: `${contactSize(organizationEmail)}px`,
                color: colorPrimary,
                marginBottom: '8px',
              }"
            >
              {{ organizationEmail }}
            </div>
            <div v-if="organizationAddress" :style="{ ...body, color: colorPrimary }">
              {{ organizationAddress }}
            </div>
          </div>

          <div :style="{ marginTop: '16px' }">
            <div :style="{ fontSize: '20px', lineHeight: 1.25, color: colorPrimary }">
              {{ ctaLabel }}
            </div>
            <div
              v-if="ctaPhone"
              :style="{
                fontSize: '24px',
                lineHeight: 1.25,
                fontWeight: 700,
                color: colorPrimary,
                marginTop: '4px',
              }"
            >
              {{ ctaPhone }}
            </div>
            <div
              v-if="ctaNote"
              :style="{ fontSize: '10px', lineHeight: 1.2, color: MUTED, marginTop: '4px' }"
            >
              {{ ctaNote }}
            </div>
          </div>

          <div v-if="socials.length > 0" :style="{ marginTop: '16px' }">
            <div
              v-if="ctaSocialLabel"
              :style="{
                fontSize: '12px',
                lineHeight: 1.5,
                fontWeight: 700,
                color: colorPrimary,
                marginBottom: '10px',
              }"
            >
              {{ ctaSocialLabel }}
            </div>
            <div
              v-for="social in socials"
              :key="social.key"
              :style="{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '8px',
              }"
            >
              <div
                :style="{
                  flexShrink: 0,
                  width: '22px',
                  height: '22px',
                  borderRadius: '11px',
                  backgroundColor: colorPrimary,
                  marginRight: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }"
              >
                <component :is="SOCIAL_ICONS[social.key]" style="width: 11px; height: 11px" />
              </div>
              <div
                :style="{
                  flex: 1,
                  minWidth: 0,
                  fontSize: '12px',
                  lineHeight: 1.25,
                  color: colorPrimary,
                  overflowWrap: 'anywhere',
                }"
              >
                {{ social.handle }}
              </div>
            </div>
          </div>
        </div>

        <div
          :style="
            panel({
              paddingTop: '96px',
              paddingBottom: '132px',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            })
          "
        >
          <Decor :accent="colorAccent" :leaf-image-url="leafImageUrl" />
          <Lockup
            :name="organizationName"
            :logo="organizationLogo"
            :color="colorPrimary"
            :accent="colorAccent"
          />

          <div style="position: relative">
            <div
              v-if="coverEyebrow"
              :style="{
                fontSize: '10px',
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: MUTED,
                marginBottom: '8px',
              }"
            >
              {{ coverEyebrow }}
            </div>
            <div
              :style="{
                fontSize: '32px',
                lineHeight: 1.25,
                fontWeight: 700,
                letterSpacing: '-0.64px',
                color: colorPrimary,
              }"
            >
              {{ coverTitle }}
            </div>
            <div v-if="coverDescription" :style="{ ...body, color: MUTED, marginTop: '8px' }">
              {{ coverDescription }}
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div :style="panel({ paddingTop: '96px', backgroundColor: '#FFFFFF' })">
          <Decor :accent="colorAccent" :leaf-image-url="leafImageUrl" />
          <div :style="{ ...heading, position: 'relative', color: colorPrimary }">
            {{ insideLeft.heading }}
          </div>
          <div :style="{ ...body, position: 'relative', color: colorPrimary, marginTop: '8px' }">
            {{ insideLeft.text }}
          </div>
        </div>

        <div :style="panel({ paddingTop: '52px', backgroundColor: '#FFFFFF' })">
          <div
            :style="{
              position: 'absolute',
              left: '21px',
              top: '26.2px',
              width: '203px',
              height: '1px',
              backgroundColor: NEUTRAL,
            }"
          />
          <div
            :style="{
              position: 'absolute',
              left: '21px',
              top: '493.1px',
              width: '203px',
              height: '1px',
              backgroundColor: NEUTRAL,
            }"
          />

          <div :style="{ fontSize: '20px', lineHeight: 1.25, color: colorPrimary }">
            {{ servicesHeading }}
          </div>
          <div
            v-for="(item, index) in serviceItems"
            :key="index"
            :style="{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '10px',
            }"
          >
            <div
              :style="{
                flexShrink: 0,
                width: '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: colorAccent,
                marginRight: '8px',
              }"
            />
            <div :style="{ ...body, flex: 1, color: colorPrimary }">{{ item }}</div>
          </div>

          <div :style="{ marginTop: '20px' }">
            <div
              :style="{
                height: '105px',
                backgroundColor: tint,
                overflow: 'hidden',
                borderRadius: '52px 16px 40px 16px',
              }"
            >
              <img
                v-if="serviceImageUrl"
                :src="serviceImageUrl"
                alt=""
                style="display: block; width: 100%; height: 105px; object-fit: cover"
              />
            </div>
            <div
              v-if="serviceImageCaption"
              :style="{ fontSize: '10px', lineHeight: 1.2, color: MUTED, marginTop: '8px' }"
            >
              {{ serviceImageCaption }}
            </div>
          </div>
        </div>

        <div :style="panel({ paddingTop: '96px', backgroundColor: '#FFFFFF' })">
          <Decor :accent="colorAccent" :leaf-image-url="leafImageUrl" />
          <div :style="{ ...heading, position: 'relative', color: colorPrimary }">
            {{ insideRight.heading }}
          </div>
          <div :style="{ ...body, position: 'relative', color: colorPrimary, marginTop: '8px' }">
            {{ insideRight.text }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>