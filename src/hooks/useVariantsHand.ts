import { useHand } from '@src/hooks/useHand.ts'
import { useHandCards } from '@src/hooks/useHandCards.ts'
import { visibleVariants } from '@src/lib/catalog/index.ts'
import type { Part } from '@src/lib/catalog/types.ts'
import type { CardLayout } from '@src/lib/hand/cards.ts'
import {
  arcCardLayout,
  CARD_MOTION_DURATIONS,
  enteringLayout,
  withState,
} from '@src/lib/hand/cards.ts'
import { useEditor } from '@src/stores/editor.ts'
import { usePresence } from 'motion/react'
import { useEffect } from 'react'

export function useVariantsHand(part: Part) {
  const chosenId = useEditor((state) => state.look[part.id])
  const [present, safeToRemove] = usePresence()
  const variants = visibleVariants(part)
  const hasRandomCard = variants.length > 1
  const firstIndex = hasRandomCard ? 1 : 0
  const count = variants.length + firstIndex
  const { cards, chosenIndex, events } = useHandCards(variants, { chosenId, firstIndex })
  const { state, openingOffset, rendered, reveal, handlers } = useHand({
    count,
    openingIndex: chosenIndex,
    unfolded: present,
    resetKey: present,
    unfoldDuration: CARD_MOTION_DURATIONS.enter,
    foldDuration: CARD_MOTION_DURATIONS.leave,
  })

  useEffect(() => {
    if (!present && !state.moving) safeToRemove()
  }, [present, state.moving, safeToRemove])

  const layoutOf = (index: number, id?: string): CardLayout => {
    const layout = arcCardLayout(index, state)
    if (state.unfolded && state.moving) return enteringLayout(layout, index, openingOffset, state)
    return withState(layout, events.eventsOf(id))
  }

  return {
    state,
    cards,
    firstIndex,
    hasRandomCard,
    layoutOf,
    rendered,
    reveal,
    handlers,
  }
}
