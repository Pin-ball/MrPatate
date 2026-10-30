import type { CSSProperties } from 'react'

type Place = { x: number; y: number; rotate: number }

type Arc = { radius: number; centerBelow: number; step: number }

export type Anchor = { left: string; bottom: number }

type PileOptions = { mirror?: boolean; spread?: boolean; top?: boolean; tilted?: boolean }

type MoveEase = 'overshoot' | 'out'

export type CardLayout = {
  place: CSSProperties
  folded?: boolean
  ignorePointer: boolean
  moveDuration?: number
  moveDelay?: number
  ease?: MoveEase
  hidden?: boolean
  scrolling?: boolean
  enter?: CSSProperties
}

export type HandState = {
  offset: number
  slots: number
  unfolded: boolean
  moving: boolean
  scrolling: boolean
}

const CENTER: Place = { x: 0, y: 0, rotate: 0 }

export const CARD_WIDTH = 104
export const CARD_HEIGHT = 136

const PILE_INSET = 160
const PILE_GAP = 32
export type PileKind = 'parts' | 'favorites'

export const PILE_ANCHORS: Record<PileKind, Anchor> = {
  parts: { left: `${PILE_INSET}px`, bottom: 155 },
  favorites: { left: `calc(100% - ${PILE_INSET}px)`, bottom: 155 },
}

const ARC_ANCHOR: Anchor = { left: '50%', bottom: 0 }
const ARC: Arc = { radius: 700, centerBelow: 440, step: 6.2 }
const REFERENCE_SLOTS = 9
const MAX_SLOTS = 12
const BELOW_SCREEN = 140

const RENDERED_MARGIN = 2

const HIDDEN_COUNT_BEYOND = 1.45
const HIDDEN_COUNT_HALF_WIDTH = 17

export const MOVE_DURATION = 550
const ENTER_STAGGER = 45
export const SHORT_MOVE_DURATION = 300

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function sizedArc(slots: number): Arc {
  if (slots <= REFERENCE_SLOTS) return ARC
  const step = (ARC.step * (REFERENCE_SLOTS - 1)) / (slots - 1)
  const radius = (ARC.radius * ARC.step) / step
  return { radius, centerBelow: ARC.centerBelow + radius - ARC.radius, step }
}

export function arcPlace(slot: number, slots: number): Place {
  const arc = sizedArc(slots)
  const rotate = (slot - (slots - 1) / 2) * arc.step
  const radians = (rotate * Math.PI) / 180
  return {
    x: arc.radius * Math.sin(radians),
    y: arc.centerBelow - arc.radius * Math.cos(radians),
    rotate,
  }
}

function hiddenCountPlace(side: 'before' | 'after', slots: number): Place {
  const slot = side === 'before' ? -HIDDEN_COUNT_BEYOND : slots - 1 + HIDDEN_COUNT_BEYOND
  return { ...arcPlace(slot, slots), rotate: 0 }
}

export function hiddenCountStyle(side: 'before' | 'after', slots: number) {
  return placeStyle(ARC_ANCHOR, hiddenCountPlace(side, slots))
}

function outerReach(slots: number, withCounts: boolean): number {
  const { x, rotate } = arcPlace(slots - 1, slots)
  const radians = (rotate * Math.PI) / 180
  const card = x + (CARD_WIDTH / 2) * Math.cos(radians) + CARD_HEIGHT * Math.sin(radians)
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

function nearestSlot(slot: number, slots: number): number {
  return clamp(Math.round(slot), 0, slots - 1)
}

export function isInWindow(
  index: number,
  { offset, slots }: HandState,
  margin = RENDERED_MARGIN,
): boolean {
  const first = Math.round(offset) - margin
  return index >= first && index < first + slots + 2 * margin
}

export function isRendered(index: number, state: HandState) {
  const { slots, unfolded, moving } = state
  const inPile = index < slots
  const inWindow = isInWindow(index, state, moving ? 0 : RENDERED_MARGIN)
  return unfolded ? inWindow || (moving && inPile) : inPile || (moving && inWindow)
}

function isShown(slot: number, slots: number): boolean {
  return Math.round(slot) === nearestSlot(slot, slots)
}

function openDelay(slot: number, slots: number, pileSide: 'left' | 'right'): number {
  const fromLeft = nearestSlot(slot, slots)
  return (pileSide === 'left' ? slots - 1 - fromLeft : fromLeft) * ENTER_STAGGER
}

function cardMoveDuration(shown: boolean, moving: boolean, scrolling: boolean): number {
  if (scrolling || (moving && !shown)) return 0
  return MOVE_DURATION
}

export function arcCardLayout(
  index: number,
  { offset, slots, unfolded, moving, scrolling }: HandState,
  pileSide?: 'left' | 'right',
): CardLayout {
  const slot = index - offset
  const shown = isShown(slot, slots)
  const place = {
    ...(shown ? arcStyle(slot, slots) : beyondArcStyle(slot, slots)),
    zIndex: index + 1,
  }
  if (!unfolded) {
    return {
      place,
      hidden: true,
      ignorePointer: true,
      moveDuration: SHORT_MOVE_DURATION,
      ease: 'out',
    }
  }
  return {
    place,
    hidden: !shown,
    ignorePointer: moving || !shown,
    moveDelay: moving && shown && pileSide ? openDelay(slot, slots, pileSide) : 0,
    moveDuration: cardMoveDuration(shown, moving, scrolling),
    ease: shown ? 'overshoot' : 'out',
    scrolling,
  }
}

export function pileMoveDuration(index: number, { offset, slots, moving }: HandState) {
  return cardMoveDuration(isShown(index - offset, slots), moving, false)
}

export function enterStyle(index: number, start: number, slots: number) {
  const { left, top } = belowArcStyle(index - start, slots)
  return {
    '--from-left': left,
    '--from-top': top,
    animationDelay: `${nearestSlot(index - start, slots) * ENTER_STAGGER}ms`,
  }
}

export function openDuration(duration: number, slots: number): number {
  return duration + (slots - 1) * ENTER_STAGGER
}

export function pilePlace(
  index: number,
  count: number,
  { mirror = false, spread = false, top = false, tilted = false }: PileOptions = {},
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

function arcStyle(slot: number, slots: number) {
  return placeStyle(ARC_ANCHOR, arcPlace(slot, slots))
}

function beyondArcStyle(slot: number, slots: number) {
  return arcStyle(clamp(slot, -1, slots), slots)
}

function belowArcStyle(slot: number, slots: number) {
  const { x, rotate } = arcPlace(nearestSlot(slot, slots), slots)
  return placeStyle(ARC_ANCHOR, { x, y: BELOW_SCREEN, rotate })
}
