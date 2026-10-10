import {
  generateFluidGradient,
  generateProceduralGradient,
  normalizeHex,
  onColor,
} from '@/domain/proceduralGradient'
import type { OrganizationProfile } from '@/domain/organization'
import { token } from '@/domain/tokens'

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
  fluidGradient: string
  organizationPhone: string
  organizationEmail: string
  organizationWebsite: string
  organizationAddress: string
}

const stack = (family: string) =>
  `'${family.replaceAll("'", '')}', 'Exo 2 Variable', system-ui, sans-serif`

export function brandProps(org: OrganizationProfile): BrandProps {
  const realName = org.name.trim()
  const name = realName || token('Business Name')
  const primary = normalizeHex(org.primary)
  const accent = normalizeHex(org.accent, '#5945ea')

  return {
    organizationName: name,
    organizationInitial: (realName || 'B').charAt(0).toUpperCase(),
    organizationLogo: org.logo?.dataUrl ?? '',
    organizationFont: stack(org.font || 'Exo 2'),
    colorPrimary: primary,
    colorAccent: accent,
    onPrimary: onColor(primary),
    onAccent: onColor(accent),
    gradient: generateProceduralGradient(primary, accent).cssStyle,
    fluidGradient: generateFluidGradient(primary, accent),
    organizationPhone: org.phone.trim() || token('Phone'),
    organizationEmail: org.contactEmail.trim() || token('Contact Email'),
    organizationWebsite:
      org.website
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '') || token('Website'),
    organizationAddress: org.address.trim() || token('Address'),
  }
}

export const text = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

export const list = (value: unknown, max: number): string[] =>
  (Array.isArray(value) ? value : [])
    .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
    .slice(0, max)