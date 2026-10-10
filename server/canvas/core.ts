// server/canvas/core.ts
// Mounts a template component with the canvas renderer, then walks the resulting node tree and issues
// @napi-rs/canvas drawing commands. Returns a PNG buffer at `width*dpi` x `height*dpi` pixels.
import { createCanvas, loadImage, type Image, type SKRSContext2D } from '@napi-rs/canvas'
import type { Component } from 'vue'

import { generateProceduralGradient, transparent } from '~/server/utils/procedural-gradient'
import { mountCanvasTree, textOf, type CanvasNode } from './renderer'
import { fitImage, normalizePadding, roundedRectPath } from './layout'
import { clampLines, wrapAndMeasureText } from './typography'
import type { BoxStyle, ImageStyle, TextStyle } from './elements'

const DEFAULT_FONT = 'Exo2'

interface PaintState {
  /** Absolute origin of the parent's content box, in design pixels. */
  x: number
  y: number
  /** Inherited opacity. */
  alpha: number
  dpi: number
}

export interface RenderOptions {
  width: number
  height: number
  dpi?: number
}

export async function renderComponentToCanvas(component: Component, props: Record<string, any>, { width, height, dpi = 2 }: RenderOptions): Promise<Buffer> {
  const canvas = createCanvas(Math.round(width * dpi), Math.round(height * dpi))
  const ctx = canvas.getContext('2d')
  ctx.scale(dpi, dpi)

  const { root, unmount } = mountCanvasTree(component, { ...props, width, height })
  try {
    await paintChildren(root, ctx, { x: 0, y: 0, alpha: 1, dpi })
  } finally {
    unmount()
  }

  return canvas.toBuffer('image/png')
}

async function paintChildren(node: CanvasNode, ctx: SKRSContext2D, state: PaintState) {
  for (const child of node.children) await paintNode(child, ctx, state)
}

async function paintNode(node: CanvasNode, ctx: SKRSContext2D, state: PaintState) {
  switch (node.type) {
    case 'canvas': {
      return paintCanvas(node, ctx, state)
    }
    case 'view': {
      return paintView(node, ctx, state)
    }
    case 'text': {
      return paintText(node, ctx, state)
    }
    case 'image': {
      return paintImage(node, ctx, state)
    }
    case 'mesh-gradient': {
      return paintMesh(node, ctx, state)
    }
    default: {
      // Fragments / unknown wrappers: paint their children in place
      return paintChildren(node, ctx, state)
    }
  }
}

async function paintCanvas(node: CanvasNode, ctx: SKRSContext2D, state: PaintState) {
  const { width, height, backgroundColor } = node.props
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
  }
  await paintChildren(node, ctx, state)
}

async function paintView(node: CanvasNode, ctx: SKRSContext2D, state: PaintState) {
  const s: BoxStyle = node.props.style ?? {}
  const x = state.x + (s.x ?? 0)
  const y = state.y + (s.y ?? 0)
  const width = s.width ?? 0
  const height = s.height ?? 0
  const alpha = state.alpha * (s.opacity ?? 1)
  const box = { x, y, width, height }

  if (s.backgroundColor) {
    ctx.save()
    ctx.globalAlpha = alpha
    if (s.shadowColor) {
      ctx.shadowColor = s.shadowColor
      ctx.shadowBlur = (s.shadowBlur ?? 24) * state.dpi
      ctx.shadowOffsetX = (s.shadowOffsetX ?? 0) * state.dpi
      ctx.shadowOffsetY = (s.shadowOffsetY ?? 12) * state.dpi
    }
    ctx.fillStyle = s.backgroundColor
    if (s.borderRadius) {
      roundedRectPath(ctx, box, s.borderRadius)
      ctx.fill()
    } else {
      ctx.fillRect(x, y, width, height)
    }
    ctx.restore()
  }

  if (s.borderWidth && s.borderColor) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.lineWidth = s.borderWidth
    ctx.strokeStyle = s.borderColor
    // Stroke inside the box so the border never grows the box
    const inset = s.borderWidth / 2
    roundedRectPath(ctx, { x: x + inset, y: y + inset, width: width - s.borderWidth, height: height - s.borderWidth }, s.borderRadius)
    ctx.stroke()
    ctx.restore()
  }

  const padding = normalizePadding(s.padding)
  const top = padding[0]
  const left = padding[3]
  const childState = { ...state, x: x + left, y: y + top, alpha }

  if (s.overflow === 'hidden') {
    ctx.save()
    roundedRectPath(ctx, box, s.borderRadius)
    ctx.clip()
    await paintChildren(node, ctx, childState)
    ctx.restore()
  } else {
    await paintChildren(node, ctx, childState)
  }
}

function fontFamilyList(family: string | undefined) {
  const value = (family || DEFAULT_FONT).trim()
  return value.includes(',') || value.includes('"') ? value : `"${value}", "${DEFAULT_FONT}", sans-serif`
}

function paintText(node: CanvasNode, ctx: SKRSContext2D, state: PaintState) {
  const s: TextStyle = node.props.style ?? {}
  const content = textOf(node)
  if (!content.trim()) return

  const fontSize = s.fontSize ?? 16
  const lineHeight = s.lineHeight ?? fontSize * 1.3
  const x = state.x + (s.x ?? 0)
  const y = state.y + (s.y ?? 0)
  const align = s.textAlign ?? 'left'

  ctx.save()
  ctx.globalAlpha = state.alpha * (s.opacity ?? 1)
  ctx.font = `${s.fontStyle ?? 'normal'} ${s.fontWeight ?? 'normal'} ${fontSize}px ${fontFamilyList(s.fontFamily)}`
  ctx.letterSpacing = `${s.letterSpacing ?? 0}px`
  ctx.fillStyle = s.color ?? '#000000'
  ctx.textAlign = align
  ctx.textBaseline = 'top'

  const lines = clampLines(ctx, wrapAndMeasureText(ctx, content, s.maxWidth), s.maxLines, s.maxWidth)
  // With a maxWidth the text is aligned inside that column; without one `x` is the anchor itself
  const anchorX = s.maxWidth ? x + (align === 'center' ? s.maxWidth / 2 : align === 'right' ? s.maxWidth : 0) : x

  // Centre the glyphs inside the line box so lineHeight behaves like CSS
  const offsetY = Math.max(0, (lineHeight - fontSize) / 2)
  for (const [index, line] of lines.entries()) ctx.fillText(line, anchorX, y + offsetY + index * lineHeight)
  ctx.restore()
}

async function decodeImage(src: unknown): Promise<Image | undefined> {
  try {
    if (Buffer.isBuffer(src)) return await loadImage(src)
    if (typeof src === 'string' && src.startsWith('data:')) {
      const comma = src.indexOf(',')
      if (comma === -1) return undefined
      const payload = src.slice(comma + 1)
      return await loadImage(Buffer.from(payload, src.slice(0, comma).includes(';base64') ? 'base64' : 'utf8'))
    }
  } catch (error) {
    console.warn('[canvas] could not decode image:', (error as Error).message)
  }
  // Remote URLs are never fetched while painting; resolve them first with resolveDecor()
  return undefined
}

async function paintImage(node: CanvasNode, ctx: SKRSContext2D, state: PaintState) {
  const s: ImageStyle = node.props.style ?? {}
  const image = await decodeImage(node.props.src)
  if (!image) return

  const box = { x: state.x + (s.x ?? 0), y: state.y + (s.y ?? 0), width: s.width ?? 100, height: s.height ?? 100 }
  const { source, target } = fitImage(image, box, s.fit ?? 'cover')

  ctx.save()
  ctx.globalAlpha = state.alpha * (s.opacity ?? 1)
  if (s.borderRadius) {
    roundedRectPath(ctx, box, s.borderRadius)
    ctx.clip()
  } else {
    ctx.beginPath()
    ctx.rect(box.x, box.y, box.width, box.height)
    ctx.clip()
  }
  ctx.drawImage(image, source.x, source.y, source.width, source.height, target.x, target.y, target.width, target.height)
  ctx.restore()
}

function paintMesh(node: CanvasNode, ctx: SKRSContext2D, state: PaintState) {
  const { primary, accent, width, height, borderRadius } = node.props
  const x = state.x + (node.props.x ?? 0)
  const y = state.y + (node.props.y ?? 0)
  const gradient = generateProceduralGradient(primary, accent)

  ctx.save()
  ctx.globalAlpha = state.alpha
  roundedRectPath(ctx, { x, y, width, height }, borderRadius || undefined)
  ctx.clip()

  ctx.fillStyle = gradient.baseColor
  ctx.fillRect(x, y, width, height)

  for (const spot of gradient.spots) {
    const cx = x + width * spot.x
    const cy = y + height * spot.y
    const radius = Math.max(width, height) * spot.r
    const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    radial.addColorStop(0, spot.color)
    radial.addColorStop(1, transparent(spot.color))
    ctx.fillStyle = radial
    ctx.fillRect(x, y, width, height)
  }
  ctx.restore()
}
