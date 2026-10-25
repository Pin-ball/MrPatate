import type { RefObject } from 'react'
import { useEffect, useEffectEvent } from 'react'

export function useOutsideClick(ref: RefObject<HTMLElement | null>, onOutside: () => void) {
  const handleOutside = useEffectEvent(onOutside)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) handleOutside()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [ref])
}
