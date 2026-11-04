import { clamp } from '@src/lib/utils.ts'

export type Axes = { x: number; y: number }

export type OrientationStep = 'request' | 'skip' | 'prompt'

export const TILT_QUERY = '(pointer: coarse)'
export const PERMISSION_GRANTED = 'granted'

const MAX_TILT = 20
const RECENTER_MS = 4000
const ASK_AGAIN_AFTER = 7 * 24 * 60 * 60 * 1000

export function screenTilt(beta: number, gamma: number, angle: number): Axes {
  switch (angle) {
    case 90:
      return { x: beta, y: -gamma }
    case 180:
      return { x: -gamma, y: -beta }
    case 270:
      return { x: -beta, y: gamma }
    default:
      return { x: gamma, y: beta }
  }
}

export function followRest(rest: Axes, tilt: Axes, elapsed: number): Axes {
  const amount = 1 - Math.exp(-elapsed / RECENTER_MS)
  return { x: rest.x + (tilt.x - rest.x) * amount, y: rest.y + (tilt.y - rest.y) * amount }
}

export function tiltOffset(tilt: Axes, rest: Axes): Axes {
  return {
    x: clamp((tilt.x - rest.x) / MAX_TILT, -1, 1),
    y: clamp((tilt.y - rest.y) / MAX_TILT, -1, 1),
  }
}

export function pointerOffset(
  clientX: number,
  clientY: number,
  width: number,
  height: number,
): Axes {
  return { x: (clientX / width) * 2 - 1, y: (clientY / height) * 2 - 1 }
}

export function orientationStep(answer: string | null, now: number): OrientationStep {
  if (answer === PERMISSION_GRANTED) return 'request'
  if (answer !== null && now - Number(answer) < ASK_AGAIN_AFTER) return 'skip'
  return 'prompt'
}
