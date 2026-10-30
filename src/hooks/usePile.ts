import { useHand } from '@src/hooks/useHand.ts'
import type { CardLayout, PileKind } from '@src/lib/hand.ts'
import {
  arcCardLayout,
  isRendered,
  MOVE_DURATION,
  PILE_ANCHORS,
  pileMoveDuration,
  pilePlace,
  placeStyle,
} from '@src/lib/hand.ts'
import { useEditor } from '@src/stores/editor.ts'

type PileCard = { zIndex: number; top: boolean; tilted?: boolean }

const SIDES: Record<PileKind, 'left' | 'right'> = { parts: 'left', favorites: 'right' }

export function usePile(kind: PileKind, count: number, startIndex: number) {
  const unfolded = useEditor((state) => state.hand.kind === kind)
  const { state, reveal, spread, spreadPile, handlers } = useHand({
    count,
    open: unfolded,
    resetKey: unfolded,
    startIndex,
    unfoldDuration: MOVE_DURATION,
  })
  const pileSize = Math.min(count, state.slots)

  const layoutOf = (index: number, { zIndex, top, tilted = false }: PileCard): CardLayout => {
    if (unfolded) return arcCardLayout(index, state, SIDES[kind])
    const place = pilePlace(Math.min(index, pileSize - 1), pileSize, {
      mirror: kind === 'favorites',
      spread,
      top,
      tilted,
    })
    return {
      place: { ...placeStyle(PILE_ANCHORS[kind], place), zIndex },
      folded: true,
      ignorePointer: state.moving,
      moveDuration: pileMoveDuration(index, state),
    }
  }

  return {
    kind,
    unfolded,
    state,
    count,
    layoutOf,
    rendered: (index: number) => isRendered(index, state),
    reveal,
    spreadPile,
    handlers,
  }
}
