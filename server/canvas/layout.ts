// server/canvas/layout.ts
// Box model helpers: padding, rounded rectangles and image fitting.
import type { SKRSContext2D } from '@napi-rs/canvas'
import type { ImageFit, Radius, Spacing } from './elements'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function normalizePadding(padding: Spacing | undefined): [number, number, number, number] {
  if (padding === undefined) return [0, 0, 0, 0]
  if (typeof padding === 'number') return [padding, padding, padding, padding]
  if (padding.length === 2) return [padding[0], padding[1], padding[0], padding[1]]
  return padding
}

/** Radii clamped like CSS so adjacent corners never overlap. */
export function normalizeRadius(radius: Radius | undefined, width: number, height: number): [number, number, number, number] {
  if (!radius) return [0, 0, 0, 0]
  const corners = (typeof radius === 'number' ? [radius, radius, radius, radius] : [...radius]) as [number, number, number, number]
  const scale = Math.min(1, width / Math.max(corners[0] + corners[1], corners[3] + corners[2], 1), height / Math.max(corners[0] + corners[3], corners[1] + corners[2], 1))
  return corners.map((value) => Math.max(0, value * scale)) as [number, number, number, number]
}

/** Adds a (possibly rounded) rectangle to the current path. */
export function roundedRectPath(ctx: SKRSContext2D, { x, y, width, height }: Rect, radius?: Radius) {
  const [tl, tr, br, bl] = normalizeRadius(radius, width, height)
  ctx.beginPath()
  ctx.moveTo(x + tl, y)
  ctx.lineTo(x + width - tr, y)
  if (tr) ctx.arcTo(x + width, y, x + width, y + tr, tr)
  ctx.lineTo(x + width, y + height - br)
  if (br) ctx.arcTo(x + width, y + height, x + width - br, y + height, br)
  ctx.lineTo(x + bl, y + height)
  if (bl) ctx.arcTo(x, y + height, x, y + height - bl, bl)
  ctx.lineTo(x, y + tl)
  if (tl) ctx.arcTo(x, y, x + tl, y, tl)
  ctx.closePath()
}

/** Source and destination rectangles for drawing an image of `natural` size into `box` with the given fit. */
export function fitImage(natural: { width: number; height: number }, box: Rect, fit: ImageFit = 'cover') {
  const source: Rect = { x: 0, y: 0, width: natural.width, height: natural.height }
  const target: Rect = { ...box }
  if (fit === 'fill' || natural.width === 0 || natural.height === 0) return { source, target }

  const imageRatio = natural.width / natural.height
  const boxRatio = box.width / box.height

  if (fit === 'cover') {
    if (imageRatio > boxRatio) {
      source.width = natural.height * boxRatio
      source.x = (natural.width - source.width) / 2
    } else {
      source.height = natural.width / boxRatio
      source.y = (natural.height - source.height) / 2
    }
  } else if (imageRatio > boxRatio) {
    target.height = box.width / imageRatio
    target.y = box.y + (box.height - target.height) / 2
  } else {
    target.width = box.height * imageRatio
    target.x = box.x + (box.width - target.width) / 2
  }
  return { source, target }
}
