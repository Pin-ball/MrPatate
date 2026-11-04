import type { Axes } from '@src/lib/parallax.ts'
import { followRest, pointerOffset, screenTilt, TILT_QUERY, tiltOffset } from '@src/lib/parallax.ts'
import type { RefObject } from 'react'
import { useEffect } from 'react'

export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current

    if (!element) return
    let frame = 0
    let offset: Axes = { x: 0, y: 0 }
    let rest: Axes | null = null
    let lastTime = 0

    const write = () => {
      frame = 0
      element.style.setProperty('--parallax-x', offset.x.toFixed(3))
      element.style.setProperty('--parallax-y', offset.y.toFixed(3))
    }

    const onPointer = (event: PointerEvent) => {
      offset = pointerOffset(event.clientX, event.clientY, innerWidth, innerHeight)
      if (!frame) frame = requestAnimationFrame(write)
    }

    const onOrientation = ({ beta, gamma, timeStamp }: DeviceOrientationEvent) => {
      if (beta === null || gamma === null) return
      const tilt = screenTilt(beta, gamma, screen.orientation.angle)
      rest = rest ? followRest(rest, tilt, timeStamp - lastTime) : tilt
      lastTime = timeStamp
      offset = tiltOffset(tilt, rest)
      if (!frame) frame = requestAnimationFrame(write)
    }

    const resetRest = () => {
      rest = null
    }

    const listeners = new AbortController()
    if (matchMedia(TILT_QUERY).matches) {
      addEventListener('deviceorientation', onOrientation, listeners)
      screen.orientation.addEventListener('change', resetRest, listeners)
    } else addEventListener('pointermove', onPointer, listeners)

    return () => {
      listeners.abort()
      cancelAnimationFrame(frame)
    }
  }, [ref])
}
