import { clamp } from '@src/lib/utils.ts'
import type { CSSProperties } from 'react'

type Place = { x: number; y: number; rotate: number }

type Arc = { radius: number; step: number }

export type Anchor = { left: string; bottom: number }

type PilePlaceOptions = { mirror?: boolean; spread?: boolean; top?: boolean; tilted?: boolean }

export type HandState = {
  offset: number
  slots: number
  unfolded: boolean
  moving: boolean
  scrolling: boolean
  scrolled: boolean
}

export type PileKind = 'parts' | 'favorites'

export type PileSide = 'left' | 'right'

export type HandEnd = 'before' | 'after'

const CENTER: Place = { x: 0, y: 0, rotate: 0 }

export const CARD_WIDTH = 104
export const CARD_HEIGHT = 136

const PILE_INSET = 160
const PILE_BOTTOM = 155
const LABEL_BELOW_PILE = 90
const PILE_GAP = 48

export const PILE_SIDES: Record<PileKind, PileSide> = { parts: 'left', favorites: 'right' }

export const PILE_ANCHORS: Record<PileKind, Anchor> = {
  parts: { left: `${PILE_INSET}px`, bottom: PILE_BOTTOM },
  favorites: { left: `calc(100% - ${PILE_INSET}px)`, bottom: PILE_BOTTOM },
}

const ARC_ANCHOR: Anchor = { left: '50%', bottom: 0 }
const ARC: Arc = { radius: 700, step: 6.2 }
const REFERENCE_SLOTS = 9
const MAX_SLOTS = 12
const BELOW_SCREEN = 140

const RENDERED_MARGIN = 2

const HIDDEN_COUNT_RISE = 30
const HIDDEN_COUNT_GAP = 12
const HIDDEN_COUNT_HALF_WIDTH = 17
const HIDDEN_COUNT_HALF_HEIGHT = 13

const radians = (degrees: number) => (degrees * Math.PI) / 180

function sizedArc(slots: number): Arc {
  if (slots <= REFERENCE_SLOTS) return ARC
  const step = (ARC.step * (REFERENCE_SLOTS - 1)) / (slots - 1)
  const radius = (ARC.radius * ARC.step) / step
  return { radius, step }
}

export function arcPlace(slot: number, slots: number): Place {
  const arc = sizedArc(slots)
  const rotate = (slot - (slots - 1) / 2) * arc.step
  const outer = ((slots - 1) / 2) * arc.step
  return {
    x: arc.radius * Math.sin(radians(rotate)),
    y: arc.radius * (Math.cos(radians(outer)) - Math.cos(radians(rotate))) - PILE_BOTTOM,
    rotate,
  }
}

export function fullHandTop(width: number): number {
  const slots = visibleSlots(MAX_SLOTS, width)
  return CARD_HEIGHT / 2 - arcPlace((slots - 1) / 2, slots).y
}

function outerCorner(slots: number) {
  const { x, y, rotate } = arcPlace(slots - 1, slots)
  const angle = radians(rotate)
  return {
    x: x + (CARD_WIDTH / 2) * Math.cos(angle),
    y: y + CARD_HEIGHT / 2 + (CARD_WIDTH / 2) * Math.sin(angle),
    angle,
  }
}

function hiddenCountPlace(end: HandEnd, slots: number): Place {
  const corner = outerCorner(slots)
  const edge = corner.x + (HIDDEN_COUNT_RISE + HIDDEN_COUNT_HALF_HEIGHT) * Math.tan(corner.angle)
  const countX = edge + HIDDEN_COUNT_GAP + HIDDEN_COUNT_HALF_WIDTH
  return { x: end === 'after' ? countX : -countX, y: corner.y - HIDDEN_COUNT_RISE, rotate: 0 }
}

export function hiddenCountStyle(end: HandEnd, slots: number) {
  return placeStyle(ARC_ANCHOR, hiddenCountPlace(end, slots))
}

export function labelStyle(left: string) {
  return placeStyle({ left, bottom: PILE_BOTTOM }, { x: 0, y: LABEL_BELOW_PILE, rotate: 0 })
}

function outerReach(slots: number, withCounts: boolean): number {
  const corner = outerCorner(slots)
  const card = corner.x + CARD_HEIGHT * Math.sin(corner.angle)
  if (!withCounts) return card
  return Math.max(card, hiddenCountPlace('after', slots).x + HIDDEN_COUNT_HALF_WIDTH)
}

export function visibleSlots(count: number, width: number): number {
  const room = width / 2 - PILE_INSET - CARD_WIDTH / 2 - PILE_GAP
  let slots = Math.min(count, MAX_SLOTS)
  while (slots > 1 && outerReach(slots, slots < count) > room) slots--
  return slots
}

export function clampOffset(offset: number, count: number, slots: number): number {
  return clamp(offset, 0, count - slots)
}

export function centeredOffset(index: number, count: number, slots: number): number {
  return clampOffset(Math.round(index - (slots - 1) / 2), count, slots)
}

export function offsetShowing(index: number, offset: number, slots: number): number {
  if (index < offset) return index
  if (index > offset + slots - 1) return index - slots + 1
  return offset
}

export function hiddenCounts(offset: number, count: number, slots: number) {
  const before = Math.round(clampOffset(offset, count, slots))
  return { before, after: count - slots - before }
}

export function isInWindow(
  index: number,
  { offset, slots }: HandState,
  margin = RENDERED_MARGIN,
): boolean {
  const first = Math.round(offset) - margin
  return index >= first && index < first + slots + 2 * margin
}

export function pileStart({ offset, unfolded, moving }: HandState, openingStart: number) {
  return unfolded || moving ? Math.round(offset) : openingStart
}

export function isRendered(index: number, state: HandState, start: number) {
  const { slots, unfolded, moving } = state
  if (unfolded) return isInWindow(index, state, moving ? 0 : RENDERED_MARGIN)
  return index >= start && index < start + slots
}

export function nearestSlot(slot: number, slots: number): number {
  return clamp(Math.round(slot), 0, slots - 1)
}

export function isShown(slot: number, slots: number): boolean {
  return Math.round(slot) === nearestSlot(slot, slots)
}

export function pilePlace(
  index: number,
  count: number,
  { mirror = false, spread = false, top = false, tilted = false }: PilePlaceOptions = {},
): Place {
  const side = mirror ? -1 : 1
  const gap = spread ? 9 : 3
  return {
    x: side * ((index % 3) - 1) * gap,
    y: (spread && top ? -14 : 0) - index * 2,
    rotate: side * (tilted ? (spread ? -6 : -3) : (index - (count - 1) / 2) * (spread ? 4.5 : 2.5)),
  }
}

export function placeStyle({ left, bottom }: Anchor, { x, y, rotate }: Place = CENTER) {
  return {
    left: `calc(${left} + ${x}px)`,
    top: `calc(100% - ${bottom}px + ${y}px)`,
    rotate: `${rotate}deg`,
  }
}

export function arcStyle(slot: number, slots: number): CSSProperties {
  return placeStyle(ARC_ANCHOR, arcPlace(slot, slots))
}

export function beyondArcStyle(slot: number, slots: number): CSSProperties {
  return arcStyle(clamp(slot, -1, slots), slots)
}

export function belowArcStyle(slot: number, slots: number) {
  const { x, rotate } = arcPlace(nearestSlot(slot, slots), slots)
  return placeStyle(ARC_ANCHOR, { x, y: BELOW_SCREEN, rotate })
}
