import { useEffect, useState } from 'react'

export type Change<T> = { value: T; previous: T }

type RecentChange<T> = Change<T> & { changed: boolean }

export function useRecentChange<T>(value: T, duration: number): Change<T> | null {
  const [state, setState] = useState<RecentChange<T>>({ value, previous: value, changed: false })

  if (state.value !== value) setState({ value, previous: state.value, changed: true })

  useEffect(() => {
    if (!state.changed) return
    const timer = setTimeout(
      () => setState((current) => ({ ...current, changed: false })),
      duration,
    )
    return () => clearTimeout(timer)
  }, [state, duration])

  return state.changed ? { value: state.value, previous: state.previous } : null
}
