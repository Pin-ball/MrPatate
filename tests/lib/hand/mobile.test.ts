import type { Place } from '@src/lib/hand/geometry.ts'
import { radians } from '@src/lib/hand/geometry.ts'
import { MOBILE_GEOMETRY } from '@src/lib/hand/mobile.ts'
import { describe, expect, it } from 'vitest'

const MOBILE = MOBILE_GEOMETRY.handShape(500, 24)

function rounded({ x, y, rotate }: Place) {
  return {
    x: Math.round(x),
    y: Math.round(y),
    rotate: Math.round(rotate * 10) / 10,
  }
}

describe('mobile arc', () => {
  it('overlaps the cards on a flat arc, the middle one at a fixed height', () => {
    expect(rounded(MOBILE.place(3))).toEqual({ x: 0, y: -178, rotate: 0 })
    expect(rounded(MOBILE.place(4))).toEqual({ x: 80, y: -173, rotate: 7.5 })
    expect(MOBILE.place(1).y).toBeCloseTo(MOBILE.place(5).y)
  })

  it('brings the card to show to the middle', () => {
    expect(MOBILE.offsetShowing(10, 0)).toBe(7)
    expect(MOBILE.offsetShowing(0, 5)).toBe(-3)
  })
})

describe('mobile slots', () => {
  it('keeps an odd number of whole cards on screen, plus one cut by each edge', () => {
    expect(MOBILE.slots).toBe(7)
    expect(MOBILE_GEOMETRY.handShape(390, 24).slots).toBe(5)
    expect(MOBILE_GEOMETRY.handShape(768, 24).slots).toBe(9)
    expect(MOBILE_GEOMETRY.handShape(60, 24).slots).toBe(3)
    const { card } = MOBILE_GEOMETRY
    for (const width of [320, 360, 390, 430, 500, 768]) {
      const shape = MOBILE_GEOMETRY.handShape(width, 24)
      const { x, rotate } = shape.place(shape.slots - 2)
      const angle = radians(rotate)
      expect(
        x + (card.width / 2) * Math.cos(angle) + card.height * Math.sin(angle),
      ).toBeLessThanOrEqual(width / 2)
    }
  })
})

describe('mobile hand top', () => {
  it('stays at the same height whatever the width', () => {
    expect(MOBILE_GEOMETRY.handTop(500)).toBe(242)
    expect(MOBILE_GEOMETRY.handTop(768)).toBe(242)
  })
})
