import type { Place } from '@src/lib/hand/geometry.ts'
import { cardSize, radians } from '@src/lib/hand/geometry.ts'
import { MOBILE_GEOMETRY } from '@src/lib/hand/mobile.ts'
import { describe, expect, it } from 'vitest'

const MOBILE = MOBILE_GEOMETRY.handShape(390, 24)

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
    expect(rounded(MOBILE.place(4))).toEqual({ x: 64, y: -175, rotate: 5.9 })
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
    expect(MOBILE_GEOMETRY.handShape(320, 24).slots).toBe(5)
    expect(MOBILE_GEOMETRY.handShape(768, 24).slots).toBe(13)
    expect(MOBILE_GEOMETRY.handShape(60, 24).slots).toBe(3)
    const card = cardSize(MOBILE_GEOMETRY.cardZoom)
    for (const width of [320, 360, 390, 430, 768]) {
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
    expect(MOBILE_GEOMETRY.handTop(390)).toBe(229)
    expect(MOBILE_GEOMETRY.handTop(768)).toBe(229)
  })
})
