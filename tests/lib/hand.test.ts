import {
  arcCardLayout,
  arcPlace,
  belowArcStyle,
  centeredOffset,
  clampOffset,
  HAND_ARC,
  hiddenCounts,
  isRendered,
  offsetShowing,
  openDelay,
  pileMoveDuration,
  pilePlace,
  VARIANTS_ARC,
  visibleSlots,
} from '@src/lib/hand.ts'
import { describe, expect, it } from 'vitest'

const rounded = ({ x, y, rotate }: { x: number; y: number; rotate: number }) => ({
  x: Math.round(x),
  y: Math.round(y),
  rotate: Math.round(rotate * 10) / 10,
})

describe('arcPlace', () => {
  it('puts the middle slot upright at the top of the arc', () => {
    expect(rounded(arcPlace(4, 9, HAND_ARC))).toEqual({ x: 0, y: -260, rotate: 0 })
  })

  it('spreads the slots symmetrically along the arc', () => {
    expect(rounded(arcPlace(0, 9, HAND_ARC))).toEqual({ x: -294, y: -195, rotate: -24.8 })
    expect(rounded(arcPlace(8, 9, HAND_ARC))).toEqual({ x: 294, y: -195, rotate: 24.8 })
  })

  it('places the variants on their own arc', () => {
    expect(rounded(arcPlace(0, 9, VARIANTS_ARC))).toEqual({ x: -300, y: -195, rotate: -28 })
  })

  it('widens the arc for more cards, keeping its top, spacing and opening', () => {
    const nine = arcPlace(8, 9, VARIANTS_ARC)
    const thirteen = arcPlace(12, 13, VARIANTS_ARC)
    expect(thirteen.rotate).toBeCloseTo(nine.rotate)
    expect(arcPlace(6, 13, VARIANTS_ARC).y).toBeCloseTo(arcPlace(4, 9, VARIANTS_ARC).y)
    expect(arcPlace(7, 13, VARIANTS_ARC).x).toBeCloseTo(arcPlace(5, 9, VARIANTS_ARC).x, 0)
    expect(thirteen.x).toBeGreaterThan(nine.x)
  })

  it('keeps the same step between cards, beyond the visible slots too', () => {
    expect(arcPlace(9, 9, VARIANTS_ARC).rotate).toBe(35)
    expect(arcPlace(-1, 9, VARIANTS_ARC).rotate).toBe(-35)
  })
})

describe('visibleSlots', () => {
  it('fits as many cards as the room between the piles allows', () => {
    expect(visibleSlots(24, 1280, VARIANTS_ARC)).toBe(8)
    expect(visibleSlots(24, 1280, HAND_ARC)).toBe(8)
    expect(visibleSlots(24, 1600, VARIANTS_ARC)).toBe(12)
    expect(visibleSlots(24, 1000, VARIANTS_ARC)).toBe(4)
    expect(visibleSlots(7, 1000, HAND_ARC)).toBe(4)
  })

  it('never shows more cards than the hand holds', () => {
    expect(visibleSlots(7, 1280, HAND_ARC)).toBe(7)
  })

  it('stops at twelve cards on wide screens', () => {
    expect(visibleSlots(24, 2560, VARIANTS_ARC)).toBe(12)
    expect(visibleSlots(24, 2560, HAND_ARC)).toBe(12)
  })

  it('keeps one card on very narrow screens', () => {
    expect(visibleSlots(24, 400, VARIANTS_ARC)).toBe(1)
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

  it('sends hidden variants below the screen, at the end of the arc they leave by', () => {
    const state = { offset: 0, slots: 9, unfolded: true, moving: false, scrolling: false }
    const first = arcCardLayout(0, VARIANTS_ARC, state).place
    const last = arcCardLayout(8, VARIANTS_ARC, state).place
    expect(belowArcStyle(-3, 9, VARIANTS_ARC)).toMatchObject({
      left: first.left,
      rotate: first.rotate,
      top: 'calc(100% - 0px + 140px)',
    })
    expect(belowArcStyle(12, 9, VARIANTS_ARC)).toMatchObject({
      left: last.left,
      rotate: last.rotate,
    })
  })

  it('counts the cards hidden on each side', () => {
    expect(hiddenCounts(0, 24, 9)).toEqual({ before: 0, after: 15 })
    expect(hiddenCounts(5.4, 24, 9)).toEqual({ before: 5, after: 10 })
    expect(hiddenCounts(15, 24, 9)).toEqual({ before: 15, after: 0 })
    expect(hiddenCounts(0, 7, 7)).toEqual({ before: 0, after: 0 })
  })

  it('lets only the visible cards react to the pointer', () => {
    const at = (offset: number) => ({
      offset,
      slots: 9,
      unfolded: true,
      moving: false,
      scrolling: false,
    })
    expect(arcCardLayout(0, VARIANTS_ARC, at(0.4)).ignorePointer).toBe(false)
    expect(arcCardLayout(0, VARIANTS_ARC, at(0.6)).ignorePointer).toBe(true)
    expect(arcCardLayout(8, VARIANTS_ARC, at(-0.4)).ignorePointer).toBe(false)
    expect(arcCardLayout(8, VARIANTS_ARC, at(-0.6)).ignorePointer).toBe(true)
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

describe('openDelay', () => {
  it('opens the farthest card from the pile first', () => {
    expect(openDelay(6, 7, 'left')).toBe(0)
    expect(openDelay(0, 7, 'left')).toBe(270)
    expect(openDelay(0, 7, 'right')).toBe(0)
    expect(openDelay(6, 7, 'right')).toBe(270)
  })

  it('can open the nearest card first instead', () => {
    expect(openDelay(0, 7, 'left', 'nearest-first')).toBe(0)
    expect(openDelay(0, 7, 'right', 'nearest-first')).toBe(270)
  })
})

describe('isRendered', () => {
  const pile = { offset: 10, slots: 8, unfolded: false, moving: false, scrolling: false }
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

describe('card move durations', () => {
  const state = { offset: 0, slots: 8, unfolded: true, moving: true, scrolling: false }

  it('moves the hidden cards instantly while the hand opens or folds', () => {
    expect(arcCardLayout(9, HAND_ARC, state).moveDuration).toBe(0)
    expect(arcCardLayout(3, HAND_ARC, state).moveDuration).toBe(550)
    expect(pileMoveDuration(9, { ...state, unfolded: false })).toBe(0)
    expect(pileMoveDuration(3, { ...state, unfolded: false })).toBe(550)
  })

  it('moves faster while scrolling', () => {
    expect(
      arcCardLayout(9, HAND_ARC, { ...state, moving: false, scrolling: true }).moveDuration,
    ).toBe(300)
  })

  it('staggers the opening from the pile side only for visible cards', () => {
    expect(arcCardLayout(0, HAND_ARC, state, 'right').moveDelay).toBe(0)
    expect(arcCardLayout(7, HAND_ARC, state, 'right').moveDelay).toBe(315)
    expect(arcCardLayout(9, HAND_ARC, state, 'right').moveDelay).toBe(0)
    expect(arcCardLayout(7, HAND_ARC, state).moveDelay).toBe(0)
  })
})
