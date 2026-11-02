export type ListEntry<T> = { item: T; index: number; removed: boolean }

export type ListChanges<T> = { removed: ListEntry<T>[]; added: T | null }

type WithId = { id: string }

const includesId = (items: WithId[], id: string) => items.some((item) => item.id === id)

export function withRemoved<T>(items: T[], removed: ListEntry<T>[]): ListEntry<T>[] {
  const entries = items.map((item, index) => ({ item, index, removed: false }))
  return [...removed, ...entries].sort((a, b) => a.index - b.index)
}

export function listChanges<T extends WithId>(shown: ListEntry<T>[], items: T[]): ListChanges<T> {
  const indexAfter = (position: number) => {
    const next = shown.slice(position).find(({ item }) => includesId(items, item.id))
    return next ? items.findIndex(({ id }) => id === next.item.id) : items.length
  }
  const kept = shown.flatMap(({ item, removed }) => (removed ? [] : [item]))
  return {
    removed: shown.flatMap(({ item }, position) =>
      includesId(items, item.id) ? [] : [{ item, index: indexAfter(position), removed: true }],
    ),
    added: items.find((item) => !includesId(kept, item.id)) ?? null,
  }
}
