import { useEffect } from 'react'

export function useParallax() {
  useEffect(() => {
    const { style } = document.documentElement
    const onMove = (event: PointerEvent) => {
      style.setProperty('--pointer-x', ((event.clientX / innerWidth) * 2 - 1).toFixed(3))
      style.setProperty('--pointer-y', ((event.clientY / innerHeight) * 2 - 1).toFixed(3))
    }
    addEventListener('pointermove', onMove)
    return () => removeEventListener('pointermove', onMove)
  }, [])
}
