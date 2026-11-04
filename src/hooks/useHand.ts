import { useHandScroll } from '@src/hooks/useHandScroll.ts'
import { useHandShape } from '@src/hooks/useLayout.ts'
import { useMoving } from '@src/hooks/useMoving.ts'
import { waveDuration } from '@src/lib/hand/cards.ts'
import type { HandState } from '@src/lib/hand/window.ts'
import {
  centeredOffset,
  heldCards,
  isRendered,
  rangeSize,
  visibleCards,
} from '@src/lib/hand/window.ts'
import { setPreview } from '@src/stores/editor.ts'
import type { FocusEvent } from 'react'
import { useState } from 'react'

type UseHandOptions = {
  count: number
  openingIndex: number
  unfolded: boolean
  resetKey: unknown
  unfoldDuration: number
  foldDuration?: number
}

export function useHand({
  count,
  openingIndex,
  unfolded,
  resetKey,
  unfoldDuration,
  foldDuration = unfoldDuration,
}: UseHandOptions) {
  const [spread, setSpread] = useState(false)
  if (unfolded && spread) setSpread(false)

  const shape = useHandShape(count)
  const openingOffset = centeredOffset(openingIndex, count, shape)
  const openingCount = rangeSize(visibleCards(openingOffset, count, shape))
  const moving = useMoving(
    resetKey,
    unfolded ? waveDuration(unfoldDuration, openingCount) : foldDuration,
    unfolded,
  )
  const { offset, scrolling, scrolled, reveal, handlers } = useHandScroll({
    count,
    shape,
    openingOffset,
    unfolded,
    resetKey,
  })
  const state: HandState = { count, offset, shape, unfolded, moving, scrolling, scrolled }
  const held = heldCards(state, openingOffset)

  const onPointerLeave = () => {
    setPreview(null)
    setSpread(false)
  }

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPreview(null)
  }

  return {
    state,
    openingOffset,
    held,
    rendered: (index: number) => isRendered(index, state, held),
    reveal,
    spread,
    spreadPile: () => setSpread(true),
    handlers: { ...handlers, onPointerLeave, onBlur },
  }
}
