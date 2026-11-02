import { arcCardLayout, cardEvents, enteringLayout, moveMotion } from '@src/lib/hand/cards.ts'
import type { HandState } from '@src/lib/hand/geometry.ts'
import { describe, expect, it } from 'vitest'

const hand = (state: Partial<HandState> = {}): HandState => ({
  offset: 0,
  slots: 9,
  unfolded: true,
  moving: false,
  scrolling: false,
  scrolled: false,
  ...state,
})

describe('arc card layout', () => {
  it('waits hidden cards one slot past the end of the arc they leave by', () => {
    const spot = (index: number, offset: number) => {
      const { left, top, rotate } = arcCardLayout(index, hand({ offset })).place
      return { left, top, rotate }
    }
    expect(arcCardLayout(0, hand({ offset: 3 })).state.hidden).toBe(true)
    expect(spot(0, 3)).toEqual(spot(0, 1))
    expect(spot(12, 0)).toEqual(spot(9, 0))
    expect(spot(9, 0)).not.toEqual(spot(8, 0))
  })

  it('slides hidden cards along the arc while the offset moves between two cards', () => {
    const spot = (offset: number) => arcCardLayout(0, hand({ offset, scrolling: true })).place.left
    expect(spot(0.75)).not.toEqual(spot(0.5))
    expect(spot(0.75)).not.toEqual(spot(1))
  })

  it('raises variants from below the screen, under their slot', () => {
    const layout = arcCardLayout(0, hand())
    const entering = enteringLayout(layout, 0, 3, 9)
    expect(entering.place).toMatchObject({
      '--from-left': layout.place.left,
      '--from-top': 'calc(100% - 0px + 140px)',
    })
    expect(entering.state).toMatchObject({ motion: 'enter', delay: 0 })
    expect(enteringLayout(layout, 5, 3, 9).state.delay).toBe(90)
  })

  it('folds every card in place, hidden', () => {
    const folded = hand({ unfolded: false, moving: true })
    expect(arcCardLayout(4, folded).state).toEqual({
      motion: 'fold',
      hidden: true,
      ignorePointer: true,
    })
    expect(arcCardLayout(4, folded).place).toEqual(arcCardLayout(4, hand({ moving: true })).place)
  })

  it('lets only the visible cards react to the pointer', () => {
    const at = (offset: number) => hand({ offset })
    expect(arcCardLayout(0, at(0.4)).state.ignorePointer).toBe(false)
    expect(arcCardLayout(0, at(0.6)).state.ignorePointer).toBe(true)
    expect(arcCardLayout(8, at(-0.4)).state.ignorePointer).toBe(false)
    expect(arcCardLayout(8, at(-0.6)).state.ignorePointer).toBe(true)
  })
})

describe('card motion', () => {
  const opening = hand({ slots: 8, moving: true })

  it('moves the hidden cards instantly while the hand opens or folds', () => {
    expect(arcCardLayout(9, opening).state.motion).toBe('instant')
    expect(arcCardLayout(3, opening).state.motion).toBe('move')
    expect(moveMotion(9, { ...opening, unfolded: false })).toBe('instant')
    expect(moveMotion(3, { ...opening, unfolded: false })).toBe('move')
  })

  it('follows the scroll without a transition', () => {
    expect(arcCardLayout(3, hand({ slots: 8, scrolling: true })).state.motion).toBe('scroll')
  })

  it('staggers the opening from the pile side only for visible cards', () => {
    expect(arcCardLayout(0, opening, 'right').state.delay).toBe(0)
    expect(arcCardLayout(7, opening, 'right').state.delay).toBe(315)
    expect(arcCardLayout(9, opening, 'right').state.delay).toBe(0)
    expect(arcCardLayout(7, opening).state.delay).toBe(0)
  })
})

describe('cardEvents', () => {
  const quiet = { addedId: null, removedIds: [], chosenId: null }

  it('tells the added card apart from the others, the add card included', () => {
    expect(cardEvents('a', quiet)).toEqual({})
    const changes = { ...quiet, addedId: 'a' }
    expect(cardEvents('a', changes)).toEqual({ added: true })
    expect(cardEvents('b', changes)).toEqual({ otherAdded: true })
    expect(cardEvents(undefined, changes)).toEqual({ otherAdded: true })
  })

  it('marks the removed and the just chosen cards', () => {
    const changes = { ...quiet, removedIds: ['a'], chosenId: 'b' }
    expect(cardEvents('a', changes)).toEqual({ removed: true })
    expect(cardEvents('b', changes)).toEqual({ justChosen: true })
    expect(cardEvents(undefined, changes)).toEqual({})
  })
})
