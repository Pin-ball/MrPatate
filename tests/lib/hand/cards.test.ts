import { arcCardLayout, cardEvents, enteringLayout, moveMotion } from '@src/lib/hand/cards.ts'
import { DESKTOP_GEOMETRY } from '@src/lib/hand/desktop.ts'
import { MOBILE_GEOMETRY } from '@src/lib/hand/mobile.ts'
import type { HandState } from '@src/lib/hand/window.ts'
import { describe, expect, it } from 'vitest'

const NINE = DESKTOP_GEOMETRY.handShape(1520, 24)
const EIGHT = DESKTOP_GEOMETRY.handShape(1440, 24)
const MOBILE = MOBILE_GEOMETRY.handShape(500, 24)

function handState(state: Partial<HandState> = {}): HandState {
  return {
    count: 24,
    offset: 0,
    shape: NINE,
    unfolded: true,
    moving: false,
    scrolling: false,
    scrolled: false,
    ...state,
  }
}

describe('arcCardLayout', () => {
  it('waits hidden cards one slot past the end of the arc they leave by', () => {
    const spot = (index: number, offset: number) => {
      const { left, top, rotate } = arcCardLayout(index, handState({ offset })).style
      return { left, top, rotate }
    }
    expect(arcCardLayout(0, handState({ offset: 3 })).state.hidden).toBe(true)
    expect(spot(0, 3)).toEqual(spot(0, 1))
    expect(spot(12, 0)).toEqual(spot(9, 0))
    expect(spot(9, 0)).not.toEqual(spot(8, 0))
  })

  it('slides hidden cards along the arc while the offset moves between two cards', () => {
    const spot = (offset: number) =>
      arcCardLayout(0, handState({ offset, scrolling: true })).style.left
    expect(spot(0.75)).not.toEqual(spot(0.5))
    expect(spot(0.75)).not.toEqual(spot(1))
  })

  it('raises variants from below the screen, under their slot, one after the other', () => {
    const layout = arcCardLayout(3, handState({ offset: 3 }))
    const entering = enteringLayout(layout, 3, 3, handState({ offset: 3 }))
    expect(entering.style).toMatchObject({
      '--from-left': layout.style.left,
      '--from-top': 'calc(100% - var(--safe-bottom) - 0px + 140px)',
    })
    expect(entering.state).toMatchObject({ motion: 'enter', delay: 0 })
    expect(enteringLayout(layout, 5, 3, handState()).state.delay).toBe(90)
  })

  it('folds every card in place, hidden', () => {
    const folded = handState({ unfolded: false, moving: true })
    expect(arcCardLayout(4, folded).state).toEqual({
      motion: 'leave',
      hidden: true,
      ignorePointer: true,
    })
    expect(arcCardLayout(4, folded).style).toEqual(
      arcCardLayout(4, handState({ moving: true })).style,
    )
  })

  it('lets only the visible cards react to the pointer', () => {
    const at = (offset: number) => handState({ offset })
    expect(arcCardLayout(0, at(0.4)).state.ignorePointer).toBe(false)
    expect(arcCardLayout(0, at(0.6)).state.ignorePointer).toBe(true)
    expect(arcCardLayout(8, at(-0.4)).state.ignorePointer).toBe(false)
    expect(arcCardLayout(8, at(-0.6)).state.ignorePointer).toBe(true)
  })

  it('lets the cards cut by the screen edge react like the others', () => {
    const middle = handState({ count: 12, offset: 3, shape: MOBILE })
    expect(arcCardLayout(3, middle).state).toMatchObject({ hidden: false, ignorePointer: false })
    expect(arcCardLayout(9, middle).state).toMatchObject({ hidden: false, ignorePointer: false })
    expect(arcCardLayout(2, middle).state).toMatchObject({ hidden: true, ignorePointer: true })
  })

  it('stacks the cards from left to right, on mobile as on desktop', () => {
    const middle = handState({ count: 12, offset: 4, shape: MOBILE })
    expect(arcCardLayout(5, middle).style.zIndex).toBe(6)
    expect(arcCardLayout(6, middle).style.zIndex).toBe(7)
    expect(arcCardLayout(6, { ...middle, offset: 4.4 }).style.zIndex).toBe(7)
  })
})

describe('card motion', () => {
  const opening = handState({ shape: EIGHT, moving: true })

  it('moves the hidden cards instantly while the hand opens or folds', () => {
    expect(arcCardLayout(9, opening).state.motion).toBe('instant')
    expect(arcCardLayout(3, opening).state.motion).toBe('move')
    expect(moveMotion(9, { ...opening, unfolded: false })).toBe('instant')
    expect(moveMotion(3, { ...opening, unfolded: false })).toBe('move')
  })

  it('moves the cards cut by the screen edge with the others', () => {
    const mobile = handState({ count: 12, offset: 3, shape: MOBILE, moving: true })
    expect(arcCardLayout(3, mobile).state.motion).toBe('move')
    expect(arcCardLayout(2, mobile).state.motion).toBe('instant')
  })

  it('follows the scroll without a transition', () => {
    expect(arcCardLayout(3, handState({ shape: EIGHT, scrolling: true })).state.motion).toBe(
      'scroll',
    )
  })

  it('staggers the opening from the pile side only for visible cards', () => {
    expect(arcCardLayout(0, opening, 'right').state.delay).toBe(0)
    expect(arcCardLayout(7, opening, 'right').state.delay).toBe(315)
    expect(arcCardLayout(9, opening, 'right').state.delay).toBe(0)
    expect(arcCardLayout(7, opening).state.delay).toBe(0)
  })

  it('gives the cards cut by the screen edge their own turn in the wave', () => {
    const mobile = handState({ count: 12, offset: 3, shape: MOBILE, moving: true })
    expect([3, 4, 8, 9].map((index) => arcCardLayout(index, mobile, 'right').state.delay)).toEqual([
      0, 45, 225, 270,
    ])
    expect([3, 4, 8, 9].map((index) => arcCardLayout(index, mobile, 'left').state.delay)).toEqual([
      270, 225, 45, 0,
    ])
    const entering = enteringLayout(arcCardLayout(3, mobile), 3, 3, mobile)
    expect(entering.state.delay).toBe(0)
    expect(enteringLayout(arcCardLayout(9, mobile), 9, 3, mobile).state.delay).toBe(270)
  })

  it('starts the stagger at the first card when the hand opens past an end', () => {
    const centeredOnFirst = handState({ count: 4, offset: -3, shape: MOBILE, moving: true })
    expect(arcCardLayout(0, centeredOnFirst, 'right').state.delay).toBe(0)
    expect(arcCardLayout(3, centeredOnFirst, 'left').state.delay).toBe(0)
    const layout = arcCardLayout(0, centeredOnFirst)
    expect(enteringLayout(layout, 0, -3, centeredOnFirst).state.delay).toBe(0)
  })
})

describe('cardEvents', () => {
  const quiet = { addedId: null, removedIds: [], justChosenId: null }

  it('tells the added card apart from the others, the add card included', () => {
    expect(cardEvents('a', quiet)).toEqual({})
    const changes = { ...quiet, addedId: 'a' }
    expect(cardEvents('a', changes)).toEqual({ added: true })
    expect(cardEvents('b', changes)).toEqual({ otherAdded: true })
    expect(cardEvents(undefined, changes)).toEqual({ otherAdded: true })
  })

  it('marks the removed and the just chosen cards', () => {
    const changes = { ...quiet, removedIds: ['a'], justChosenId: 'b' }
    expect(cardEvents('a', changes)).toEqual({ removed: true })
    expect(cardEvents('b', changes)).toEqual({ justChosen: true })
    expect(cardEvents(undefined, changes)).toEqual({})
  })
})
