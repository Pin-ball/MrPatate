import { useCardEvents } from '@src/hooks/useCardEvents.ts'
import { useHand } from '@src/hooks/useHand.ts'
import { visibleVariants } from '@src/lib/catalog/index.ts'
import type { Part } from '@src/lib/catalog/types.ts'
import type { CardLayout } from '@src/lib/hand/cards.ts'
import { arcCardLayout, enteringLayout, MOTION_DURATIONS, withState } from '@src/lib/hand/cards.ts'
import { isInWindow } from '@src/lib/hand/geometry.ts'
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
  const { cards, chosenIndex, events } = useCardEvents(variants, { chosenId, firstIndex })
  const { state, start, reveal, handlers } = useHand({
    count,
    open: present,
    resetKey: present,
    startIndex: chosenIndex,
    unfoldDuration: MOTION_DURATIONS.enter,
    foldDuration: MOTION_DURATIONS.fold,
  })

  useEffect(() => {
    if (!present && !state.moving) safeToRemove()
  }, [present, state.moving, safeToRemove])

  const layoutOf = (index: number, id?: string): CardLayout => {
    const layout = arcCardLayout(index, state)
    if (state.unfolded && state.moving) return enteringLayout(layout, index, start, state.slots)
    return withState(layout, events.eventsOf(id))
  }

  return {
    state,
    count,
    cards,
    hasRandomCard,
    layoutOf,
    rendered: (index: number) => isInWindow(index, state),
    reveal,
    handlers,
  }
}
