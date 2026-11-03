import { CARD_MOTION_DURATIONS, waveDuration } from '@src/lib/hand/cards.ts'
import type { HandEnd, PlaceStyle } from '@src/lib/hand/geometry.ts'
import type { HandState } from '@src/lib/hand/window.ts'
import { hiddenCounts } from '@src/lib/hand/window.ts'
import { seconds } from '@src/lib/motion.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { AnimatePresence } from 'motion/react'

const ENDS: HandEnd[] = ['before', 'after']

type HiddenCountsProps = {
  state: HandState
  hiddenCountStyle: (end: HandEnd, slots: number) => PlaceStyle
}

export function HiddenCounts({ state, hiddenCountStyle }: HiddenCountsProps) {
  const { count, offset, shape, unfolded, moving } = state
  const hidden = hiddenCounts(offset, count, shape)
  const delay = moving ? seconds(waveDuration(CARD_MOTION_DURATIONS.move / 2, shape.slots)) : 0

  return (
    <AnimatePresence>
      {ENDS.map(
        (end) =>
          unfolded &&
          hidden[end] > 0 && (
            <Appear
              key={end}
              aria-hidden
              delay={delay}
              style={{ ...hiddenCountStyle(end, shape.slots), zIndex: count + 1 }}
              className="bg-foreground text-background shadow-hard-sm pointer-events-none absolute flex h-[26px] min-w-[26px] -translate-1/2 items-center justify-center rounded-full px-2 text-[11px] font-bold"
            >
              +{hidden[end]}
            </Appear>
          ),
      )}
    </AnimatePresence>
  )
}
