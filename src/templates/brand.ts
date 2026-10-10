import { generateProceduralGradient, normalizeHex, onColor } from '@/domain/proceduralGradient'
import type { OrganizationProfile } from '@/domain/organization'

export interface BrandProps {
  organizationName: string
  organizationInitial: string
  organizationLogo: string
  organizationFont: string
  colorPrimary: string
  colorAccent: string
  onPrimary: string
  onAccent: string
  gradient: string
  organizationPhone: string
  organizationEmail: string
  organizationWebsite: string
  organizationAddress: string
}

const stack = (family: string) =>
  `'${family.replaceAll("'", '')}', 'Exo 2 Variable', system-ui, sans-serif`

/** Flattens the organisation profile into the brand props every template shares. */
export function brandProps(org: OrganizationProfile): BrandProps {
  const name = org.name.trim() || 'Your Company'
  const primary = normalizeHex(org.primary)
  const accent = normalizeHex(org.accent, '#5945ea')

  return {
    organizationName: name,
    organizationInitial: name.charAt(0).toUpperCase(),
    organizationLogo: org.logo?.dataUrl ?? '',
    organizationFont: stack(org.font || 'Exo 2'),
    colorPrimary: primary,
    colorAccent: accent,
    onPrimary: onColor(primary),
    onAccent: onColor(accent),
    gradient: generateProceduralGradient(primary, accent).cssStyle,
    organizationPhone: org.phone.trim(),
    organizationEmail: org.contactEmail.trim(),
    organizationWebsite: org.website
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, ''),
    organizationAddress: org.address.trim(),
  }
}

export const text = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

export const list = (value: unknown, max: number): string[] =>
  (Array.isArray(value) ? value : [])
    .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
    .slice(0, max)