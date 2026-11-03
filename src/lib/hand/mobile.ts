import type { Arc, HandGeometry, HandShape, Place } from './geometry.ts'
import { arcPoint, cardSize, degrees, middleCardTop, slotAngle } from './geometry.ts'

const ZOOM = 0.75
const PILE_BOTTOM = 95
const LABEL_BELOW_PILE = 62
const HAND_BOTTOM = 250
const ARC_RADIUS = 620
const MIN_STEP = 52
const MAX_STEP = 64
const SCREEN_MARGIN = 8
const PILES_GAP = 40

const CARD = cardSize(ZOOM)
const PILE_OFFSET = CARD.width / 2 + PILES_GAP / 2

function mobileRoom(width: number): number {
  const room = width / 2 - SCREEN_MARGIN - CARD.width / 2
  return room / (1 + CARD.height / ARC_RADIUS)
}

function mobileSlots(width: number): number {
  return 2 * Math.max(0, Math.floor(mobileRoom(width) / MIN_STEP)) + 1
}

function mobileStep(width: number, slots: number): number {
  const cardsPerSide = (slots - 1) / 2
  return cardsPerSide ? Math.min(MAX_STEP, mobileRoom(width) / cardsPerSide) : MAX_STEP
}

function mobileArc(width: number, slots: number): Arc {
  const step = mobileStep(width, slots)
  return { radius: ARC_RADIUS, step: degrees(Math.asin(step / ARC_RADIUS)) }
}

function mobilePlace(slot: number, slots: number, arc: Arc): Place {
  return arcPoint(arc, slotAngle(arc, slot, slots), 0, HAND_BOTTOM)
}

function mobileHandShape(width: number): HandShape {
  const slots = mobileSlots(width)
  const cardsPerSide = (slots - 1) / 2
  const arc = mobileArc(width, slots)
  return {
    slots,
    partialCards: 1,
    overscroll: cardsPerSide,
    dragPerCard: mobileStep(width, slots),
    place: (slot) => mobilePlace(slot, slots, arc),
    stackOrder: (slot) => Math.max(0, slots - Math.round(Math.abs(slot - cardsPerSide))),
    offsetShowing: (index) => index - cardsPerSide,
  }
}

function mobileHandTop(width: number): number {
  return middleCardTop(mobileHandShape(width), ZOOM)
}

export const MOBILE_GEOMETRY: HandGeometry = {
  cardZoom: ZOOM,
  piles: {
    parts: { left: `calc(50% - ${PILE_OFFSET}px)`, bottom: PILE_BOTTOM },
    favorites: { left: `calc(50% + ${PILE_OFFSET}px)`, bottom: PILE_BOTTOM },
  },
  labelBelowPile: LABEL_BELOW_PILE,
  scrollCues: null,
  handShape: mobileHandShape,
  handTop: mobileHandTop,
}
