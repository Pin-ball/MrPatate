import type { PartId } from '@src/lib/catalog/types.ts'
import { clamp } from '@src/lib/utils.ts'

export type Place = { x: number; y: number; rotate: number }

export type Arc = { radius: number; step: number }

export type Anchor = { left: string; bottom: number }

export type PlaceStyle = { left: string; top: string; rotate: string }

export type CardSize = { width: number; height: number; picture: number }

export type PileKind = 'parts' | 'favorites'

export type Hand = { kind: 'none' } | { kind: PileKind } | { kind: 'variants'; part: PartId }

export type PileSide = 'left' | 'right'

export type HandEnd = 'before' | 'after'

export type HandShape = {
  slots: number
  overscroll: number
  dragPerCard: number
  place: (slot: number) => Place
  offsetShowing: (index: number, offset: number) => number
}

type ScrollCueStyles = {
  hiddenCountStyle: (end: HandEnd, slots: number) => PlaceStyle
  scrollHintStyle: () => PlaceStyle
}

export type HandGeometry = {
  card: CardSize
  piles: Record<PileKind, Anchor>
  labelBelowPile: number
  lowerPiles: boolean
  scrollCues: ScrollCueStyles | null
  dragAreaAbove: number | null
  handShape: (width: number, count: number) => HandShape
  handTop: (width: number) => number
}

export const PILE_SIDES: Record<PileKind, PileSide> = { parts: 'left', favorites: 'right' }

const CENTER: Place = { x: 0, y: 0, rotate: 0 }
const HAND_ANCHOR: Anchor = { left: '50%', bottom: 0 }
const BELOW_SCREEN = 140

export function radians(angle: number) {
  return (angle * Math.PI) / 180
}

export function degrees(angle: number) {
  return (angle * 180) / Math.PI
}

export function slotAngle({ step }: Arc, slot: number, slots: number) {
  return (slot - (slots - 1) / 2) * step
}

export function arcPoint(
  { radius }: Arc,
  rotate: number,
  baseAngle: number,
  bottom: number,
): Place {
  return {
    x: radius * Math.sin(radians(rotate)),
    y: radius * (Math.cos(radians(baseAngle)) - Math.cos(radians(rotate))) - bottom,
    rotate,
  }
}

export function middleCardTop(shape: HandShape, card: CardSize): number {
  return card.height / 2 - shape.place((shape.slots - 1) / 2).y
}

export function placeStyle({ left, bottom }: Anchor, { x, y, rotate }: Place = CENTER): PlaceStyle {
  return {
    left: `calc(${left} + ${x}px)`,
    top: `calc(100% - var(--safe-bottom) - ${bottom}px + ${y}px)`,
    rotate: `${rotate}deg`,
  }
}

export function handStyle(place: Place) {
  return placeStyle(HAND_ANCHOR, place)
}

export function arcStyle(shape: HandShape, slot: number) {
  return handStyle(shape.place(clamp(slot, -1, shape.slots)))
}

export function belowArcStyle(shape: HandShape, slot: number) {
  const { x, rotate } = shape.place(clamp(Math.round(slot), 0, shape.slots - 1))
  return handStyle({ x, y: BELOW_SCREEN, rotate })
}

export function loweredAnchor({ left }: Anchor): Anchor {
  return { left, bottom: -BELOW_SCREEN }
}

export function dragAreaStyle(handTop: number, above: number) {
  return {
    top: `calc(100% - var(--safe-bottom) - ${handTop + above}px)`,
    bottom: 'var(--safe-bottom)',
  }
}

export function labelStyle(anchor: Anchor, below: number) {
  return placeStyle(anchor, { x: 0, y: below, rotate: 0 })
}

type PilePlaceOptions = { mirror?: boolean; spread?: boolean; onTop?: boolean; tilted?: boolean }

export function pilePlace(
  index: number,
  count: number,
  { mirror = false, spread = false, onTop = false, tilted = false }: PilePlaceOptions = {},
): Place {
  const direction = mirror ? -1 : 1
  const gap = spread ? 9 : 3
  return {
    x: direction * ((index % 3) - 1) * gap,
    y: (spread && onTop ? -14 : 0) - index * 2,
    rotate:
      direction * (tilted ? (spread ? -6 : -3) : (index - (count - 1) / 2) * (spread ? 4.5 : 2.5)),
  }
}
