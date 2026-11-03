import { clamp } from '@src/lib/utils.ts'
import type { Arc, HandEnd, HandGeometry, HandShape, Place } from './geometry.ts'
import {
  arcPoint,
  cardSize,
  handStyle,
  labelStyle,
  middleCardTop,
  radians,
  slotAngle,
} from './geometry.ts'

const ZOOM = 1
const PILE_INSET = 160
const PILE_BOTTOM = 155
const PILE_HAND_GAP = 48
const LABEL_BELOW_PILE = 90
const ARC: Arc = { radius: 700, step: 6.2 }
const BASE_SLOTS = 9
const MAX_SLOTS = 12
const DRAG_PER_CARD = 80

const HIDDEN_COUNT_RISE = 30
const HIDDEN_COUNT_GAP = 12
const HIDDEN_COUNT_HALF_WIDTH = 17
const HIDDEN_COUNT_HALF_HEIGHT = 13

const CARD = cardSize(ZOOM)

function desktopRoom(width: number): number {
  return width / 2 - PILE_INSET - CARD.width / 2 - PILE_HAND_GAP
}

function outerCorner(slots: number) {
  const { x, y, rotate } = desktopPlace(slots - 1, slots, desktopArc(slots))
  const angle = radians(rotate)
  return {
    x: x + (CARD.width / 2) * Math.cos(angle),
    y: y + CARD.height / 2 + (CARD.width / 2) * Math.sin(angle),
    angle,
  }
}

function hiddenCountPlace(end: HandEnd, slots: number): Place {
  const corner = outerCorner(slots)
  const edge = corner.x + (HIDDEN_COUNT_RISE + HIDDEN_COUNT_HALF_HEIGHT) * Math.tan(corner.angle)
  const countX = edge + HIDDEN_COUNT_GAP + HIDDEN_COUNT_HALF_WIDTH
  return { x: end === 'after' ? countX : -countX, y: corner.y - HIDDEN_COUNT_RISE, rotate: 0 }
}

function outerReach(slots: number, withCounts: boolean): number {
  const corner = outerCorner(slots)
  const card = corner.x + CARD.height * Math.sin(corner.angle)
  if (!withCounts) return card
  return Math.max(card, hiddenCountPlace('after', slots).x + HIDDEN_COUNT_HALF_WIDTH)
}

function desktopSlots(width: number, count: number): number {
  const room = desktopRoom(width)
  let slots = Math.min(count, MAX_SLOTS)
  while (slots > 1 && outerReach(slots, slots < count) > room) slots--
  return slots
}

function desktopArc(slots: number): Arc {
  if (slots <= BASE_SLOTS) return ARC
  const step = (ARC.step * (BASE_SLOTS - 1)) / (slots - 1)
  const radius = (ARC.radius * ARC.step) / step
  return { radius, step }
}

function desktopPlace(slot: number, slots: number, arc: Arc): Place {
  return arcPoint(arc, slotAngle(arc, slot, slots), slotAngle(arc, slots - 1, slots), PILE_BOTTOM)
}

function desktopHandShape(width: number, count: number): HandShape {
  const slots = desktopSlots(width, count)
  const arc = desktopArc(slots)
  return {
    slots,
    overscroll: 0,
    dragPerCard: DRAG_PER_CARD,
    place: (slot) => desktopPlace(slot, slots, arc),
    offsetShowing: (index, offset) => clamp(offset, index - slots + 1, index),
  }
}

function desktopHandTop(width: number): number {
  return middleCardTop(desktopHandShape(width, MAX_SLOTS), ZOOM)
}

function hiddenCountStyle(end: HandEnd, slots: number) {
  return handStyle(hiddenCountPlace(end, slots))
}

function scrollHintStyle() {
  return labelStyle({ left: '50%', bottom: PILE_BOTTOM }, LABEL_BELOW_PILE)
}

export const DESKTOP_GEOMETRY: HandGeometry = {
  cardZoom: ZOOM,
  piles: {
    parts: { left: `${PILE_INSET}px`, bottom: PILE_BOTTOM },
    favorites: { left: `calc(100% - ${PILE_INSET}px)`, bottom: PILE_BOTTOM },
  },
  labelBelowPile: LABEL_BELOW_PILE,
  lowerPiles: false,
  scrollCues: { hiddenCountStyle, scrollHintStyle },
  dragAreaAbove: null,
  handShape: desktopHandShape,
  handTop: desktopHandTop,
}
