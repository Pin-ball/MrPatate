import { useHandScroll } from '@src/hooks/useHandScroll.ts'
import { useMoving } from '@src/hooks/useMoving.ts'
import { useWindowWidth } from '@src/hooks/useWindowWidth.ts'
import type { HandState } from '@src/lib/hand.ts'
import { openDuration, visibleSlots } from '@src/lib/hand.ts'
import { setPreview } from '@src/stores/editor.ts'
import type { FocusEvent } from 'react'
import { useState } from 'react'

type UseHandOptions = {
  count: number
  open: boolean
  resetKey: unknown
  startIndex: number
  unfoldDuration: number
  foldDuration?: number
}

export function useHand({
  count,
  open,
  resetKey,
  startIndex,
  unfoldDuration,
  foldDuration = unfoldDuration,
}: UseHandOptions) {
  const [spread, setSpread] = useState(false)
  if (open && spread) setSpread(false)

  const slots = visibleSlots(count, useWindowWidth())
  const moving = useMoving(resetKey, open ? openDuration(unfoldDuration, slots) : foldDuration)
  const { offset, start, scrolling, reveal, handlers } = useHandScroll(count, slots, startIndex, {
    open,
    resetKey,
  })
  const state: HandState = { offset, slots, unfolded: open, moving, scrolling }

  const onPointerLeave = () => {
    setPreview(null)
    setSpread(false)
  }

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPreview(null)
  }

  return {
    state,
    start,
    reveal,
    spread,
    spreadPile: () => setSpread(true),
    handlers: { ...handlers, onPointerLeave, onBlur },
  }
}
