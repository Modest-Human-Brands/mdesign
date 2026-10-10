// server/templates/_shared/organization.ts
// Organisation schema shared by every template, plus the brand props (name, logo, colours, font, contact) the components need.
import { z } from 'zod'

import { resolveDecor } from '~/server/utils/decor'
import { organizationPresets, type OrganizationProfile } from '~/server/utils/organization-store'
import { normalizeHex } from '~/server/utils/procedural-gradient'

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  legalName: z.string(),
  entityType: z.enum(['LLP', 'Private Limited', 'Proprietorship']),
  tradeRelationship: z.enum(['Primary', 'Trading As', 'Operating Division', 'Wholly-Owned Subsidiary', 'Special Purpose Vehicle']),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  address: z.string(),
  foundedYear: z.number(),
  accountDetails: z.object({
    accountName: z.string(),
    accountNumber: z.number(),
    bankName: z.string(),
    ifscCode: z.string(),
  }),
  branding: z.object({
    logo: z.string(),
    color: z.object({
      primary: z.string(),
      accent: z.string(),
    }),
    font: z.string(),
  }),
  website: z.string().optional(),
  phone: z.string().optional(),
  contactEmail: z.email(),
  billingEmail: z.email(),
  whatsapp: z.string().optional(),
  socials: z.record(z.any(), z.any()).optional(),
  primaryContactId: z.string(),
  organizationMemberIds: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

/** Default organisation used by template placeholders. */
export const defaultOrganization: OrganizationProfile = organizationPresets['modest-human-brands']!

export interface BrandProps {
  organizationName: string
  organizationInitial: string
  /** PNG data URI, or '' when the organisation has no (reachable) logo. */
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
  organizationPhone: string
  organizationEmail: string
  organizationWebsite: string
  organizationAddress: string
}

/** Flattens an organisation into component props. Never throws: an unreachable logo is simply omitted. */
export async function brandProps(org: Partial<OrganizationProfile> | undefined): Promise<BrandProps> {
  const fallback = defaultOrganization
  const name = org?.name || fallback.name

  return {
    organizationName: name,
    organizationInitial: name.trim().charAt(0).toUpperCase() || '?',
    organizationLogo: await resolveDecor(org?.branding?.logo ?? fallback.branding.logo),
    organizationFont: org?.branding?.font || fallback.branding.font,
    colorPrimary: normalizeHex(org?.branding?.color?.primary, fallback.branding.color.primary),
    colorAccent: normalizeHex(org?.branding?.color?.accent, fallback.branding.color.accent),
    organizationPhone: org?.phone ?? fallback.phone ?? '',
    organizationEmail: org?.contactEmail || fallback.contactEmail,
    organizationWebsite: (org?.website ?? fallback.website ?? '').replace(/^https?:\/\//, '').replace(/\/$/, ''),
    organizationAddress: org?.address || fallback.address,
  }
}

/** Black or white, whichever reads better on the given background. */
export function onColor(background: string): string {
  const num = Number.parseInt(normalizeHex(background).slice(1), 16)
  const luminance = (0.299 * (num >> 16) + 0.587 * ((num >> 8) & 0xff) + 0.114 * (num & 0xff)) / 255
  return luminance > 0.62 ? '#0F172A' : '#FFFFFF'
}

/** Standard font list: Exo 2 for the brand default, bundled as an offline fallback. */
export const baseFonts = [{ name: 'Exo2', family: 'Exo 2', weights: [400, 700], path: './asset/Exo2-Regular.ttf' }]

export const clean = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback)

export const cleanList = (value: unknown, max: number): string[] => (Array.isArray(value) ? value : []).filter((item): item is string => typeof item === 'string' && item.trim() !== '').slice(0, max)
