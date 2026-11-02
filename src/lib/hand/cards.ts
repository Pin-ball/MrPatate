import { DURATIONS } from '@src/lib/motion.ts'
import type { CSSProperties } from 'react'
import type { HandState, PileSide } from './geometry.ts'
import { arcStyle, belowArcStyle, beyondArcStyle, isShown, nearestSlot } from './geometry.ts'

type CardMotion = 'move' | 'instant' | 'fold' | 'scroll' | 'enter'

export type CardEvents = {
  added?: boolean
  otherAdded?: boolean
  removed?: boolean
  justChosen?: boolean
}

type CardState = CardEvents & {
  motion: CardMotion
  delay?: number
  folded?: boolean
  hidden?: boolean
  ignorePointer?: boolean
}

export type CardLayout = { place: CSSProperties; state: CardState }

export type HandChanges = { addedId: string | null; removedIds: string[]; chosenId: string | null }

export const CHANGE_DURATION = 1200
const ENTER_STAGGER = 45

export const MOTION_DURATIONS: Record<CardMotion, number> = {
  move: DURATIONS.move,
  instant: 0,
  fold: DURATIONS.fold,
  scroll: 0,
  enter: DURATIONS.move,
}

function openDelay(slot: number, slots: number, pileSide: PileSide): number {
  const fromLeft = nearestSlot(slot, slots)
  return (pileSide === 'left' ? slots - 1 - fromLeft : fromLeft) * ENTER_STAGGER
}

export function arcCardLayout(index: number, state: HandState, pileSide?: PileSide): CardLayout {
  const { offset, slots, unfolded, moving, scrolling } = state
  const slot = index - offset
  const shown = isShown(slot, slots)
  const place = {
    ...(shown ? arcStyle(slot, slots) : beyondArcStyle(slot, slots)),
    zIndex: index + 1,
  }
  if (!unfolded) {
    return { place, state: { motion: 'fold', hidden: true, ignorePointer: true } }
  }
  return {
    place,
    state: {
      motion: scrolling ? 'scroll' : moveMotion(index, state),
      delay: moving && shown && pileSide ? openDelay(slot, slots, pileSide) : 0,
      hidden: !shown,
      ignorePointer: moving || !shown,
    },
  }
}

export function cardEvents(
  id: string | undefined,
  { addedId, removedIds, chosenId }: HandChanges,
): CardEvents {
  return {
    ...(addedId && (id === addedId ? { added: true } : { otherAdded: true })),
    ...(id !== undefined && removedIds.includes(id) && { removed: true }),
    ...(id !== undefined && id === chosenId && { justChosen: true }),
  }
}

export function withState({ place, state }: CardLayout, changes: Partial<CardState>): CardLayout {
  return { place, state: { ...state, ...changes } }
}

export function moveMotion(index: number, { offset, slots, moving }: HandState): CardMotion {
  return moving && !isShown(index - offset, slots) ? 'instant' : 'move'
}

export function enteringLayout(
  { place, state }: CardLayout,
  index: number,
  start: number,
  slots: number,
): CardLayout {
  const { left, top } = belowArcStyle(index - start, slots)
  return {
    place: { ...place, '--from-left': left, '--from-top': top },
    state: { ...state, motion: 'enter', delay: nearestSlot(index - start, slots) * ENTER_STAGGER },
  }
}

export function openDuration(duration: number, slots: number): number {
  return duration + (slots - 1) * ENTER_STAGGER
}
