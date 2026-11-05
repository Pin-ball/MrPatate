import { DRAG_THRESHOLD } from '@src/hooks/useHandScroll.ts'
import { DURATIONS } from '@src/lib/motion.ts'
import type { MouseEvent, PointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

type Press = { x: number; y: number; timer: ReturnType<typeof setTimeout> }

export function useLongPress(onLongPress?: () => void) {
  const press = useRef<Press | null>(null)
  const longPressed = useRef(false)
  const [pressing, setPressing] = useState(false)

  useEffect(() => () => clearTimeout(press.current?.timer), [])

  const cancel = () => {
    clearTimeout(press.current?.timer)
    press.current = null
    setPressing(false)
  }

  const onPointerDown = (event: PointerEvent) => {
    longPressed.current = false
    if (!onLongPress || event.pointerType !== 'touch') return
    cancel()
    const timer = setTimeout(() => {
      cancel()
      longPressed.current = true
      onLongPress()
    }, DURATIONS.longPress)
    press.current = { x: event.clientX, y: event.clientY, timer }
    setPressing(true)
  }

  const onPointerMove = (event: PointerEvent) => {
    const current = press.current
    if (!current) return
    const distance = Math.hypot(event.clientX - current.x, event.clientY - current.y)
    if (distance >= DRAG_THRESHOLD) cancel()
  }

  const onContextMenu = (event: MouseEvent) => {
    if (press.current || longPressed.current) event.preventDefault()
  }

  const onClickCapture = (event: MouseEvent) => {
    if (!longPressed.current) return
    longPressed.current = false
    event.stopPropagation()
  }

  return {
    pressing,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: cancel,
      onPointerCancel: cancel,
      onPointerLeave: cancel,
      onContextMenu,
      onClickCapture,
    },
  }
}
