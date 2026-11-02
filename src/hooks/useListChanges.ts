import type { ListChanges } from '@src/lib/listChanges.ts'
import { listChanges, withRemoved } from '@src/lib/listChanges.ts'
import { useEffect, useState } from 'react'

type ListState<T> = ListChanges<T> & { items: T[]; ids: string }

const idsOf = (items: { id: string }[]) => items.map((item) => item.id).join(' ')

export function useListChanges<T extends { id: string }>(items: T[], duration: number) {
  const ids = idsOf(items)
  const [state, setState] = useState<ListState<T>>({ items, ids, removed: [], added: null })

  if (state.ids !== ids) {
    setState({ items, ids, ...listChanges(withRemoved(state.items, state.removed), items) })
  }

  useEffect(() => {
    if (!state.added && !state.removed.length) return
    const timer = setTimeout(
      () => setState((current) => ({ ...current, removed: [], added: null })),
      duration,
    )
    return () => clearTimeout(timer)
  }, [state, duration])

  return { entries: withRemoved(items, state.removed), added: state.added }
}
