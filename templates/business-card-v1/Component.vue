<script setup lang="ts">
import { computed } from 'vue'

import QrCode from './QrCode.vue'

type Placement = 'cover' | 'left' | 'center-bottom'

const props = defineProps<{
  page: number
  organizationName: string
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
  gradient: string
  organizationWebsite: string
  personName: string
  personTitle: string
  personPhone: string
  personEmail: string
  background: 'plain' | 'gradient' | 'mesh'
  emphasis: 'regular' | 'bold'
  nameSize: 'standard' | 'large'
  contentStart: 'edge' | 'inset'
  logoPosition: string
  logoSize: 'small' | 'large'
  contactPlacement: 'bottom' | 'under-title'
  frontImage: string
  frontPlacement: Placement
  backImage: string
  backPlacement: Placement
  artOpacity: 'full' | 'medium' | 'subtle'
  backLayout: 'qr' | 'artwork'
  qrStyle: 'standard' | 'rounded'
  frame: 'none' | 'viewfinder'
  qrUrl: string
}>()

const WIDTH = 1050
const HEIGHT = 600
const dark = computed(() => props.background !== 'plain')
const ink = computed(() => (dark.value ? '#FFFFFF' : props.colorPrimary))

const backdrop = computed(() => {
  if (props.background === 'gradient') {
    return { background: `linear-gradient(180deg, #161616 0%, ${props.colorPrimary} 100%)` }
  }
  if (props.background === 'mesh') return { background: props.gradient }
  return { backgroundColor: '#FFFFFF' }
})

const OPACITY = { full: 1, medium: 0.5, subtle: 0.2 } as const

function artStyle(placement: Placement) {
  const base = { position: 'absolute' as const, opacity: OPACITY[props.artOpacity] }
  if (placement === 'cover') {
    return { ...base, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const }
  }
  if (placement === 'left') {
    return {
      ...base,
      left: 0,
      top: 0,
      width: '32%',
      height: '100%',
      objectFit: 'contain' as const,
      objectPosition: 'left top',
    }
  }
  return {
    ...base,
    left: '50%',
    bottom: 0,
    transform: 'translateX(-50%)',
    height: '84%',
    maxWidth: '60%',
    objectFit: 'contain' as const,
    objectPosition: 'center bottom',
  }
}

const LOGO_SIZES = { small: { width: 210, height: 165 }, large: { width: 262, height: 262 } }
const logoBox = computed(() => LOGO_SIZES[props.logoSize])
const logoColumn = computed(() => {
  const column = props.logoPosition.split('-')[1] ?? ''
  return column === 'left' ? 'left' : column === 'right' ? 'right' : 'center'
})
const logoRow = computed(() => props.logoPosition.split('-')[0] ?? '')

const leftPadding = computed(() => {
  const base = props.contentStart === 'inset' ? 205 : 83
  return props.logoPosition !== 'none' && logoColumn.value === 'left'
    ? Math.max(base, 60 + logoBox.value.width + 30)
    : base
})
const rightReserve = computed(() =>
  props.logoPosition !== 'none' && logoColumn.value === 'right'
    ? 60 + logoBox.value.width + 30
    : 70,
)
const nameFont = computed(() => (props.nameSize === 'large' ? 60 : 44))
const heavy = computed(() => (props.emphasis === 'bold' ? 700 : 400))

const ALIGN = {
  left: 'flex-start',
  top: 'flex-start',
  center: 'center',
  middle: 'center',
  right: 'flex-end',
  bottom: 'flex-end',
} as const
const logoLayer = computed(() => ({
  position: 'absolute' as const,
  inset: 0,
  display: 'flex',
  boxSizing: 'border-box' as const,
  padding: '70px 60px',
  justifyContent: ALIGN[logoColumn.value],
  alignItems: ALIGN[(logoRow.value || 'top') as keyof typeof ALIGN],
  pointerEvents: 'none' as const,
}))

const contacts = computed(() => [
  { kind: 'phone', value: props.personPhone },
  { kind: 'email', value: props.personEmail },
])
</script>

<template>
  <div
    class="relative size-full overflow-hidden"
    :style="{ ...backdrop, fontFamily: organizationFont, color: ink, lineHeight: 1.2 }"
  >
    <template v-if="page === 0">
      <img v-if="frontImage" :src="frontImage" alt="" :style="artStyle(frontPlacement)" />

      <div
        :style="{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: contactPlacement === 'bottom' ? 'space-between' : 'center',
          gap: '30px',
          padding: `${contactPlacement === 'bottom' ? 100 : 0}px ${rightReserve}px ${contactPlacement === 'bottom' ? 74 : 0}px ${leftPadding}px`,
          boxSizing: 'border-box',
        }"
      >
        <div>
          <div
            :style="{
              fontSize: `${nameFont}px`,
              lineHeight: 1.05,
              fontWeight: heavy,
              textTransform: 'uppercase',
              overflowWrap: 'anywhere',
            }"
          >
            {{ personName }}
          </div>
          <div :style="{ fontSize: '36px', marginTop: '26px', fontWeight: 400 }">
            {{ personTitle }}
          </div>
          <div
            :style="{
              fontSize: '36px',
              marginTop: '22px',
              fontWeight: 400,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }"
          >
            {{ organizationName }}
          </div>
        </div>

        <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
          <div
            v-for="contact in contacts"
            :key="contact.kind"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '30px',
              fontWeight: heavy,
              overflowWrap: 'anywhere',
            }"
          >
            <svg
              v-if="contact.kind === 'phone'"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              style="flex-shrink: 0"
            >
              <rect x="6" y="2" width="12" height="20" rx="2" />
              <path d="M11 19h2" stroke-linecap="round" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="currentColor"
              style="flex-shrink: 0"
            >
              <path
                d="M4 5h16a2 2 0 0 1 2 2v.4l-10 6.2L2 7.4V7a2 2 0 0 1 2-2Zm18 4.7V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.7l10 6.2 10-6.2Z"
              />
            </svg>
            <span>{{ contact.value }}</span>
          </div>
        </div>
      </div>

      <div v-if="logoPosition !== 'none'" :style="logoLayer">
        <img
          v-if="organizationLogo"
          :src="organizationLogo"
          alt=""
          :style="{
            width: `${logoBox.width}px`,
            height: `${logoBox.height}px`,
            objectFit: 'contain',
            objectPosition: 'center',
          }"
        />
        <span
          v-else
          :style="{
            borderRadius: '999px',
            backgroundColor: colorAccent,
            width: `${Math.min(logoBox.width, logoBox.height)}px`,
            height: `${Math.min(logoBox.width, logoBox.height)}px`,
          }"
        />
      </div>
    </template>

    <template v-else>
      <img v-if="backImage" :src="backImage" alt="" :style="artStyle(backPlacement)" />

      <template v-if="backLayout === 'qr'">
        <div
          v-if="frame === 'viewfinder'"
          :style="{
            position: 'absolute',
            left: `${(WIDTH - 496) / 2}px`,
            top: '60px',
            width: '496px',
            height: '495px',
          }"
        >
          <span
            v-for="corner in [
              { top: 0, left: 0, borderTop: 4, borderLeft: 4 },
              { top: 0, right: 0, borderTop: 4, borderRight: 4 },
              { bottom: 0, left: 0, borderBottom: 4, borderLeft: 4 },
              { bottom: 0, right: 0, borderBottom: 4, borderRight: 4 },
            ]"
            :key="JSON.stringify(corner)"
            :style="{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderStyle: 'solid',
              borderColor: ink,
              borderWidth: 0,
              borderTopWidth: `${corner.borderTop ?? 0}px`,
              borderLeftWidth: `${corner.borderLeft ?? 0}px`,
              borderRightWidth: `${corner.borderRight ?? 0}px`,
              borderBottomWidth: `${corner.borderBottom ?? 0}px`,
              top: corner.top === undefined ? undefined : '0',
              bottom: corner.bottom === undefined ? undefined : '0',
              left: corner.left === undefined ? undefined : '0',
              right: corner.right === undefined ? undefined : '0',
            }"
          />
          <span
            :style="{
              position: 'absolute',
              right: '16px',
              top: '22px',
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              backgroundColor: colorAccent,
            }"
          />
          <span
            v-for="side in ['left', 'right']"
            :key="side"
            :style="{
              position: 'absolute',
              top: '225px',
              [side]: '30px',
              width: '44px',
              height: '44px',
            }"
          >
            <span
              :style="{
                position: 'absolute',
                left: 0,
                top: '20px',
                width: '44px',
                height: '4px',
                backgroundColor: ink,
              }"
            />
            <span
              :style="{
                position: 'absolute',
                left: '20px',
                top: 0,
                width: '4px',
                height: '44px',
                backgroundColor: ink,
              }"
            />
          </span>
          <span
            :style="{
              position: 'absolute',
              left: '21px',
              bottom: '14px',
              display: 'flex',
              gap: '6px',
            }"
          >
            <span
              v-for="bar in 3"
              :key="bar"
              :style="{ width: '16px', height: '28px', backgroundColor: ink }"
            />
          </span>
        </div>

        <div
          :style="{
            position: 'absolute',
            left: `${(WIDTH - 308) / 2}px`,
            top: frame === 'viewfinder' ? '153px' : '112px',
            width: '308px',
            height: '308px',
          }"
        >
          <QrCode
            :rounded="qrStyle === 'rounded'"
            :value="qrUrl"
            :color="ink"
            :logo="organizationLogo"
            :accent="colorAccent"
          />
        </div>
        <div
          :style="{
            position: 'absolute',
            left: '0',
            right: '0',
            top: frame === 'viewfinder' ? '484px' : '440px',
            textAlign: 'center',
            fontSize: '24px',
            letterSpacing: '1px',
          }"
        >
          {{ qrUrl }}
        </div>
      </template>

      <div
        v-else
        :style="{
          position: 'absolute',
          right: '32px',
          bottom: '40px',
          fontSize: '26px',
          fontWeight: 700,
        }"
      >
        {{ organizationWebsite }}
      </div>
    </template>
  </div>
</template>