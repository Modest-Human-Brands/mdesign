import leafSvg from '@/assets/decor/leaf.svg?raw'

export interface BuiltinDecor {
  id: string
  label: string
  /** Single-colour line art that can be recoloured with the brand colours. */
  tintable: boolean
  svg: string
  slots: string[]
}

export const builtinDecors: BuiltinDecor[] = [
  { id: 'leaf', label: 'Leaf', tintable: true, svg: leafSvg, slots: ['panel-corner'] },
]

export type DecorKind = 'none' | 'builtin' | 'data' | 'url'

export function decorKind(value: string): DecorKind {
  const text = value.trim()
  if (text === '' || text === 'none') return 'none'
  if (text.startsWith('builtin:')) return 'builtin'
  if (text.startsWith('data:')) return 'data'
  return 'url'
}

export const svgDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

/**
 * Resolves a decor reference (`builtin:<id>`, a data URI or an https URL) to something usable as `<img src>`.
 * Builtin line art is recoloured with `tint`. Returns '' for none/unknown.
 */
export function resolveDecor(value: string | undefined, tint?: string): string {
  const text = (value ?? '').trim()
  switch (decorKind(text)) {
    case 'builtin': {
      const decor = builtinDecors.find((item) => item.id === text.slice('builtin:'.length))
      if (!decor) return ''
      const svg =
        decor.tintable && tint
          ? decor.svg.replaceAll(/(stroke|fill)="(?!none)[^"]*"/g, `$1="${tint}"`)
          : decor.svg
      return svgDataUrl(svg)
    }
    case 'data':
    case 'url':
      return text
    default:
      return ''
  }
}

export function describeDecor(value: string): string {
  switch (decorKind(value)) {
    case 'none':
      return ''
    case 'builtin':
      return value.trim().slice('builtin:'.length)
    case 'data':
      return 'Uploaded image'
    default:
      return value.trim()
  }
}

export interface RecentDecor {
  id: string
  url: string
}