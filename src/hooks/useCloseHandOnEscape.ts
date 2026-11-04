import { closeHand } from '@src/stores/editor.ts'
import { useEffect } from 'react'

export function useCloseHandOnEscape() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) closeHand()
    }
    const listeners = new AbortController()
    addEventListener('keydown', onKeyDown, listeners)
    return () => listeners.abort()
  }, [])
}
