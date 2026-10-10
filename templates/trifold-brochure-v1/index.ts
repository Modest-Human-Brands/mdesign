import { z } from 'zod'

import { resolveDecor } from '@/domain/decor'
import { NEUTRAL_ORGANIZATION_ID, SOCIAL_KEYS, type SocialKey } from '@/domain/organization'
import { SOCIAL_LABELS, socialEntries } from '@/domain/social'
import { realText, token } from '@/domain/tokens'

import { brandProps, list, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

const textBlock = z.object({ heading: z.string().min(1), text: z.string().min(1) })

export const schema = z.object({
  cover: z.object({
    eyebrow: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
  }),
  flap: textBlock,
  insideLeft: textBlock,
  insideRight: textBlock,
  services: z.object({
    heading: z.string().min(1),
    items: z.array(z.string()).min(1),
    imageUrl: z.string().optional().meta({ 'x-widget': 'image' }),
    imageCaption: z.string().optional(),
  }),
  decor: z
    .object({
      image: z.string().optional().meta({ 'x-widget': 'decor', 'x-decor-slot': 'panel-corner' }),
      tint: z.enum(['none', 'primary', 'accent']).optional(),
    })
    .optional(),
  callToAction: z.object({
    label: z.string().min(1),
    phone: z.string().optional(),
    note: z.string().optional(),
    socialLabel: z.string().optional(),
  }),
})

const placeholders = {
  cover: {
    eyebrow: 'Eyebrow',
    title: 'Brochure title',
    description: 'Short description of the brochure goes here.',
  },
  flap: {
    heading: 'Section heading',
    text: 'Section text goes here. Describe your business, services or offer in a few short lines.',
  },
  insideLeft: {
    heading: 'Section heading',
    text: 'Section text goes here. Describe your business, services or offer in a few short lines.',
  },
  insideRight: {
    heading: 'Section heading',
    text: 'Section text goes here. Describe your business, services or offer in a few short lines.',
  },
  services: {
    heading: 'Section heading',
    items: ['List item one', 'List item two', 'List item three'],
    imageUrl: '',
    imageCaption: 'Image caption',
  },
  decor: { image: 'builtin:leaf', tint: 'none' },
  callToAction: {
    label: 'Call to action',
    phone: 'Phone number',
    note: 'Supporting note',
    socialLabel: 'Section label',
  },
}

const block = (raw: { heading?: unknown; text?: unknown } | undefined) => ({
  heading: text(raw?.heading),
  text: text(raw?.text),
})

export default {
  id: 'trifold-brochure-v1',
  label: 'Tri-fold Brochure',
  shortLabel: 'Brochure',
  category: 'Collateral',
  description:
    'A two-page A4 landscape tri-fold: page 1 outside (flap, contact, cover) and page 2 inside (spread with services).',
  resolution: { width: 2480, height: 1748, aspectRatio: '2480 / 1748', dpi: 300 },
  pages: 2,
  component: Component,
  schema,
  placeholders,
  transformPayload: (values, org) => {
    const brand = brandProps(org)
    const tint =
      values.decor?.tint === 'primary'
        ? brand.colorPrimary
        : values.decor?.tint === 'accent'
          ? brand.colorAccent
          : undefined

    const filled = socialEntries(org.socials)
    const socialHandleFor = (key: SocialKey) =>
      org.id === NEUTRAL_ORGANIZATION_ID ? '' : token(`${SOCIAL_LABELS[key]} Username`)
    const socials =
      filled.length > 0 && org.id !== NEUTRAL_ORGANIZATION_ID
        ? filled
        : SOCIAL_KEYS.map((key) => ({
            key,
            label: SOCIAL_LABELS[key],
            handle: socialHandleFor(key),
          }))

    return {
      ...brand,
      socials,
      leafImageUrl: resolveDecor(values.decor?.image, tint),
      coverEyebrow: text(values.cover?.eyebrow),
      coverTitle: text(values.cover?.title),
      coverDescription: text(values.cover?.description),
      flap: block(values.flap),
      insideLeft: block(values.insideLeft),
      insideRight: block(values.insideRight),
      servicesHeading: text(values.services?.heading),
      serviceItems: list(values.services?.items, 8),
      serviceImageUrl: resolveDecor(values.services?.imageUrl),
      serviceImageCaption: text(values.services?.imageCaption),
      ctaLabel: text(values.callToAction?.label),
      ctaPhone: realText(values.callToAction?.phone) || brand.organizationPhone,
      ctaNote: text(values.callToAction?.note),
      ctaSocialLabel: text(values.callToAction?.socialLabel),
    }
  },
} satisfies DesignTemplateDefinition