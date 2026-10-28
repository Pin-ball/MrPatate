import type { RefObject } from 'react'
import { useEffect } from 'react'

const clamp = (value: number) => Math.min(1, Math.max(-1, value))

export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const onMove = (event: PointerEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect()
      const x = clamp(((event.clientX - left) / width) * 2 - 1)
      const y = clamp(((event.clientY - top) / height) * 2 - 1)
      element.style.setProperty('--pointer-x', x.toFixed(3))
      element.style.setProperty('--pointer-y', y.toFixed(3))
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [ref])
}
