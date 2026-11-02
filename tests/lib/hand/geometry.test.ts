import {
  arcPlace,
  centeredOffset,
  clampOffset,
  hiddenCounts,
  isRendered,
  offsetShowing,
  pilePlace,
  visibleSlots,
} from '@src/lib/hand/geometry.ts'
import { describe, expect, it } from 'vitest'

const rounded = ({ x, y, rotate }: { x: number; y: number; rotate: number }) => ({
  x: Math.round(x),
  y: Math.round(y),
  rotate: Math.round(rotate * 10) / 10,
})

describe('arcPlace', () => {
  it('puts the middle slot upright at the top, the others symmetrically along the arc', () => {
    expect(rounded(arcPlace(4, 9))).toEqual({ x: 0, y: -260, rotate: 0 })
    expect(rounded(arcPlace(0, 9))).toEqual({ x: -294, y: -195, rotate: -24.8 })
    expect(rounded(arcPlace(8, 9))).toEqual({ x: 294, y: -195, rotate: 24.8 })
  })

  it('widens the arc for more cards, keeping its top, spacing and opening', () => {
    const nine = arcPlace(8, 9)
    const thirteen = arcPlace(12, 13)
    expect(thirteen.rotate).toBeCloseTo(nine.rotate)
    expect(arcPlace(6, 13).y).toBeCloseTo(arcPlace(4, 9).y)
    expect(arcPlace(7, 13).x).toBeCloseTo(arcPlace(5, 9).x, 0)
    expect(thirteen.x).toBeGreaterThan(nine.x)
  })

  it('keeps the same step between cards, beyond the visible slots too', () => {
    expect(arcPlace(9, 9).rotate).toBeCloseTo(31)
    expect(arcPlace(-1, 9).rotate).toBeCloseTo(-31)
  })
})

describe('visibleSlots', () => {
  it('fits the room between the piles, from one to twelve cards, never more than the hand', () => {
    expect(visibleSlots(24, 1280)).toBe(8)
    expect(visibleSlots(24, 1000)).toBe(4)
    expect(visibleSlots(24, 2560)).toBe(12)
    expect(visibleSlots(24, 400)).toBe(1)
    expect(visibleSlots(7, 1280)).toBe(7)
  })
})

describe('hand scrolling', () => {
  it('scrolls only as far as the last card', () => {
    expect(clampOffset(-2, 24, 9)).toBe(0)
    expect(clampOffset(20, 24, 9)).toBe(15)
    expect(clampOffset(3, 7, 7)).toBe(0)
  })

  it('centers a card when the hand opens', () => {
    expect(centeredOffset(12, 24, 9)).toBe(8)
    expect(centeredOffset(1, 24, 9)).toBe(0)
    expect(centeredOffset(23, 24, 9)).toBe(15)
  })

  it('scrolls just enough to show a card', () => {
    expect(offsetShowing(10, 0, 9)).toBe(2)
    expect(offsetShowing(1, 5, 9)).toBe(1)
    expect(offsetShowing(6, 5, 9)).toBe(5)
  })

  it('counts the cards hidden on each side', () => {
    expect(hiddenCounts(0, 24, 9)).toEqual({ before: 0, after: 15 })
    expect(hiddenCounts(5.4, 24, 9)).toEqual({ before: 5, after: 10 })
    expect(hiddenCounts(15, 24, 9)).toEqual({ before: 15, after: 0 })
    expect(hiddenCounts(0, 7, 7)).toEqual({ before: 0, after: 0 })
  })
})

describe('pilePlace', () => {
  it('stacks the cards slightly shifted and rotated', () => {
    expect(pilePlace(0, 7)).toEqual({ x: -3, y: 0, rotate: -7.5 })
    expect(pilePlace(6, 7)).toEqual({ x: -3, y: -12, rotate: 7.5 })
  })

  it('mirrors the pile on the other side', () => {
    expect(pilePlace(0, 7, { mirror: true })).toEqual({ x: 3, y: 0, rotate: 7.5 })
  })

  it('spreads the pile and lifts its top card', () => {
    expect(pilePlace(6, 7, { spread: true, top: true })).toEqual({ x: -9, y: -26, rotate: 13.5 })
  })

  it('tilts a card at a fixed angle', () => {
    expect(pilePlace(1, 7, { tilted: true })).toEqual({ x: 0, y: -2, rotate: -3 })
    expect(pilePlace(1, 7, { spread: true, tilted: true })).toEqual({ x: 0, y: -2, rotate: -6 })
  })
})

describe('isRendered', () => {
  const pile = {
    offset: 10,
    slots: 8,
    unfolded: false,
    moving: false,
    scrolling: false,
    scrolled: false,
  }
  const hand = { ...pile, unfolded: true }

  it('renders only the first cards of a folded pile', () => {
    expect(isRendered(7, pile)).toBe(true)
    expect(isRendered(8, pile)).toBe(false)
  })

  it('renders the visible cards of an open hand, with a margin', () => {
    expect(isRendered(8, hand)).toBe(true)
    expect(isRendered(19, hand)).toBe(true)
    expect(isRendered(7, hand)).toBe(false)
    expect(isRendered(20, hand)).toBe(false)
  })

  it('keeps both while the cards move between the pile and the hand, without the margin', () => {
    expect(isRendered(0, { ...hand, moving: true })).toBe(true)
    expect(isRendered(15, { ...pile, moving: true })).toBe(true)
    expect(isRendered(9, { ...pile, moving: true })).toBe(false)
    expect(isRendered(18, { ...pile, moving: true })).toBe(false)
  })
})
