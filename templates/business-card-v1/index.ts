import { z } from 'zod'

import { resolveDecor } from '@/domain/decor'
import { realText, token } from '@/domain/tokens'

import { brandProps, text } from '../brand'
import { CELLS, ninePositions, positionMeta } from '../positions'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

const choice = <T extends [string, ...string[]]>(...values: T) => z.enum(values)

const contentStartMeta = positionMeta({
  edge: { anchor: 3, cells: [0, 3, 6] },
  inset: { anchor: 4, cells: [1, 4, 7] },
})
const contactsMeta = positionMeta({
  'under-title': { anchor: 3, cells: [3, 4] },
  bottom: { anchor: 6, cells: [6, 7] },
})
const artPlacementMeta = positionMeta({
  cover: { anchor: 4, cells: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  left: { anchor: 3, cells: [0, 3, 6] },
  'center-bottom': { anchor: 7, cells: [7] },
})

export const schema = z.object({
  person: z.object({
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Job title is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.email('Invalid email address'),
  }),
  design: z.object({
    background: choice('plain', 'gradient', 'mesh'),
    emphasis: choice('regular', 'bold'),
    nameSize: choice('standard', 'large'),
    contentStart: choice('edge', 'inset').meta(contentStartMeta),
    contacts: choice('under-title', 'bottom').meta(contactsMeta),
    logoPosition: choice('none', ...CELLS).meta(positionMeta(ninePositions)),
    logoSize: choice('small', 'large'),
  }),
  artwork: z.object({
    frontImage: z.string().optional().meta({ 'x-widget': 'image' }),
    frontPlacement: choice('cover', 'left', 'center-bottom').meta(artPlacementMeta),
    backImage: z.string().optional().meta({ 'x-widget': 'image' }),
    backPlacement: choice('center-bottom', 'cover', 'left').meta(artPlacementMeta),
    opacity: choice('full', 'medium', 'subtle'),
  }),
  back: z.object({
    layout: choice('qr', 'artwork'),
    qrStyle: choice('standard', 'rounded'),
    frame: choice('none', 'viewfinder'),
    qrUrl: z.string().optional(),
  }),
})

const placeholders = {
  person: {
    name: 'Aarav Sharma',
    title: 'Creative Director',
    phone: '+91 98200 12345',
    email: 'aarav@example.com',
  },
  design: {
    background: 'gradient',
    emphasis: 'regular',
    nameSize: 'large',
    contentStart: 'edge',
    contacts: 'bottom',
    logoPosition: 'top-right',
    logoSize: 'small',
  },
  artwork: {
    frontImage: '',
    frontPlacement: 'cover',
    backImage: '',
    backPlacement: 'center-bottom',
    opacity: 'medium',
  },
  back: { layout: 'qr', qrStyle: 'standard', frame: 'none', qrUrl: '' },
}

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback

export default {
  id: 'business-card-v1',
  label: 'Business Card',
  shortLabel: 'Business Card',
  category: 'Stationery',
  description:
    'A 3.5" x 2" visiting card (300 DPI), front and back. Switch background, layout, artwork and a QR code to produce many styles.',
  resolution: { width: 1050, height: 600, aspectRatio: '7 / 4', dpi: 300 },
  pages: 2,
  component: Component,
  schema,
  placeholders,
  transformPayload: (values, org) => {
    const brand = brandProps(org)
    const design = values.design ?? {}
    const artwork = values.artwork ?? {}
    const website = org.website.trim()

    return {
      ...brand,
      personName: text(values.person?.name),
      personTitle: text(values.person?.title),
      personPhone: text(values.person?.phone),
      personEmail: text(values.person?.email),
      background: pick(design.background, ['plain', 'gradient', 'mesh'], 'gradient'),
      emphasis: pick(design.emphasis, ['regular', 'bold'], 'regular'),
      nameSize: pick(design.nameSize, ['standard', 'large'], 'large'),
      contentStart: pick(design.contentStart, ['edge', 'inset'], 'edge'),
      logoPosition: pick(design.logoPosition, ['none', ...CELLS], 'top-right'),
      logoSize: pick(design.logoSize, ['small', 'large'], 'small'),
      contactPlacement: pick(design.contacts, ['bottom', 'under-title'], 'bottom'),
      frontImage: resolveDecor(artwork.frontImage),
      frontPlacement: pick(artwork.frontPlacement, ['cover', 'left', 'center-bottom'], 'cover'),
      backImage: resolveDecor(artwork.backImage),
      backPlacement: pick(
        artwork.backPlacement,
        ['center-bottom', 'cover', 'left'],
        'center-bottom',
      ),
      artOpacity: pick(artwork.opacity, ['full', 'medium', 'subtle'], 'medium'),
      backLayout: pick(values.back?.layout, ['qr', 'artwork'], 'qr'),
      qrStyle: pick(values.back?.qrStyle, ['standard', 'rounded'], 'standard'),
      frame: pick(values.back?.frame, ['none', 'viewfinder'], 'none'),
      qrUrl: realText(values.back?.qrUrl) || website || token('Back Qr Url'),
    }
  },
} satisfies DesignTemplateDefinition