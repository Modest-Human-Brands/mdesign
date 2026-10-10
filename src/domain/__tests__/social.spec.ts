import { describe, expect, it } from 'vite-plus/test'

import { socialEntries, socialHandle } from '../social'

describe('socialHandle', () => {
  it('infers the account name from a profile link', () => {
    expect(socialHandle('instagram', 'https://www.instagram.com/modesthumanbrands/')).toBe(
      '@modesthumanbrands',
    )
    expect(socialHandle('youtube', 'https://www.youtube.com/@modesthumanbrands')).toBe(
      '@modesthumanbrands',
    )
    expect(socialHandle('linkedin', 'https://linkedin.com/company/modest-human-brands')).toBe(
      'modest-human-brands',
    )
    expect(socialHandle('facebook', 'facebook.com/modesthumanbrands')).toBe('@modesthumanbrands')
  })

  it('falls back to the host when the link has no account path', () => {
    expect(socialHandle('facebook', 'https://www.facebook.com/profile.php?id=1')).toBe(
      'facebook.com',
    )
    expect(socialHandle('instagram', '')).toBe('')
  })

  it('lists only the networks that were filled in', () => {
    const entries = socialEntries({
      instagram: 'https://instagram.com/acme',
      facebook: '',
      linkedin: '',
      youtube: '',
    })
    expect(entries).toEqual([{ key: 'instagram', label: 'Instagram', handle: '@acme' }])
  })
})