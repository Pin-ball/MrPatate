import { DESKTOP_GEOMETRY } from '@src/lib/hand/desktop.ts'
import { MOBILE_GEOMETRY } from '@src/lib/hand/mobile.ts'
import {
  cardVisibility,
  centeredOffset,
  clampOffset,
  heldCards,
  hiddenCounts,
  isRendered,
  offsetBounds,
  visibleCards,
} from '@src/lib/hand/window.ts'
import { describe, expect, it } from 'vitest'

const NINE = DESKTOP_GEOMETRY.handShape(1360, 24)
const MOBILE = MOBILE_GEOMETRY.handShape(390, 24)

const pile = {
  count: 24,
  offset: 10,
  shape: DESKTOP_GEOMETRY.handShape(1280, 24),
  unfolded: false,
  moving: false,
  scrolling: false,
  scrolled: false,
}

describe('hand scrolling', () => {
  it('can center the first and the last card', () => {
    const bounds = offsetBounds(24, MOBILE)
    expect(bounds).toEqual({ min: -2, max: 21 })
    expect(centeredOffset(0, 24, MOBILE)).toBe(-2)
    expect(centeredOffset(23, 24, MOBILE)).toBe(21)
    expect(clampOffset(-5, bounds)).toBe(-2)
    expect(offsetBounds(24, NINE)).toEqual({ min: 0, max: 15 })
  })

  it('scrolls only as far as the last card', () => {
    expect(clampOffset(-2, offsetBounds(24, NINE))).toBe(0)
    expect(clampOffset(20, offsetBounds(24, NINE))).toBe(15)
    const seven = DESKTOP_GEOMETRY.handShape(1280, 7)
    expect(clampOffset(3, offsetBounds(7, seven))).toBe(0)
  })

  it('centers a card when the hand opens', () => {
    expect(centeredOffset(12, 24, NINE)).toBe(8)
    expect(centeredOffset(1, 24, NINE)).toBe(0)
    expect(centeredOffset(23, 24, NINE)).toBe(15)
  })
})

describe('visibleCards', () => {
  it('spans the slots, and the peeking cards, keeping only the existing cards', () => {
    expect(visibleCards(4, 24, NINE)).toEqual({ first: 4, last: 12 })
    expect(visibleCards(4.4, 24, MOBILE)).toEqual({ first: 3, last: 9 })
    expect(visibleCards(-2, 24, MOBILE)).toEqual({ first: 0, last: 3 })
    expect(visibleCards(21, 24, MOBILE)).toEqual({ first: 20, last: 23 })
  })
})

describe('cardVisibility', () => {
  it('shows the cards of the slots, desktop hiding the others', () => {
    expect(cardVisibility(-1, NINE)).toBe('hidden')
    expect(cardVisibility(8.4, NINE)).toBe('shown')
    expect(cardVisibility(8.6, NINE)).toBe('hidden')
  })

  it('lets the next card peek past each end of a mobile hand', () => {
    expect([-2, -1, 0, 4, 5, 6].map((slot) => cardVisibility(slot, MOBILE))).toEqual([
      'hidden',
      'partial',
      'shown',
      'shown',
      'partial',
      'hidden',
    ])
  })
})

describe('heldCards', () => {
  it('keeps only the existing cards when the hand opens past an end', () => {
    const mobile = { ...pile, shape: MOBILE }
    expect(heldCards(mobile, -2)).toEqual({ first: 0, last: 3 })
    expect(heldCards({ ...mobile, count: 6 }, 2)).toEqual({ first: 1, last: 5 })
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

  it('holds the peeking cards in the pile, so they open and fold with the others', () => {
    const mobile = { ...pile, shape: MOBILE }
    expect(heldCards(mobile, 4)).toEqual({ first: 3, last: 9 })
    const opening = { ...mobile, unfolded: true, moving: true }
    expect(isRendered(9, opening, heldCards(opening, 10))).toBe(true)
    expect(isRendered(8, opening, heldCards(opening, 10))).toBe(false)
  })
})

describe('hiddenCounts', () => {
  it('counts the cards hidden on each side', () => {
    expect(hiddenCounts(0, 24, NINE)).toEqual({ before: 0, after: 15 })
    expect(hiddenCounts(5.4, 24, NINE)).toEqual({ before: 5, after: 10 })
    expect(hiddenCounts(15, 24, NINE)).toEqual({ before: 15, after: 0 })
    const seven = DESKTOP_GEOMETRY.handShape(1280, 7)
    expect(hiddenCounts(0, 7, seven)).toEqual({ before: 0, after: 0 })
  })
})
