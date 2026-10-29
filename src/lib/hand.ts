type Place = { x: number; y: number; rotate: number }

export type Arc = { radius: number; centerBelow: number; step: number }

export type Anchor = { left: string; bottom: number }

type PileOptions = { mirror?: boolean; spread?: boolean; top?: boolean; tilted?: boolean }

type OpenOrder = 'nearest-first' | 'farthest-first'

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

export const ARC_ANCHOR: Anchor = { left: '50%', bottom: 0 }
export const HAND_ARC: Arc = { radius: 700, centerBelow: 440, step: 6.2 }
export const VARIANTS_ARC: Arc = { radius: 640, centerBelow: 370, step: 7 }
const REFERENCE_SLOTS = 9
const MAX_SLOTS = 12
const BELOW_SCREEN = 140

const RENDERED_MARGIN = 2

const HIDDEN_COUNT_BEYOND = 1.45
const HIDDEN_COUNT_HALF_WIDTH = 17

export const MOVE_DURATION = 550
export const ENTER_DURATION = 500
export const ENTER_STAGGER = 45
export const SCROLL_DURATION = 300
const OPEN_ORDER: OpenOrder = 'farthest-first'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function sizedArc(arc: Arc, slots: number): Arc {
  if (slots <= REFERENCE_SLOTS) return arc
  const step = (arc.step * (REFERENCE_SLOTS - 1)) / (slots - 1)
  const radius = (arc.radius * arc.step) / step
  return { radius, centerBelow: arc.centerBelow + radius - arc.radius, step }
}

export function arcPlace(slot: number, slots: number, baseArc: Arc): Place {
  const arc = sizedArc(baseArc, slots)
  const rotate = (slot - (slots - 1) / 2) * arc.step
  const radians = (rotate * Math.PI) / 180
  return {
    x: arc.radius * Math.sin(radians),
    y: arc.centerBelow - arc.radius * Math.cos(radians),
    rotate,
  }
}

export function hiddenCountPlace(side: 'before' | 'after', slots: number, arc: Arc): Place {
  const slot = side === 'before' ? -HIDDEN_COUNT_BEYOND : slots - 1 + HIDDEN_COUNT_BEYOND
  return { ...arcPlace(slot, slots, arc), rotate: 0 }
}

function outerReach(slots: number, arc: Arc, withCounts: boolean): number {
  const { x, rotate } = arcPlace(slots - 1, slots, arc)
  const radians = (rotate * Math.PI) / 180
  const card = x + (CARD_WIDTH / 2) * Math.cos(radians) + CARD_HEIGHT * Math.sin(radians)
  if (!withCounts) return card
  return Math.max(card, hiddenCountPlace('after', slots, arc).x + HIDDEN_COUNT_HALF_WIDTH)
}

export function visibleSlots(count: number, width: number, arc: Arc): number {
  const room = width / 2 - PILE_INSET - CARD_WIDTH / 2 - PILE_GAP
  let slots = Math.min(count, MAX_SLOTS)
  while (slots > 1 && outerReach(slots, arc, slots < count) > room) slots--
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

export function isRendered(index: number, { offset, slots, unfolded, moving }: HandState) {
  const margin = moving ? 0 : RENDERED_MARGIN
  const inPile = index < slots
  const inWindow =
    index >= Math.round(offset) - margin && index < Math.round(offset) + slots + margin
  return unfolded ? inWindow || (moving && inPile) : inPile || (moving && inWindow)
}

function isShown(slot: number, slots: number): boolean {
  return Math.round(slot) === nearestSlot(slot, slots)
}

export function openDelay(
  slot: number,
  slots: number,
  pileSide: 'left' | 'right',
  order: OpenOrder = OPEN_ORDER,
): number {
  const fromLeft = nearestSlot(slot, slots)
  const distance = pileSide === 'left' ? fromLeft : slots - 1 - fromLeft
  const rank = order === 'nearest-first' ? distance : slots - 1 - distance
  return rank * ENTER_STAGGER
}

function cardMoveDuration(shown: boolean, moving: boolean, scrolling: boolean): number {
  if (moving && !shown) return 0
  return scrolling ? SCROLL_DURATION : MOVE_DURATION
}

export function arcCardLayout(
  index: number,
  arc: Arc,
  { offset, slots, moving, scrolling }: HandState,
  pileSide?: 'left' | 'right',
) {
  const slot = index - offset
  const shown = isShown(slot, slots)
  return {
    place: {
      ...(shown ? arcStyle(slot, slots, arc) : belowArcStyle(slot, slots, arc)),
      zIndex: index + 1,
    },
    ignorePointer: moving || !shown,
    moveDelay: moving && shown && pileSide ? openDelay(slot, slots, pileSide) : 0,
    moveDuration: cardMoveDuration(shown, moving, scrolling),
  }
}

export function pileMoveDuration(index: number, { offset, slots, moving }: HandState) {
  return cardMoveDuration(isShown(index - offset, slots), moving, false)
}

export function enterStyle(index: number, start: number, slots: number, arc: Arc) {
  const { left, top } = belowArcStyle(index - start, slots, arc)
  return {
    '--from-left': left,
    '--from-top': top,
    animationDuration: `${ENTER_DURATION}ms`,
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

function arcStyle(slot: number, slots: number, arc: Arc) {
  return placeStyle(ARC_ANCHOR, arcPlace(slot, slots, arc))
}

export function belowArcStyle(slot: number, slots: number, arc: Arc) {
  const { x, rotate } = arcPlace(nearestSlot(slot, slots), slots, arc)
  return placeStyle(ARC_ANCHOR, { x, y: BELOW_SCREEN, rotate })
}
