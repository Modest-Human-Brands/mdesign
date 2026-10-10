import { z } from 'zod'

import registerTemplate, { resolutionOf } from '~/server/utils/template-registry'
import { decorColorFor, resolveDecor } from '~/server/utils/decor'
import { baseFonts, brandProps, clean, cleanList, defaultOrganization, organizationSchema } from '../_shared/organization'
import Component from './component.vue'

const textBlock = z.object({ heading: z.string(), text: z.string() })

export const brochureSchema = z.object({
  cover: z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
  }),
  flap: textBlock,
  insideLeft: textBlock,
  services: z.object({
    heading: z.string(),
    items: z.array(z.string()),
  }),
  decor: z
    .object({
      image: z.string().optional().meta({ 'x-widget': 'decor', 'x-decor-slot': 'panel-corner' }),
      tint: z.enum(['none', 'primary', 'accent']).optional(),
    })
    .optional(),
  callToAction: z.object({
    label: z.string(),
    phone: z.string().optional(),
    note: z.string().optional(),
  }),
  organization: organizationSchema,
})

export type BrochurePayload = z.infer<typeof brochureSchema>

const placeholders: BrochurePayload = {
  cover: {
    eyebrow: 'Capabilities 2026',
    title: 'Stories worth watching',
    description: 'Production services, from pitch to final delivery.',
  },
  flap: {
    heading: 'Who we are',
    text: 'We are a small production house that takes a film from first idea to final delivery. Our team handles scripting, shoot, edit and post under one roof, so every project keeps a single, clear point of view.',
  },
  insideLeft: {
    heading: 'How we work',
    text: 'Every film starts with a short discovery call. We agree the brief, the budget and a timeline, then move through script, shoot and edit with a clear review step at each stage.',
  },
  services: {
    heading: 'Services',
    items: ['Brand films', 'Ad campaigns', 'Documentary and series', 'Motion graphics'],
  },
  decor: { image: 'builtin:leaf', tint: 'none' },
  callToAction: {
    label: 'Start a project',
    phone: '+91 22 4000 1234',
    note: 'Mon to Sat, 10am to 7pm',
  },
  organization: defaultOrganization,
}

const block = (raw: { heading?: string; text?: string } | undefined, fallback: { heading: string; text: string }) => ({
  heading: raw?.heading || fallback.heading,
  text: raw?.text ?? fallback.text,
})

registerTemplate({
  id: 'brochure-v1',
  label: 'Tri-fold Brochure',
  shortLabel: 'Brochure',
  category: 'Collateral',
  description: 'A three-panel landscape company brochure with a flap, an inside spread and a branded cover.',
  resolution: resolutionOf(2480, 1748, '1.419:1'),
  fonts: baseFonts,
  component: Component,
  schema: brochureSchema,
  placeholders,
  transformPayload: async (raw: BrochurePayload) => {
    const brand = await brandProps(raw.organization)
    const p = placeholders

    return {
      ...brand,
      coverEyebrow: clean(raw.cover?.eyebrow, p.cover.eyebrow),
      coverTitle: raw.cover?.title || p.cover.title,
      coverDescription: clean(raw.cover?.description, p.cover.description),
      flap: block(raw.flap, p.flap),
      insideLeft: block(raw.insideLeft, p.insideLeft),
      servicesHeading: raw.services?.heading || p.services.heading,
      serviceItems: cleanList(raw.services?.items ?? p.services.items, 6),
      decorImage: await resolveDecor(raw.decor?.image ?? p.decor?.image, { tintColor: decorColorFor(raw.decor?.tint, { primary: brand.colorPrimary, accent: brand.colorAccent }) }),
      ctaLabel: raw.callToAction?.label || p.callToAction.label,
      ctaPhone: raw.callToAction?.phone || brand.organizationPhone,
      ctaNote: clean(raw.callToAction?.note, p.callToAction.note),
    }
  },
})
