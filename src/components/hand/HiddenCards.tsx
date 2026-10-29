import type { Arc } from '@src/lib/hand.ts'
import { ARC_ANCHOR, hiddenCountPlace, hiddenCounts, placeStyle } from '@src/lib/hand.ts'
import { cn } from '@src/lib/utils.ts'

type HiddenCardsProps = {
  offset: number
  count: number
  slots: number
  arc: Arc
}

type Side = { side: 'before' | 'after'; hidden: number }

export function HiddenCards({ offset, count, slots, arc }: HiddenCardsProps) {
  const { before, after } = hiddenCounts(offset, count, slots)
  const sides: Side[] = [
    { side: 'before', hidden: before },
    { side: 'after', hidden: after },
  ]

  return sides.map(({ side, hidden }) => (
    <span
      key={side}
      aria-hidden
      style={{
        ...placeStyle(ARC_ANCHOR, hiddenCountPlace(side, slots, arc)),
        zIndex: count + 1,
      }}
      className={cn(
        'bg-foreground text-background shadow-hard-sm pointer-events-none absolute flex h-[26px] min-w-[26px] -translate-1/2 items-center justify-center rounded-full px-2 text-[11px] font-bold transition-opacity duration-200',
        hidden === 0 && 'opacity-0',
      )}
    >
      +{hidden}
    </span>
  ))
}
