import type { RefObject } from 'react'
import { useEffect } from 'react'

export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let frame = 0
    let x = 0
    let y = 0
    const write = () => {
      frame = 0
      element.style.setProperty('--pointer-x', x.toFixed(3))
      element.style.setProperty('--pointer-y', y.toFixed(3))
    }
    const onMove = (event: PointerEvent) => {
      x = (event.clientX / innerWidth) * 2 - 1
      y = (event.clientY / innerHeight) * 2 - 1
      if (!frame) frame = requestAnimationFrame(write)
    }
    const listeners = new AbortController()
    addEventListener('pointermove', onMove, listeners)
    return () => {
      listeners.abort()
      cancelAnimationFrame(frame)
    }
  }, [ref])
}
