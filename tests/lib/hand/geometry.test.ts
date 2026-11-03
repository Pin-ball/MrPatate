import { dragAreaStyle, pilePlace } from '@src/lib/hand/geometry.ts'
import { describe, expect, it } from 'vitest'

describe('pilePlace', () => {
  it('stacks the cards slightly shifted and rotated', () => {
    expect(pilePlace(0, 7)).toEqual({ x: -3, y: 0, rotate: -7.5 })
    expect(pilePlace(6, 7)).toEqual({ x: -3, y: -12, rotate: 7.5 })
  })

  it('mirrors the pile on the other side', () => {
    expect(pilePlace(0, 7, { mirror: true })).toEqual({ x: 3, y: 0, rotate: 7.5 })
  })

  it('spreads the pile and lifts its top card', () => {
    expect(pilePlace(6, 7, { spread: true, onTop: true })).toEqual({ x: -9, y: -26, rotate: 13.5 })
  })

  it('tilts a card at a fixed angle', () => {
    expect(pilePlace(1, 7, { tilted: true })).toEqual({ x: 0, y: -2, rotate: -3 })
    expect(pilePlace(1, 7, { spread: true, tilted: true })).toEqual({ x: 0, y: -2, rotate: -6 })
  })
})

describe('dragAreaStyle', () => {
  it('spans from a little above the hand down to the safe area', () => {
    expect(dragAreaStyle(229, 16)).toEqual({
      top: 'calc(100% - var(--safe-bottom) - 245px)',
      bottom: 'var(--safe-bottom)',
    })
  })
})
