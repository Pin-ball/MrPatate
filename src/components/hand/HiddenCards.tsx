import { hiddenCountStyle, hiddenCounts, MOVE_DURATION, openDuration } from '@src/lib/hand.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { AnimatePresence } from 'motion/react'

type HiddenCardsProps = {
  shown: boolean
  opening: boolean
  offset: number
  count: number
  slots: number
}

type Side = { side: 'before' | 'after'; hidden: number }

export function HiddenCards({ shown, opening, offset, count, slots }: HiddenCardsProps) {
  const { before, after } = hiddenCounts(offset, count, slots)
  const sides: Side[] = [
    { side: 'before', hidden: before },
    { side: 'after', hidden: after },
  ]
  const delay = opening ? openDuration(MOVE_DURATION / 2, slots) / 1000 : 0

  return (
    <AnimatePresence>
      {sides.map(
        ({ side, hidden }) =>
          shown &&
          hidden > 0 && (
            <Appear
              key={side}
              aria-hidden
              delay={delay}
              style={{ ...hiddenCountStyle(side, slots), zIndex: count + 1 }}
              className="bg-foreground text-background shadow-hard-sm pointer-events-none absolute flex h-[26px] min-w-[26px] -translate-1/2 items-center justify-center rounded-full px-2 text-[11px] font-bold"
            >
              +{hidden}
            </Appear>
          ),
      )}
    </AnimatePresence>
  )
}
