import {
  followRest,
  orientationStep,
  PERMISSION_GRANTED,
  pointerOffset,
  screenTilt,
  tiltOffset,
} from '@src/lib/parallax.ts'
import { describe, expect, it } from 'vitest'

describe('screenTilt', () => {
  it('reads the left-right tilt as x and the front-back tilt as y, whatever the screen rotation', () => {
    expect(screenTilt(40, 10, 0)).toEqual({ x: 10, y: 40 })
    expect(screenTilt(40, 10, 90)).toEqual({ x: 40, y: -10 })
    expect(screenTilt(40, 10, 180)).toEqual({ x: -10, y: -40 })
    expect(screenTilt(40, 10, 270)).toEqual({ x: -40, y: 10 })
  })
})

describe('followRest', () => {
  const rest = { x: 0, y: 40 }
  const tilt = { x: 10, y: 50 }

  it('moves the rest position slowly toward the held tilt', () => {
    const soon = followRest(rest, tilt, 100)
    expect(soon.x).toBeGreaterThan(0)
    expect(soon.x).toBeLessThan(1)
    expect(followRest(rest, tilt, 60_000).x).toBeCloseTo(10)
  })

  it('stays in place when no time has passed', () => {
    expect(followRest(rest, tilt, 0)).toEqual(rest)
  })
})

describe('tiltOffset', () => {
  it('maps twenty degrees around the rest position to the full parallax range', () => {
    const rest = { x: 0, y: 40 }
    expect(tiltOffset({ x: 0, y: 40 }, rest)).toEqual({ x: 0, y: 0 })
    expect(tiltOffset({ x: 10, y: 30 }, rest)).toEqual({ x: 0.5, y: -0.5 })
    expect(tiltOffset({ x: 45, y: 90 }, rest)).toEqual({ x: 1, y: 1 })
  })
})

describe('pointerOffset', () => {
  it('maps the pointer from the window edges to the full parallax range', () => {
    expect(pointerOffset(0, 0, 1000, 800)).toEqual({ x: -1, y: -1 })
    expect(pointerOffset(500, 400, 1000, 800)).toEqual({ x: 0, y: 0 })
    expect(pointerOffset(1000, 800, 1000, 800)).toEqual({ x: 1, y: 1 })
  })
})

describe('orientationStep', () => {
  const day = 24 * 60 * 60 * 1000
  const now = 100 * day

  it('asks again without a prompt once the permission was granted', () => {
    expect(orientationStep(PERMISSION_GRANTED, now)).toBe('request')
  })

  it('prompts the first time, then waits a week after a decline', () => {
    expect(orientationStep(null, now)).toBe('prompt')
    expect(orientationStep(String(now - 3 * day), now)).toBe('skip')
    expect(orientationStep(String(now - 8 * day), now)).toBe('prompt')
  })
})
