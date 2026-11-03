import type { HandShape } from '@src/lib/hand/geometry.ts'
import type { OffsetBounds } from '@src/lib/hand/window.ts'
import { clampOffset, isScrollable, offsetBounds } from '@src/lib/hand/window.ts'
import { clamp } from '@src/lib/utils.ts'
import { useMotionValueEvent, useSpring } from 'motion/react'
import type { MouseEvent, PointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

const WHEEL_PER_CARD = 100
const DRAG_THRESHOLD = 8
const SNAP_DELAY = 140
const MAX_CARDS_PER_MS = 0.05
const MAX_ELAPSED = 100
const SPRING = { stiffness: 260, damping: 30 }

let scrolledOnce = false

type Scroll = {
  key: unknown
  offset: number
  scrolling: boolean
  scrolled: boolean
  instant: boolean
}

type HandScrollOptions = {
  count: number
  shape: HandShape
  openingOffset: number
  unfolded: boolean
  resetKey: unknown
}

type SpeedLimit = (delta: number, time: number) => number

type Drag = { x: number; moved: boolean; limit: SpeedLimit }

function opened(key: unknown, offset: number): Scroll {
  return { key, offset, scrolling: false, scrolled: scrolledOnce, instant: true }
}

function createSpeedLimit(): SpeedLimit {
  let last = Number.NEGATIVE_INFINITY
  return (delta, time) => {
    const max = Math.min(time - last, MAX_ELAPSED) * MAX_CARDS_PER_MS
    last = time
    return clamp(delta, -max, max)
  }
}

function movedBy(scroll: Scroll, delta: number, bounds: OffsetBounds, instant: boolean): Scroll {
  return {
    ...scroll,
    offset: clampOffset(scroll.offset + delta, bounds),
    scrolling: true,
    scrolled: true,
    instant,
  }
}

function snapped(scroll: Scroll, bounds: OffsetBounds): Scroll {
  return {
    ...scroll,
    offset: Math.round(clampOffset(scroll.offset, bounds)),
    scrolling: false,
    instant: false,
  }
}

export function useHandScroll({
  count,
  shape,
  openingOffset,
  unfolded,
  resetKey,
}: HandScrollOptions) {
  const [scroll, setScroll] = useState(() => opened(resetKey, openingOffset))
  const drag = useRef<Drag | null>(null)
  const justDragged = useRef(false)
  const bounds = offsetBounds(count, shape)
  const { min, max } = bounds

  if (scroll.key !== resetKey) {
    setScroll(unfolded ? opened(resetKey, openingOffset) : { ...scroll, key: resetKey })
  }

  const target = clampOffset(scroll.offset, bounds)
  const spring = useSpring(target, SPRING)
  const [springOffset, setSpringOffset] = useState(target)
  useMotionValueEvent(spring, 'change', setSpringOffset)

  useEffect(() => {
    if (scroll.instant) spring.jump(target)
    else spring.set(target)
  }, [spring, target, scroll.instant])

  const offset = scroll.instant ? target : springOffset
  const scrollable = unfolded && isScrollable(count, shape)

  useEffect(() => {
    if (!scrollable) return
    const bounds = { min, max }
    let snapTimer: ReturnType<typeof setTimeout> | undefined
    const limit = createSpeedLimit()
    const onWheel = (event: WheelEvent) => {
      const delta = limit((event.deltaY || event.deltaX) / WHEEL_PER_CARD, event.timeStamp)
      setScroll((previous) => movedBy(previous, delta, bounds, false))
      scrolledOnce = true
      clearTimeout(snapTimer)
      snapTimer = setTimeout(() => setScroll((previous) => snapped(previous, bounds)), SNAP_DELAY)
    }
    const listeners = new AbortController()
    addEventListener('wheel', onWheel, listeners)
    return () => {
      listeners.abort()
      clearTimeout(snapTimer)
      drag.current = null
      setScroll((previous) => snapped(previous, bounds))
    }
  }, [scrollable, min, max])

  const endDrag = () => {
    const current = drag.current
    drag.current = null
    if (!current?.moved) return
    justDragged.current = true
    setScroll((previous) => snapped(previous, bounds))
  }

  const onPointerDown = (event: PointerEvent) => {
    justDragged.current = false
    if (scrollable) drag.current = { x: event.clientX, moved: false, limit: createSpeedLimit() }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current
    if (!current) return
    if (event.buttons === 0) {
      endDrag()
      return
    }
    const dx = event.clientX - current.x
    if (!current.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      current.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
      scrolledOnce = true
    }
    const delta = current.limit(-dx / shape.dragPerCard, event.timeStamp)
    current.x = event.clientX
    setScroll((previous) => movedBy(previous, delta, bounds, true))
  }

  const onLostPointerCapture = (event: PointerEvent) => {
    if (event.target === event.currentTarget) endDrag()
  }

  const onClickCapture = (event: MouseEvent) => {
    if (!justDragged.current) return
    justDragged.current = false
    event.stopPropagation()
  }

  const reveal = (index: number) =>
    setScroll((previous) => ({
      ...previous,
      offset: shape.offsetShowing(index, Math.round(clampOffset(previous.offset, bounds))),
      instant: false,
    }))

  return {
    offset,
    scrolling: scroll.scrolling || offset !== target,
    scrolled: scroll.scrolled,
    reveal,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture,
      onClickCapture,
    },
  }
}
