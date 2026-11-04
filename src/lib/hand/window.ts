import { clamp } from '@src/lib/utils.ts'
import type { HandShape } from './geometry.ts'

export type HandState = {
  count: number
  offset: number
  shape: HandShape
  unfolded: boolean
  moving: boolean
  scrolling: boolean
  scrolled: boolean
}

export type OffsetBounds = { min: number; max: number }

type CardRange = { first: number; last: number }

const RENDERED_MARGIN = 2

export function offsetBounds(count: number, { slots, overscroll }: HandShape): OffsetBounds {
  return { min: 0 - overscroll, max: count - slots + overscroll }
}

export function clampOffset(offset: number, { min, max }: OffsetBounds): number {
  return clamp(offset, min, max)
}

export function isScrollable(count: number, shape: HandShape): boolean {
  const { min, max } = offsetBounds(count, shape)
  return max > min
}

export function centeredOffset(index: number, count: number, shape: HandShape): number {
  return clampOffset(Math.round(index - (shape.slots - 1) / 2), offsetBounds(count, shape))
}

export function hiddenCounts(offset: number, count: number, shape: HandShape) {
  const before = Math.round(clampOffset(offset, offsetBounds(count, shape)))
  return { before, after: count - shape.slots - before }
}

export function handPosition(offset: number, count: number, shape: HandShape, firstIndex: number) {
  const middle = clamp(Math.round(offset + (shape.slots - 1) / 2), 0, count - 1)
  return {
    position: Math.max(middle - firstIndex + 1, 0),
    total: count - firstIndex,
  }
}

export function visibleCards(offset: number, count: number, shape: HandShape): CardRange {
  const first = Math.round(offset)
  return {
    first: Math.max(first, 0),
    last: Math.min(first + shape.slots, count) - 1,
  }
}

export function rangeSize({ first, last }: CardRange): number {
  return last - first + 1
}

export function heldCards(
  { count, offset, shape, unfolded, moving }: HandState,
  openingOffset: number,
): CardRange {
  return visibleCards(unfolded || moving ? offset : openingOffset, count, shape)
}

export function isRendered(index: number, { unfolded, moving }: HandState, cards: CardRange) {
  const margin = unfolded && !moving ? RENDERED_MARGIN : 0
  return index >= cards.first - margin && index <= cards.last + margin
}

export function isShown(slot: number, { slots }: HandShape): boolean {
  const nearest = Math.round(slot)
  return nearest >= 0 && nearest < slots
}
