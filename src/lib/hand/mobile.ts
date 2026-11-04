import type { Arc, CardSize, HandGeometry, HandShape, Place } from './geometry.ts'
import { arcPoint, degrees, middleCardTop, slotAngle } from './geometry.ts'

const CARD: CardSize = { width: 96, height: 128, picture: 62 }
const PILE_BOTTOM = 108
const LABEL_BELOW_PILE = 75
const HAND_BOTTOM = 178
const ARC_RADIUS = 620
const MIN_STEP = 76
const MAX_STEP = 84
const SCREEN_MARGIN = 8
const CUT_CARDS_PER_SIDE = 1
const DRAG_AREA_ABOVE = 16

function mobileRoom(width: number): number {
  const room = width / 2 - SCREEN_MARGIN - CARD.width / 2
  return room / (1 + CARD.height / ARC_RADIUS)
}

function wholeCardsPerSide(width: number): number {
  return Math.max(0, Math.floor(mobileRoom(width) / MIN_STEP))
}

function mobileSlots(width: number): number {
  return 2 * (wholeCardsPerSide(width) + CUT_CARDS_PER_SIDE) + 1
}

function mobileStep(width: number): number {
  const cardsPerSide = wholeCardsPerSide(width)
  return cardsPerSide ? Math.min(MAX_STEP, mobileRoom(width) / cardsPerSide) : MAX_STEP
}

function mobileArc(width: number): Arc {
  return { radius: ARC_RADIUS, step: degrees(Math.asin(mobileStep(width) / ARC_RADIUS)) }
}

function mobilePlace(slot: number, slots: number, arc: Arc): Place {
  return arcPoint(arc, slotAngle(arc, slot, slots), 0, HAND_BOTTOM)
}

function mobileHandShape(width: number): HandShape {
  const slots = mobileSlots(width)
  const cardsPerSide = (slots - 1) / 2
  const arc = mobileArc(width)
  return {
    slots,
    overscroll: cardsPerSide,
    dragPerCard: mobileStep(width),
    place: (slot) => mobilePlace(slot, slots, arc),
    offsetShowing: (index) => index - cardsPerSide,
  }
}

function mobileHandTop(width: number): number {
  return middleCardTop(mobileHandShape(width), CARD)
}

export const MOBILE_GEOMETRY: HandGeometry = {
  card: CARD,
  piles: {
    parts: { left: '25%', bottom: PILE_BOTTOM },
    favorites: { left: '75%', bottom: PILE_BOTTOM },
  },
  labelBelowPile: LABEL_BELOW_PILE,
  lowerPiles: true,
  scrollCues: null,
  dragAreaAbove: DRAG_AREA_ABOVE,
  handShape: mobileHandShape,
  handTop: mobileHandTop,
}
