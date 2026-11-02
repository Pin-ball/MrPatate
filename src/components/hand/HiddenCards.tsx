import { openDuration } from '@src/lib/hand/cards.ts'
import type { HandEnd, HandState } from '@src/lib/hand/geometry.ts'
import { hiddenCountStyle, hiddenCounts } from '@src/lib/hand/geometry.ts'
import { DURATIONS, seconds } from '@src/lib/motion.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { AnimatePresence } from 'motion/react'

type HiddenCardsProps = { state: HandState; count: number }

const ENDS: HandEnd[] = ['before', 'after']

export function HiddenCards({
  state: { unfolded, moving, offset, slots },
  count,
}: HiddenCardsProps) {
  const hidden = hiddenCounts(offset, count, slots)
  const delay = moving ? seconds(openDuration(DURATIONS.move / 2, slots)) : 0

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
              style={{ ...hiddenCountStyle(end, slots), zIndex: count + 1 }}
              className="bg-foreground text-background shadow-hard-sm pointer-events-none absolute flex h-[26px] min-w-[26px] -translate-1/2 items-center justify-center rounded-full px-2 text-[11px] font-bold"
            >
              +{hidden[end]}
            </Appear>
          ),
      )}
    </AnimatePresence>
  )
}
