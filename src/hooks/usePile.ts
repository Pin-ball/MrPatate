import type { HandEvents } from '@src/hooks/useCardEvents.ts'
import { useHand } from '@src/hooks/useHand.ts'
import type { CardLayout } from '@src/lib/hand/cards.ts'
import { arcCardLayout, MOTION_DURATIONS, moveMotion, withState } from '@src/lib/hand/cards.ts'
import type { PileKind } from '@src/lib/hand/geometry.ts'
import {
  centeredOffset,
  isRendered,
  PILE_ANCHORS,
  PILE_SIDES,
  pilePlace,
  pileStart,
  placeStyle,
} from '@src/lib/hand/geometry.ts'
import { clamp } from '@src/lib/utils.ts'
import { useEditor } from '@src/stores/editor.ts'
import { useState } from 'react'

type PileOptions = { count: number; startIndex: number; events?: HandEvents }

type PileCard = { zIndex: number; top: boolean; tilted?: boolean; id?: string }

export function usePile(kind: PileKind, { count, startIndex, events }: PileOptions) {
  const unfolded = useEditor((state) => state.hand.kind === kind)
  const { state, reveal, spread, spreadPile, handlers } = useHand({
    count,
    open: unfolded,
    resetKey: unfolded,
    startIndex,
    unfoldDuration: MOTION_DURATIONS.move,
  })
  const pileSize = Math.min(count, state.slots)
  const start = pileStart(state, centeredOffset(startIndex, count, state.slots))

  const added = events?.added ?? null
  const addedId = added?.id ?? null
  const [revealed, setRevealed] = useState<string | null>(null)
  if (addedId !== revealed && (unfolded || !added)) {
    setRevealed(addedId)
    if (added) reveal(added.index)
  }

  const layoutOf = (index: number, { zIndex, top, tilted = false, id }: PileCard): CardLayout => {
    const facts = events?.eventsOf(id) ?? {}
    if (unfolded) return withState(arcCardLayout(index, state, PILE_SIDES[kind]), facts)
    const place = pilePlace(clamp(index - start, 0, pileSize - 1), pileSize, {
      mirror: PILE_SIDES[kind] === 'right',
      spread,
      top,
      tilted,
    })
    return withState(
      {
        place: {
          ...placeStyle(PILE_ANCHORS[kind], place),
          zIndex: facts.removed ? count + 1 : zIndex,
        },
        state: { motion: moveMotion(index, state), folded: true, ignorePointer: state.moving },
      },
      facts,
    )
  }

  return {
    kind,
    unfolded,
    state,
    count,
    pileStart: start,
    pileSize,
    layoutOf,
    rendered: (index: number) => isRendered(index, state, start),
    reveal,
    spreadPile,
    handlers,
  }
}
