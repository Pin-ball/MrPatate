import { useEffect, useState } from 'react'

export function useMoving(key: unknown, duration: number): boolean {
  const [state, setState] = useState({ key, settled: true })

  if (state.key !== key) setState({ key, settled: false })

  useEffect(() => {
    if (state.settled) return
    const timer = setTimeout(() => setState((current) => ({ ...current, settled: true })), duration)
    return () => clearTimeout(timer)
  }, [state, duration])

  return state.key !== key || !state.settled
}
