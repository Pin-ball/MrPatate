import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  const listeners = new AbortController()
  addEventListener('resize', onChange, listeners)
  return () => listeners.abort()
}

export function useWindowWidth(): number {
  return useSyncExternalStore(subscribe, () => innerWidth)
}
