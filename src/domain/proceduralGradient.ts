interface GradientSpot {
  x: number
  y: number
  r: number
  color: string
}

export interface ProceduralGradientResult {
  baseColor: string
  spots: GradientSpot[]
  cssStyle: string
}

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

  const layers = spots.map(
    (spot) =>
      `radial-gradient(circle at ${spot.x * 100}% ${spot.y * 100}%, ${spot.color} 0%, ${spot.color}00 ${spot.r * 100}%)`,
  )

  return { baseColor, spots, cssStyle: `${layers.join(', ')}, ${baseColor}` }
}
export function generateFluidGradient(primaryHex: string, accentHex: string): string {
  const [, , pL] = hexToHsl(normalizeHex(primaryHex))
  const [aH, aS] = hexToHsl(normalizeHex(accentHex, '#5945ea'))
  const saturation = Math.max(aS, 78)
  const lightness = Math.min(Math.max(pL + 38, 52), 62)
  const offsets = [70, 35, 0, -35, -70]
  const neutral = aS < 12
  const greys = [84, 74, 64, 54, 44]
  const palette = offsets.map((offset, index) =>
    neutral
      ? hslToHex(0, 0, greys[index]!)
      : hslToHex((aH + offset + 360) % 360, saturation, lightness),
  )

  const rows = [
    { y: 0, xs: [8, 36, 64, 92] },
    { y: 24, xs: [22, 52, 80] },
    { y: 50, xs: [6, 34, 66, 94] },
    { y: 76, xs: [20, 50, 82] },
    { y: 100, xs: [10, 38, 64, 90] },
  ]
  const layers = rows.flatMap((row, index) =>
    row.xs.map(
      (x) =>
        `radial-gradient(ellipse 24% 42% at ${x}% ${row.y}%, ${palette[index]}f2 0%, ${palette[index]}00 100%)`,
    ),
  )
  const stops = palette.map((color, index) => `${color} ${index * 25}%`).join(', ')
  return `${layers.join(', ')}, linear-gradient(180deg, ${stops})`
}