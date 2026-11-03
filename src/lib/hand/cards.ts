import { DURATIONS } from '@src/lib/motion.ts'
import type { CSSProperties } from 'react'
import type { PileSide } from './geometry.ts'
import { arcStyle, belowArcStyle } from './geometry.ts'
import type { HandState } from './window.ts'
import { isShown, visibleCards } from './window.ts'

type CardMotion = 'move' | 'instant' | 'leave' | 'scroll' | 'enter'

export type CardEvents = {
  added?: boolean
  otherAdded?: boolean
  removed?: boolean
  justChosen?: boolean
}

type CardState = CardEvents & {
  motion: CardMotion
  delay?: number
  inPile?: boolean
  hidden?: boolean
  ignorePointer?: boolean
}

export type CardLayout = { style: CSSProperties; state: CardState }

export type HandChanges = {
  addedId: string | null
  removedIds: string[]
  justChosenId: string | null
}

export const CHANGE_DURATION = 1200
const WAVE_STAGGER = 45

export const CARD_MOTION_DURATIONS: Record<CardMotion, number> = {
  move: DURATIONS.move,
  instant: 0,
  leave: DURATIONS.leave,
  scroll: 0,
  enter: DURATIONS.move,
}

function waveDelay(index: number, { count, offset, shape }: HandState, pileSide: PileSide) {
  const { first, last } = visibleCards(offset, count, shape)
  return (pileSide === 'left' ? last - index : index - first) * WAVE_STAGGER
}

export function moveMotion(index: number, { offset, shape, moving }: HandState): CardMotion {
  return moving && !isShown(index - offset, shape) ? 'instant' : 'move'
}

export function arcCardLayout(index: number, state: HandState, pileSide?: PileSide): CardLayout {
  const { offset, shape, unfolded, moving, scrolling } = state
  const slot = index - offset
  const shown = isShown(slot, shape)
  const style = { ...arcStyle(shape, slot), zIndex: index + 1 }
  if (!unfolded) {
    return { style, state: { motion: 'leave', hidden: true, ignorePointer: true } }
  }
  return {
    style,
    state: {
      motion: scrolling ? 'scroll' : moveMotion(index, state),
      delay: moving && shown && pileSide ? waveDelay(index, state, pileSide) : 0,
      hidden: !shown,
      ignorePointer: moving || !shown,
    },
  }
}

export function enteringLayout(
  { style, state }: CardLayout,
  index: number,
  openingOffset: number,
  { count, shape }: HandState,
): CardLayout {
  const { left, top } = belowArcStyle(shape, index - openingOffset)
  const { first } = visibleCards(openingOffset, count, shape)
  return {
    style: { ...style, '--from-left': left, '--from-top': top },
    state: { ...state, motion: 'enter', delay: (index - first) * WAVE_STAGGER },
  }
}

export function waveDuration(duration: number, cardCount: number): number {
  return duration + (cardCount - 1) * WAVE_STAGGER
}

export function withState({ style, state }: CardLayout, changes: Partial<CardState>): CardLayout {
  return { style, state: { ...state, ...changes } }
}

export function cardEvents(
  id: string | undefined,
  { addedId, removedIds, justChosenId }: HandChanges,
): CardEvents {
  return {
    ...(addedId && (id === addedId ? { added: true } : { otherAdded: true })),
    ...(id !== undefined && removedIds.includes(id) && { removed: true }),
    ...(id !== undefined && id === justChosenId && { justChosen: true }),
  }
}
