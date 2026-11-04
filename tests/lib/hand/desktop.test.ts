import { DESKTOP_GEOMETRY } from '@src/lib/hand/desktop.ts'
import type { Place } from '@src/lib/hand/geometry.ts'
import { describe, expect, it } from 'vitest'

const NINE = DESKTOP_GEOMETRY.handShape(1520, 24)
const TWELVE = DESKTOP_GEOMETRY.handShape(2560, 24)

function rounded({ x, y, rotate }: Place) {
  return {
    x: Math.round(x),
    y: Math.round(y),
    rotate: Math.round(rotate * 10) / 10,
  }
}

describe('desktop arc', () => {
  it('puts the middle slot upright at the top, the outer slots at the height of the piles', () => {
    expect(NINE.slots).toBe(9)
    expect(rounded(NINE.place(4))).toEqual({ x: 0, y: -234, rotate: 0 })
    expect(rounded(NINE.place(0))).toEqual({ x: -361, y: -155, rotate: -24.8 })
    expect(rounded(NINE.place(8))).toEqual({ x: 361, y: -155, rotate: 24.8 })
    expect(rounded(DESKTOP_GEOMETRY.handShape(400, 24).place(0))).toEqual({
      x: 0,
      y: -155,
      rotate: 0,
    })
  })

  it('widens the arc for more cards, keeping its bottom, spacing and opening', () => {
    const nine = NINE.place(8)
    const twelve = TWELVE.place(11)
    expect(twelve.rotate).toBeCloseTo(nine.rotate)
    expect(twelve.y).toBeCloseTo(nine.y)
    expect(TWELVE.place(6.5).x).toBeCloseTo(NINE.place(5).x, 0)
    expect(twelve.x).toBeGreaterThan(nine.x)
  })

  it('keeps the same step between cards, beyond the visible slots too', () => {
    expect(NINE.place(9).rotate).toBeCloseTo(31)
    expect(NINE.place(-1).rotate).toBeCloseTo(-31)
  })

  it('scrolls just enough to show a card', () => {
    expect(NINE.offsetShowing(10, 0)).toBe(2)
    expect(NINE.offsetShowing(1, 5)).toBe(1)
    expect(NINE.offsetShowing(6, 5)).toBe(5)
  })
})

describe('desktop slots', () => {
  it('fits the room between the piles, from one to twelve cards, never more than the hand', () => {
    expect(DESKTOP_GEOMETRY.handShape(1440, 24).slots).toBe(8)
    expect(DESKTOP_GEOMETRY.handShape(1100, 24).slots).toBe(4)
    expect(TWELVE.slots).toBe(12)
    expect(DESKTOP_GEOMETRY.handShape(400, 24).slots).toBe(1)
    expect(DESKTOP_GEOMETRY.handShape(1440, 7).slots).toBe(7)
  })
})

describe('desktop hand top', () => {
  it('rises with the screen width, as a full hand gets more slots', () => {
    expect(Math.round(DESKTOP_GEOMETRY.handTop(1100))).toBe(242)
    expect(Math.round(DESKTOP_GEOMETRY.handTop(1440))).toBe(292)
    expect(Math.round(DESKTOP_GEOMETRY.handTop(2560))).toBe(340)
  })
})
