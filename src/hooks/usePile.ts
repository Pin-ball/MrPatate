import { useHand } from '@src/hooks/useHand.ts'
import type { HandEvents } from '@src/hooks/useHandCards.ts'
import { useHandGeometry } from '@src/hooks/useLayout.ts'
import type { CardLayout } from '@src/lib/hand/cards.ts'
import { arcCardLayout, CARD_MOTION_DURATIONS, moveMotion, withState } from '@src/lib/hand/cards.ts'
import type { PileKind } from '@src/lib/hand/geometry.ts'
import { PILE_SIDES, pilePlace, placeStyle } from '@src/lib/hand/geometry.ts'
import { rangeSize } from '@src/lib/hand/window.ts'
import { clamp } from '@src/lib/utils.ts'
import { useEditor } from '@src/stores/editor.ts'
import { useState } from 'react'

type PileOptions = { count: number; openingIndex: number; events?: HandEvents }

type PileCardOptions = { zIndex: number; onTop: boolean; tilted?: boolean; id?: string }

export function usePile(kind: PileKind, { count, openingIndex, events }: PileOptions) {
  const unfolded = useEditor((state) => state.hand.kind === kind)
  const { state, held, rendered, reveal, spread, spreadPile, handlers } = useHand({
    count,
    openingIndex,
    unfolded,
    resetKey: unfolded,
    unfoldDuration: CARD_MOTION_DURATIONS.move,
  })
  const geometry = useHandGeometry()
  const anchor = geometry.piles[kind]
  const side = PILE_SIDES[kind]

  const added = events?.added ?? null
  const addedId = added?.id ?? null
  const [revealedId, setRevealedId] = useState<string | null>(null)
  if (addedId !== revealedId && (unfolded || !added)) {
    setRevealedId(addedId)
    if (added) reveal(added.index)
  }

  const layoutOf = (
    index: number,
    { zIndex, onTop, tilted = false, id }: PileCardOptions,
  ): CardLayout => {
    const eventsOfCard = events?.eventsOf(id) ?? {}
    if (unfolded) return withState(arcCardLayout(index, state, side), eventsOfCard)
    const size = rangeSize(held)
    const place = pilePlace(clamp(index - held.first, 0, size - 1), size, {
      mirror: side === 'right',
      spread,
      onTop,
      tilted,
    })
    return withState(
      {
        style: {
          ...placeStyle(anchor, place),
          zIndex: eventsOfCard.removed ? count + 1 : zIndex,
        },
        state: { motion: moveMotion(index, state), inPile: true, ignorePointer: state.moving },
      },
      eventsOfCard,
    )
  }

  return {
    kind,
    anchor,
    unfolded,
    state,
    held,
    layoutOf,
    rendered,
    reveal,
    spreadPile,
    handlers,
  }
}
