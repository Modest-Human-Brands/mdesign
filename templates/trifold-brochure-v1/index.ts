import { z } from 'zod'

import { resolveDecor } from '@/domain/decor'
import { SOCIAL_KEYS } from '@/domain/organization'

import { brandProps, list, text } from '../brand'
import type { DesignTemplateDefinition } from '../types'
import Component from './Component.vue'

const textBlock = z.object({ heading: z.string().min(1), text: z.string().min(1) })

export const schema = z.object({
  side: z.enum(['outside', 'inside']),
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
  side: 'outside',
  cover: {
    eyebrow: 'Capabilities 2026',
    title: 'Stories worth watching',
    description: 'Production services, from pitch to final delivery.',
  },
  flap: {
    heading: 'What we do',
    text: 'We are a small production house that takes a film from first idea to final delivery. Our team handles scripting, shoot, edit and post under one roof, so every project keeps a single, clear point of view.',
  },
  insideLeft: {
    heading: 'What we do',
    text: 'We are a small production house that takes a film from first idea to final delivery. Our team handles scripting, shoot, edit and post under one roof, so every project keeps a single, clear point of view.',
  },
  insideRight: {
    heading: 'How we work',
    text: 'Every film starts with a short discovery call. We agree the brief, the budget and a timeline, then move through script, shoot and edit with a clear review step at each stage.',
  },
  services: {
    heading: 'Services',
    items: ['Brand films', 'Ad campaigns', 'Documentary and series'],
    imageUrl: '',
    imageCaption: 'A frame from our latest shoot',
  },
  decor: { image: 'builtin:leaf', tint: 'none' },
  callToAction: {
    label: 'Start a project',
    phone: '+91 22 4000 1234',
    note: 'Mon to Sat, 10am to 7pm',
    socialLabel: 'Follow us',
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
    'A two-sided A4 landscape tri-fold: outside (flap, contact, cover) and inside (spread with services).',
  resolution: { width: 2480, height: 1748, aspectRatio: '2480 / 1748', dpi: 300 },
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

    const socialInitials = SOCIAL_KEYS.filter((key) => org.socials[key].trim() !== '')
      .slice(0, 4)
      .map((key) => key.charAt(0).toUpperCase())

    return {
      ...brand,
      side: values.side === 'inside' ? 'inside' : 'outside',
      socialInitials,
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
      ctaPhone: text(values.callToAction?.phone) || brand.organizationPhone,
      ctaNote: text(values.callToAction?.note),
      ctaSocialLabel: text(values.callToAction?.socialLabel),
    }
  },
} satisfies DesignTemplateDefinition