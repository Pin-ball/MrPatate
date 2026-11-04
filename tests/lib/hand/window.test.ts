import { DESKTOP_GEOMETRY } from '@src/lib/hand/desktop.ts'
import { MOBILE_GEOMETRY } from '@src/lib/hand/mobile.ts'
import {
  centeredOffset,
  clampOffset,
  handPosition,
  heldCards,
  hiddenCounts,
  isRendered,
  isShown,
  offsetBounds,
  visibleCards,
} from '@src/lib/hand/window.ts'
import { describe, expect, it } from 'vitest'

const NINE = DESKTOP_GEOMETRY.handShape(1520, 24)
const MOBILE = MOBILE_GEOMETRY.handShape(500, 24)

const pile = {
  count: 24,
  offset: 10,
  shape: DESKTOP_GEOMETRY.handShape(1440, 24),
  unfolded: false,
  moving: false,
  scrolling: false,
  scrolled: false,
}

describe('hand scrolling', () => {
  it('can center the first and the last card', () => {
    const bounds = offsetBounds(24, MOBILE)
    expect(bounds).toEqual({ min: -3, max: 20 })
    expect(centeredOffset(0, 24, MOBILE)).toBe(-3)
    expect(centeredOffset(23, 24, MOBILE)).toBe(20)
    expect(clampOffset(-5, bounds)).toBe(-3)
    expect(offsetBounds(24, NINE)).toEqual({ min: 0, max: 15 })
  })

  it('scrolls only as far as the last card', () => {
    expect(clampOffset(-2, offsetBounds(24, NINE))).toBe(0)
    expect(clampOffset(20, offsetBounds(24, NINE))).toBe(15)
    const seven = DESKTOP_GEOMETRY.handShape(1440, 7)
    expect(clampOffset(3, offsetBounds(7, seven))).toBe(0)
  })

  it('centers a card when the hand opens', () => {
    expect(centeredOffset(12, 24, NINE)).toBe(8)
    expect(centeredOffset(1, 24, NINE)).toBe(0)
    expect(centeredOffset(23, 24, NINE)).toBe(15)
  })
})

describe('visibleCards', () => {
  it('spans the slots, keeping only the existing cards', () => {
    expect(visibleCards(4, 24, NINE)).toEqual({ first: 4, last: 12 })
    expect(visibleCards(3.4, 24, MOBILE)).toEqual({ first: 3, last: 9 })
    expect(visibleCards(-3, 24, MOBILE)).toEqual({ first: 0, last: 3 })
    expect(visibleCards(20, 24, MOBILE)).toEqual({ first: 20, last: 23 })
  })
})

describe('isShown', () => {
  it('shows the cards of the slots, hiding the others', () => {
    expect(isShown(-1, NINE)).toBe(false)
    expect(isShown(8.4, NINE)).toBe(true)
    expect(isShown(8.6, NINE)).toBe(false)
  })

  it('counts the cards cut by the screen edge as slots of a mobile hand', () => {
    expect([-1, 0, 6, 7].map((slot) => isShown(slot, MOBILE))).toEqual([false, true, true, false])
  })
})

describe('heldCards', () => {
  it('keeps only the existing cards when the hand opens past an end', () => {
    const mobile = { ...pile, shape: MOBILE }
    expect(heldCards(mobile, -3)).toEqual({ first: 0, last: 3 })
    expect(heldCards({ ...mobile, count: 6 }, 1)).toEqual({ first: 1, last: 5 })
  })
})

describe('isRendered', () => {
  const open = { ...pile, unfolded: true }

  it('renders in a folded pile the cards the hand will open on', () => {
    const opening = heldCards(pile, 4)
    expect(opening).toEqual({ first: 4, last: 11 })
    expect(isRendered(4, pile, opening)).toBe(true)
    expect(isRendered(11, pile, opening)).toBe(true)
    expect(isRendered(3, pile, opening)).toBe(false)
    expect(isRendered(12, pile, opening)).toBe(false)
  })

  it('renders the visible cards of an open hand, with a margin', () => {
    const held = heldCards(open, 0)
    expect(isRendered(8, open, held)).toBe(true)
    expect(isRendered(19, open, held)).toBe(true)
    expect(isRendered(7, open, held)).toBe(false)
    expect(isRendered(20, open, held)).toBe(false)
  })

  it('folds the visible cards of the hand into the pile, without the margin', () => {
    const folding = { ...pile, moving: true }
    const folded = heldCards(folding, 4)
    expect(folded).toEqual({ first: 10, last: 17 })
    expect(isRendered(10, folding, folded)).toBe(true)
    expect(isRendered(17, folding, folded)).toBe(true)
    expect(isRendered(9, folding, folded)).toBe(false)
    expect(isRendered(18, folding, folded)).toBe(false)
    expect(isRendered(9, { ...open, moving: true }, folded)).toBe(false)
  })

  it('holds the cards cut by the screen edge in the pile, so they open and fold with the others', () => {
    const mobile = { ...pile, offset: 9, shape: MOBILE }
    expect(heldCards(mobile, 3)).toEqual({ first: 3, last: 9 })
    const opening = { ...mobile, unfolded: true, moving: true }
    expect(isRendered(9, opening, heldCards(opening, 9))).toBe(true)
    expect(isRendered(8, opening, heldCards(opening, 9))).toBe(false)
  })
})

describe('hiddenCounts', () => {
  it('counts the cards hidden on each side', () => {
    expect(hiddenCounts(0, 24, NINE)).toEqual({ before: 0, after: 15 })
    expect(hiddenCounts(5.4, 24, NINE)).toEqual({ before: 5, after: 10 })
    expect(hiddenCounts(15, 24, NINE)).toEqual({ before: 15, after: 0 })
    const seven = DESKTOP_GEOMETRY.handShape(1440, 7)
    expect(hiddenCounts(0, 7, seven)).toEqual({ before: 0, after: 0 })
  })
})

describe('handPosition', () => {
  it('gives the position of the middle card among the cards that follow the first index', () => {
    expect(handPosition(-0.6, 24, MOBILE, 0)).toEqual({ position: 3, total: 24 })
    expect(handPosition(2, 24, MOBILE, 1)).toEqual({ position: 5, total: 23 })
  })

  it('gives position 0 when a card before the first index is in the middle', () => {
    expect(handPosition(-3, 24, MOBILE, 1)).toEqual({ position: 0, total: 23 })
  })

  it('stays on the last card when the hand is dragged past its end', () => {
    expect(handPosition(30, 24, MOBILE, 0)).toEqual({ position: 24, total: 24 })
  })
})
