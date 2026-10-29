import { centeredOffset, clampOffset, offsetShowing } from '@src/lib/hand.ts'
import type { MouseEvent, PointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

const WHEEL_PER_CARD = 100
const DRAG_PER_CARD = 80
const DRAG_THRESHOLD = 8
const SNAP_DELAY = 140
const WHEEL_MAX_CARDS_PER_MS = 0.012
const WHEEL_MAX_ELAPSED = 100

type Scroll = { key: unknown; start: number; offset: number; scrolling: boolean }

type Drag = { x: number; offset: number; moved: boolean }

const opened = (key: unknown, startIndex: number, count: number, slots: number): Scroll => {
  const start = centeredOffset(startIndex, count, slots)
  return { key, start, offset: start, scrolling: false }
}

const wheelDelta = (event: WheelEvent, elapsed: number) => {
  const delta = (event.deltaY || event.deltaX) / WHEEL_PER_CARD
  const max = Math.min(elapsed, WHEEL_MAX_ELAPSED) * WHEEL_MAX_CARDS_PER_MS
  return Math.max(-max, Math.min(max, delta))
}

const moved = (scroll: Scroll, offset: number, count: number, slots: number): Scroll => ({
  ...scroll,
  offset: clampOffset(offset, count, slots),
  scrolling: true,
})

const snapped = (scroll: Scroll, count: number, slots: number): Scroll => ({
  ...scroll,
  offset: Math.round(clampOffset(scroll.offset, count, slots)),
  scrolling: false,
})

export function useHandScroll(
  count: number,
  slots: number,
  startIndex: number,
  { open, resetKey }: { open: boolean; resetKey: unknown },
) {
  const [scroll, setScroll] = useState(() => opened(resetKey, startIndex, count, slots))
  const drag = useRef<Drag | null>(null)
  const dragged = useRef(false)

  if (scroll.key !== resetKey) {
    setScroll(open ? opened(resetKey, startIndex, count, slots) : { ...scroll, key: resetKey })
  }

  const offset = clampOffset(scroll.offset, count, slots)
  const scrollable = open && count > slots

  useEffect(() => {
    if (!scrollable) return
    let snapTimer: ReturnType<typeof setTimeout> | undefined
    let lastWheel = Number.NEGATIVE_INFINITY
    const onWheel = (event: WheelEvent) => {
      const delta = wheelDelta(event, event.timeStamp - lastWheel)
      lastWheel = event.timeStamp
      setScroll((current) => moved(current, current.offset + delta, count, slots))
      clearTimeout(snapTimer)
      snapTimer = setTimeout(
        () => setScroll((current) => snapped(current, count, slots)),
        SNAP_DELAY,
      )
    }
    const listeners = new AbortController()
    addEventListener('wheel', onWheel, listeners)
    return () => {
      listeners.abort()
      clearTimeout(snapTimer)
      drag.current = null
      setScroll((current) => snapped(current, count, slots))
    }
  }, [scrollable, count, slots])

  const endDrag = () => {
    const current = drag.current
    drag.current = null
    if (!current?.moved) return
    dragged.current = true
    setScroll((scroll) => snapped(scroll, count, slots))
  }

  const onPointerDown = (event: PointerEvent) => {
    dragged.current = false
    if (scrollable) drag.current = { x: event.clientX, offset, moved: false }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current
    if (!current) return
    if (event.buttons === 0) return endDrag()
    const dx = event.clientX - current.x
    if (!current.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      current.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    setScroll((scroll) => moved(scroll, current.offset - dx / DRAG_PER_CARD, count, slots))
  }

  const onClickCapture = (event: MouseEvent) => {
    if (!dragged.current) return
    dragged.current = false
    event.stopPropagation()
  }

  const reveal = (index: number) =>
    setScroll((current) => ({
      ...current,
      offset: offsetShowing(index, Math.round(clampOffset(current.offset, count, slots)), slots),
    }))

  return {
    offset,
    start: scroll.start,
    scrolling: scroll.scrolling,
    reveal,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
      onClickCapture,
    },
  }
}
