import { useListChanges } from '@src/hooks/useListChanges.ts'
import { useRecentChange } from '@src/hooks/useRecentChange.ts'
import type { CardEvents, HandChanges } from '@src/lib/hand/cards.ts'
import { CHANGE_DURATION, cardEvents } from '@src/lib/hand/cards.ts'
import { DURATIONS } from '@src/lib/motion.ts'

type HandCardsOptions = { chosenId: string | undefined; firstIndex: number }

export type HandEvents = {
  added: { id: string; index: number } | null
  eventsOf: (id?: string) => CardEvents
}

export function useHandCards<T extends { id: string }>(
  items: T[],
  { chosenId, firstIndex }: HandCardsOptions,
) {
  const { entries, added } = useListChanges(items, CHANGE_DURATION)
  const justChosenId = useRecentChange(chosenId, DURATIONS.bounce)
  const indexOf = (id: string | undefined) => items.findIndex((item) => item.id === id)
  const chosenIndex = indexOf(chosenId)
  const changes: HandChanges = {
    addedId: added?.id ?? null,
    removedIds: entries.flatMap(({ item, removed }) => (removed ? [item.id] : [])),
    justChosenId: justChosenId ?? null,
  }

  const events: HandEvents = {
    added: added && { id: added.id, index: firstIndex + indexOf(added.id) },
    eventsOf: (id) => cardEvents(id, changes),
  }

  return {
    cards: entries.map(({ item, index }) => ({ item, index: firstIndex + index })),
    chosenIndex: chosenIndex < 0 ? 0 : firstIndex + chosenIndex,
    events,
  }
}
