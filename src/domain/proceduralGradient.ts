// Auto-branded mesh gradient: balanced radial "spots" derived from the primary and accent colours with HSL harmonics.
export interface GradientSpot {
  x: number
  y: number
  r: number
  color: string
}

export interface ProceduralGradientResult {
  baseColor: string
  spots: GradientSpot[]
  /** Value for the CSS `background` property. */
  cssStyle: string
}

/** '#abc' / 'abc' / '#aabbcc' -> '#aabbcc'; anything else becomes `fallback`. */
export function normalizeHex(value: string | undefined, fallback = '#111827'): string {
  const hex = (value ?? '').trim().replace('#', '')
  if (/^[\da-f]{3}$/i.test(hex)) {
    return `#${hex
      .split('')
      .map((char) => char + char)
      .join('')}`.toLowerCase()
  }
  if (/^[\da-f]{6}$/i.test(hex)) return `#${hex}`.toLowerCase()
  return fallback
}

export function hexToHsl(hex: string): [number, number, number] {
  const num = Number.parseInt(normalizeHex(hex).slice(1), 16)
  const r = (num >> 16) / 255
  const g = ((num >> 8) & 0xff) / 255
  const b = (num & 0xff) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
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

/** Black or white, whichever reads better on `background`. */
export function onColor(background: string): string {
  const num = Number.parseInt(normalizeHex(background).slice(1), 16)
  const luminance = (0.299 * (num >> 16) + 0.587 * ((num >> 8) & 0xff) + 0.114 * (num & 0xff)) / 255
  return luminance > 0.62 ? '#0F172A' : '#FFFFFF'
}

export function generateProceduralGradient(
  primaryHex: string,
  accentHex: string,
): ProceduralGradientResult {
  const primary = normalizeHex(primaryHex)
  const accent = normalizeHex(accentHex, '#5945ea')
  const [pH, pS, pL] = hexToHsl(primary)
  const [aH, aS, aL] = hexToHsl(accent)

  const baseColor = hslToHex(pH, Math.min(pS, 60), Math.max(10, Math.min(pL, 20)))
  const tintSpot = hslToHex(aH, Math.max(aS - 20, 20), Math.min(aL + 35, 92))
  const tertiarySpot = hslToHex((aH + 40) % 360, Math.min(aS + 10, 85), Math.max(aL - 10, 45))

  const spots: GradientSpot[] = [
    { x: 0.15, y: 0.2, r: 0.65, color: tintSpot },
    { x: 0.85, y: 0.25, r: 0.6, color: primary },
    { x: 0.45, y: 0.75, r: 0.75, color: accent },
    { x: 0.85, y: 0.85, r: 0.6, color: tertiarySpot },
  ]

  // Each layer fades to the same colour at 0 alpha so no grey fringe appears between layers
  const layers = spots.map(
    (spot) =>
      `radial-gradient(circle at ${spot.x * 100}% ${spot.y * 100}%, ${spot.color} 0%, ${spot.color}00 ${spot.r * 100}%)`,
  )

  return { baseColor, spots, cssStyle: `${layers.join(', ')}, ${baseColor}` }
}