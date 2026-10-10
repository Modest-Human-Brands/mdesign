export const CELLS = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'middle-center',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

import type { PositionMap } from '@/domain/types'

export const ninePositions: PositionMap = Object.fromEntries(
  CELLS.map((cell, anchor) => [cell, { anchor }]),
)

export const positionMeta = (positions: PositionMap) => ({
  'x-widget': 'position' as const,
  'x-positions': positions,
})