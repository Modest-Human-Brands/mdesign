import { SOCIAL_KEYS, type SocialKey } from './organization'

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
}

const KIND_SEGMENTS = new Set([
  'company',
  'in',
  'c',
  'channel',
  'user',
  'pages',
  'school',
  'showcase',
])

export function socialHandle(key: SocialKey, link: string): string {
  const raw = link.trim()
  if (raw === '') return ''

  let segment = ''
  let host = ''
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    host = url.hostname.replace(/^www\./, '')
    segment = url.pathname.split('/').find((part) => part !== '' && !KIND_SEGMENTS.has(part)) ?? ''
  } catch {
    segment = raw
  }

  const name = decodeURIComponent(segment).replace(/^@/, '').trim()
  if (name === '' || name === 'profile.php') return host
  return key === 'linkedin' ? name : `@${name}`
}

export interface SocialEntry {
  key: SocialKey
  label: string
  handle: string
}

export function socialEntries(socials: Record<SocialKey, string>, max = 4): SocialEntry[] {
  return SOCIAL_KEYS.filter((key) => socials[key].trim() !== '')
    .slice(0, max)
    .map((key) => ({ key, label: SOCIAL_LABELS[key], handle: socialHandle(key, socials[key]) }))
}