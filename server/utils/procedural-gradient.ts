// server/utils/procedural-gradient.ts
// Auto-branded mesh gradient: balanced radial "spots" derived from the primary and accent colours with HSL harmonics.
export interface GradientSpot {
  x: number
  y: number
  r: number
  color: string
}

export interface ProceduralGradient {
  baseColor: string
  spots: GradientSpot[]
}

/** '#abc' / 'abc' / '#aabbcc' -> '#aabbcc'; anything else falls back to `fallback`. */
export function normalizeHex(value: string | undefined, fallback = '#111827'): string {
  const hex = (value || '').trim().replace('#', '')
  if (/^[\da-f]{3}$/i.test(hex)) return `#${[...hex].map((c) => c + c).join('')}`.toLowerCase()
  if (/^[\da-f]{6}$/i.test(hex)) return `#${hex}`.toLowerCase()
  return fallback
}

export function hexToRgb(hex: string): [number, number, number] {
  const num = Number.parseInt(normalizeHex(hex).slice(1), 16)
  return [num >> 16, (num >> 8) & 0xff, num & 0xff]
}

/** Same colour fully transparent: gradients fade to this so no grey fringe appears. */
export const transparent = (hex: string) => `rgba(${hexToRgb(hex).join(',')},0)`

export function hexToHsl(hex: string): [number, number, number] {
  const [r8, g8, b8] = hexToRgb(hex)
  const r = r8 / 255
  const g = g8 / 255
  const b = b8 / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      }
      case g: {
        h = (b - r) / d + 2
        break
      }
      default: {
        h = (r - g) / d + 4
      }
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

export function hslToHex(h: number, s: number, l: number): string {
  const lightness = l / 100
  const a = (s * Math.min(lightness, 1 - lightness)) / 100
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}

/** Generates a balanced, non-clashing mesh gradient from the primary and accent colours. */
export function generateProceduralGradient(primaryHex: string, accentHex: string): ProceduralGradient {
  const primary = normalizeHex(primaryHex)
  const accent = normalizeHex(accentHex, '#5945ea')
  const [pH, pS, pL] = hexToHsl(primary)
  const [aH, aS, aL] = hexToHsl(accent)

  // 1. Darkened base layer anchoring the whole composition
  const baseColor = hslToHex(pH, Math.min(pS, 60), Math.max(10, Math.min(pL, 20)))
  // 2. Light tint spot (ambient brightness)
  const tintSpot = hslToHex(aH, Math.max(aS - 20, 20), Math.min(aL + 35, 92))
  // 3. Analogous tertiary tone
  const tertiarySpot = hslToHex((aH + 40) % 360, Math.min(aS + 10, 85), Math.max(aL - 10, 45))

  return {
    baseColor,
    spots: [
      { x: 0.15, y: 0.2, r: 0.65, color: tintSpot },
      { x: 0.85, y: 0.25, r: 0.6, color: primary },
      { x: 0.45, y: 0.75, r: 0.75, color: accent },
      { x: 0.85, y: 0.85, r: 0.6, color: tertiarySpot },
    ],
  }
}
