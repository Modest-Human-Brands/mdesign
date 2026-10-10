// server/canvas/elements.ts
// Declarative primitives for templates. Each one renders a lowercase host element ('view', 'text', ...) that the canvas
// renderer (server/canvas/renderer.ts) collects into a node tree and core.ts paints with @napi-rs/canvas.
// Coordinates are relative to the parent box (after its padding) and expressed in design pixels.
import { defineComponent, h, type PropType } from 'vue'

export type Spacing = number | [number, number] | [number, number, number, number]
export type Radius = number | [number, number, number, number]

export interface BoxStyle {
  x?: number
  y?: number
  width?: number
  height?: number
  /** Offsets the origin of the children. Number, [vertical, horizontal] or [top, right, bottom, left]. */
  padding?: Spacing
  backgroundColor?: string
  borderRadius?: Radius
  borderColor?: string
  borderWidth?: number
  shadowColor?: string
  shadowBlur?: number
  shadowOffsetX?: number
  shadowOffsetY?: number
  opacity?: number
  /** `hidden` clips the children to the (rounded) box. */
  overflow?: 'visible' | 'hidden'
}

export interface TextStyle {
  x?: number
  y?: number
  /** Wraps the text at this width. Without it the text stays on one line (explicit "\n" still breaks). */
  maxWidth?: number
  /** Truncates with an ellipsis after this many wrapped lines. */
  maxLines?: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: 'normal' | 'bold' | number | `${number}`
  fontStyle?: 'normal' | 'italic'
  color?: string
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'center' | 'right'
  opacity?: number
}

export type ImageFit = 'cover' | 'contain' | 'fill'
export interface ImageStyle extends BoxStyle {
  fit?: ImageFit
}

export const CanvasRoot = defineComponent({
  name: 'CanvasRoot',
  props: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    backgroundColor: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () => h('canvas', { width: props.width, height: props.height, backgroundColor: props.backgroundColor }, slots.default?.())
  },
})

export const View = defineComponent({
  name: 'View',
  props: { style: { type: Object as PropType<BoxStyle>, default: () => ({}) } },
  setup(props, { slots }) {
    return () => h('view', { style: props.style }, slots.default?.())
  },
})

export const Text = defineComponent({
  name: 'Text',
  props: { style: { type: Object as PropType<TextStyle>, default: () => ({}) } },
  setup(props, { slots }) {
    return () => h('text', { style: props.style }, slots.default?.())
  },
})

export const ImageNode = defineComponent({
  name: 'ImageNode',
  props: {
    /** A `data:` URI or a Buffer. Resolve remote/decor references first (see resolveDecor in server/utils/decor.ts). */
    src: { type: [String, Object] as PropType<string | Buffer>, default: '' },
    style: { type: Object as PropType<ImageStyle>, default: () => ({}) },
  },
  setup(props) {
    return () => h('image', { src: props.src, style: props.style })
  },
})

export const MeshGradient = defineComponent({
  name: 'MeshGradient',
  props: {
    primary: { type: String, required: true },
    accent: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    borderRadius: { type: [Number, Array] as PropType<Radius>, default: 0 },
  },
  setup(props) {
    return () => h('mesh-gradient', { ...props })
  },
})
