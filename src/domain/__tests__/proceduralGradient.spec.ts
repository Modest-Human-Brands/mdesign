import { describe, expect, it } from 'vite-plus/test'

import {
  generateProceduralGradient,
  hexToHsl,
  hslToHex,
  normalizeHex,
  onColor,
} from '../proceduralGradient'

describe('proceduralGradient', () => {
  it('normalises short, long and invalid hex colours', () => {
    expect(normalizeHex('#ABC')).toBe('#aabbcc')
    expect(normalizeHex('5945EA')).toBe('#5945ea')
    expect(normalizeHex('nope', '#000000')).toBe('#000000')
  })

  it('round-trips hex through HSL', () => {
    const [h, s, l] = hexToHsl('#5945ea')
    expect(hslToHex(h, s, l)).toMatch(/^#[\da-f]{6}$/)
    expect(hexToHsl('#ffffff')).toEqual([0, 0, 100])
  })

  it('builds a four-spot mesh with a dark base', () => {
    const gradient = generateProceduralGradient('#111827', '#5945EA')
    expect(gradient.spots).toHaveLength(4)
    expect(hexToHsl(gradient.baseColor)[2]).toBeLessThanOrEqual(20)
    expect(gradient.cssStyle.startsWith('radial-gradient(')).toBe(true)
    expect(gradient.cssStyle.endsWith(gradient.baseColor)).toBe(true)
  })

  it('picks a readable foreground', () => {
    expect(onColor('#ffffff')).toBe('#0F172A')
    expect(onColor('#111827')).toBe('#FFFFFF')
  })
})