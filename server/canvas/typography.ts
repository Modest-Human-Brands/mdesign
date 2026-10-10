// server/canvas/typography.ts
// Word wrapping and measuring for <Text>. The context must already carry the font and letter spacing.
import type { SKRSContext2D } from '@napi-rs/canvas'

/** Breaks a single over-long word (URLs, emails) into chunks that fit `maxWidth`. */
function breakWord(ctx: SKRSContext2D, word: string, maxWidth: number): string[] {
  const chunks: string[] = []
  let current = ''
  for (const char of word) {
    if (current && ctx.measureText(current + char).width > maxWidth) {
      chunks.push(current)
      current = char
    } else {
      current += char
    }
  }
  if (current) chunks.push(current)
  return chunks
}

/** Wraps `text` to `maxWidth` (honours explicit newlines). Without `maxWidth` only the newlines break. */
export function wrapAndMeasureText(ctx: SKRSContext2D, text: string, maxWidth?: number): string[] {
  const paragraphs = text.replaceAll('\r', '').split('\n')
  if (!maxWidth || maxWidth <= 0) return paragraphs

  const lines: string[] = []
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean)
    if (words.length === 0) {
      lines.push('')
      continue
    }

    let line = ''
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (ctx.measureText(candidate).width <= maxWidth) {
        line = candidate
        continue
      }
      if (line) lines.push(line)

      if (ctx.measureText(word).width > maxWidth) {
        const chunks = breakWord(ctx, word, maxWidth)
        line = chunks.pop() ?? ''
        lines.push(...chunks)
      } else {
        line = word
      }
    }
    lines.push(line)
  }
  return lines
}

/** Keeps the first `maxLines` lines and ends the last one with an ellipsis that still fits. */
export function clampLines(ctx: SKRSContext2D, lines: string[], maxLines: number | undefined, maxWidth?: number): string[] {
  if (!maxLines || lines.length <= maxLines) return lines

  const kept = lines.slice(0, maxLines)
  let last = `${kept[maxLines - 1]!.trimEnd()}…`
  while (maxWidth && last.length > 1 && ctx.measureText(last).width > maxWidth) {
    last = `${last.slice(0, -2).trimEnd()}…`
  }
  kept[maxLines - 1] = last
  return kept
}
