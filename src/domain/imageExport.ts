// Browser-native rasterisation: the rendered design element is serialised into an SVG <foreignObject>,
// with the page's CSS and the fonts it uses embedded as data URIs, then drawn onto a canvas for raster formats.
export type ExportFormat = 'png' | 'webp' | 'jpeg' | 'svg'

export interface ExportOptions {
  element: HTMLElement
  width: number
  height: number
  format: ExportFormat
  /** Pixel multiplier: 1 = design size, 2 = retina, ~4.17 = 300 DPI for a 72 DPI design. */
  scale?: number
  quality?: number
}

export const EXPORT_MIME: Record<ExportFormat, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
}

const MAX_CANVAS_SIDE = 16_384
const dataUrlCache = new Map<string, Promise<string>>()

function toDataUrl(url: string): Promise<string> {
  let pending = dataUrlCache.get(url)
  if (!pending) {
    pending = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        return response.blob()
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
            reader.onerror = () => reject(reader.error)
            reader.readAsDataURL(blob)
          }),
      )
    dataUrlCache.set(url, pending)
    pending.catch(() => dataUrlCache.delete(url))
  }
  return pending
}

function readRules(sheet: CSSStyleSheet): CSSRule[] {
  try {
    return [...sheet.cssRules]
  } catch {
    return []
  }
}

/** Same-origin CSS of the page, with only the @font-face rules the markup actually uses. */
async function collectCss(markup: string): Promise<string> {
  const rules: string[] = []
  const fontFaces: CSSFontFaceRule[] = []

  for (const sheet of document.styleSheets) {
    for (const rule of readRules(sheet)) {
      if (rule instanceof CSSFontFaceRule) fontFaces.push(rule)
      else rules.push(rule.cssText)
    }
  }

  const used = fontFaces.filter((rule) => {
    const family = rule.style.getPropertyValue('font-family').replaceAll(/["']/g, '').trim()
    return (
      family !== '' && (markup.includes(family) || markup.includes(family.replaceAll(/\s+/g, '')))
    )
  })

  const embedded = await Promise.all(
    used.map(async (rule) => {
      let css = rule.cssText
      const urls = [
        ...new Set(
          [...css.matchAll(/url\(["']?(?!data:)([^"')]+)["']?\)/g)].map((match) => match[1]!),
        ),
      ]
      for (const url of urls) {
        try {
          css = css.replaceAll(url, await toDataUrl(new URL(url, document.baseURI).href))
        } catch {
          // A font that cannot be embedded falls back to the next family
        }
      }
      return css
    }),
  )

  // Theme variables live on :root / :host; inside the exported document the wrapper plays that role
  return [...embedded, ...rules]
    .join('\n')
    .replaceAll(/(^|[\s,{}>+~])(?::root|:host|html|body)(?![\w-])/g, '$1.mdesign-export')
}

/** Replaces every <img src> with an inlined data URI so the SVG renders without network access. */
async function inlineImages(root: HTMLElement): Promise<void> {
  await Promise.all(
    [...root.querySelectorAll('img')].map(async (image) => {
      const src = image.getAttribute('src')
      if (!src || src.startsWith('data:')) return
      try {
        image.setAttribute('src', await toDataUrl(new URL(src, document.baseURI).href))
      } catch {
        image.removeAttribute('src')
      }
    }),
  )
}

export async function buildSvg(
  element: HTMLElement,
  width: number,
  height: number,
): Promise<string> {
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = `${width}px`
  clone.style.height = `${height}px`
  clone.style.transform = 'none'
  clone.style.maxWidth = 'none'
  clone.style.maxHeight = 'none'
  clone.style.margin = '0'
  await inlineImages(clone)

  const markup = new XMLSerializer().serializeToString(clone)
  const css = await collectCss(markup)

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<foreignObject x="0" y="0" width="${width}" height="${height}">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" class="mdesign-export" style="width:${width}px;height:${height}px;">` +
    `<style><![CDATA[${css}]]></style>${markup}</div></foreignObject></svg>`
  )
}

function svgToDataUri(svg: string): string {
  const bytes = new TextEncoder().encode(svg)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCodePoint(...bytes.subarray(i, i + 0x8000))
  return `data:image/svg+xml;base64,${btoa(binary)}`
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'sync'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not render the design to an image.'))
    image.src = url
  })
}

export async function exportElementToBlob(options: ExportOptions): Promise<Blob> {
  const { element, width, height, format, scale = 2, quality = 0.95 } = options

  // Make sure web fonts are ready before the design is serialised
  await document.fonts.ready

  const svg = await buildSvg(element, width, height)
  if (format === 'svg') return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })

  const limit = Math.min(scale, MAX_CANVAS_SIDE / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * limit)
  canvas.height = Math.round(height * limit)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not initialise a canvas.')

  if (format === 'jpeg') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  // A data URI (not a blob: URL) keeps the canvas untainted so it can be exported
  const image = await loadImage(svgToDataUri(svg))
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error(`Your browser cannot encode ${format.toUpperCase()}.`)),
      EXPORT_MIME[format],
      quality,
    )
  })
}