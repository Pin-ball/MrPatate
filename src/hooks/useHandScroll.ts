import { centeredOffset, clampOffset, offsetShowing } from '@src/lib/hand.ts'
import { useMotionValueEvent, useSpring } from 'motion/react'
import type { MouseEvent, PointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

const WHEEL_PER_CARD = 100
const DRAG_PER_CARD = 80
const DRAG_THRESHOLD = 8
const SNAP_DELAY = 140
const MAX_CARDS_PER_MS = 0.012
const MAX_ELAPSED = 100
const SPRING = { stiffness: 260, damping: 30 }

type Scroll = {
  key: unknown
  start: number
  offset: number
  scrolling: boolean
  instant: boolean
}

type SpeedLimit = (delta: number, time: number) => number

type Drag = { x: number; moved: boolean; limit: SpeedLimit }

const opened = (key: unknown, startIndex: number, count: number, slots: number): Scroll => {
  const start = centeredOffset(startIndex, count, slots)
  return { key, start, offset: start, scrolling: false, instant: true }
}

function createSpeedLimit(): SpeedLimit {
  let last = Number.NEGATIVE_INFINITY
  return (delta, time) => {
    const max = Math.min(time - last, MAX_ELAPSED) * MAX_CARDS_PER_MS
    last = time
    return Math.max(-max, Math.min(max, delta))
  }
}

const movedBy = (
  scroll: Scroll,
  delta: number,
  count: number,
  slots: number,
  instant: boolean,
): Scroll => ({
  ...scroll,
  offset: clampOffset(scroll.offset + delta, count, slots),
  scrolling: true,
  instant,
})

const snapped = (scroll: Scroll, count: number, slots: number): Scroll => ({
  ...scroll,
  offset: Math.round(clampOffset(scroll.offset, count, slots)),
  scrolling: false,
  instant: false,
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

  const target = clampOffset(scroll.offset, count, slots)
  const spring = useSpring(target, SPRING)
  const [springOffset, setSpringOffset] = useState(target)
  useMotionValueEvent(spring, 'change', setSpringOffset)

  useEffect(() => {
    if (scroll.instant) spring.jump(target)
    else spring.set(target)
  }, [spring, target, scroll.instant])

  const offset = scroll.instant ? target : springOffset
  const scrollable = open && count > slots

  useEffect(() => {
    if (!scrollable) return
    let snapTimer: ReturnType<typeof setTimeout> | undefined
    const limit = createSpeedLimit()
    const onWheel = (event: WheelEvent) => {
      const delta = limit((event.deltaY || event.deltaX) / WHEEL_PER_CARD, event.timeStamp)
      setScroll((current) => movedBy(current, delta, count, slots, false))
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
    if (scrollable) drag.current = { x: event.clientX, moved: false, limit: createSpeedLimit() }
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
    const delta = current.limit(-dx / DRAG_PER_CARD, event.timeStamp)
    current.x = event.clientX
    setScroll((scroll) => movedBy(scroll, delta, count, slots, true))
  }

  const onClickCapture = (event: MouseEvent) => {
    if (!dragged.current) return
    dragged.current = false
    event.stopPropagation()
  }

  const reveal = (index: number) =>
    setScroll((current) => ({
      ...current,
      instant: false,
      offset: offsetShowing(index, Math.round(clampOffset(current.offset, count, slots)), slots),
    }))

  return {
    offset,
    start: scroll.start,
    scrolling: scroll.scrolling || offset !== target,
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
