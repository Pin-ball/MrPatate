import { useHandScroll } from '@src/hooks/useHandScroll.ts'
import { useMoving } from '@src/hooks/useMoving.ts'
import { useWindowWidth } from '@src/hooks/useWindowWidth.ts'
import { openDuration } from '@src/lib/hand/cards.ts'
import type { HandState } from '@src/lib/hand/geometry.ts'
import { visibleSlots } from '@src/lib/hand/geometry.ts'
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
  const moving = useMoving(
    resetKey,
    open ? openDuration(unfoldDuration, slots) : foldDuration,
    open,
  )
  const { offset, start, scrolling, scrolled, reveal, handlers } = useHandScroll(
    count,
    slots,
    startIndex,
    {
      open,
      resetKey,
    },
  )
  const state: HandState = { offset, slots, unfolded: open, moving, scrolling, scrolled }

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
