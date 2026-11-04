import { useEffect, useState } from 'react'

type RecentChange<T> = { value: T; changed: boolean }

export function useRecentChange<T>(value: T, duration: number): T | null {
  const [state, setState] = useState<RecentChange<T>>({ value, changed: false })

  if (state.value !== value) setState({ value, changed: true })

  useEffect(() => {
    if (!state.changed) return
    const timer = setTimeout(
      () => setState((current) => ({ ...current, changed: false })),
      duration,
    )
    return () => clearTimeout(timer)
  }, [state, duration])

  return state.changed ? state.value : null
}
