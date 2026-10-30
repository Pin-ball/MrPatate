import type { usePile } from '@src/hooks/usePile.ts'
import { PILE_ANCHORS } from '@src/lib/hand.ts'
import { setHand } from '@src/stores/editor.ts'
import type { LucideIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import type { ReactNode } from 'react'
import { HiddenCards } from './HiddenCards.tsx'
import { PileLabel } from './PileLabel.tsx'
import { Slot } from './Slot.tsx'

type PileProps = {
  pile: ReturnType<typeof usePile>
  icon: LucideIcon
  label: string
  slotLabel: string
  pileLabel: string
  children: ReactNode
}

export function Pile({
  pile: { kind, unfolded, state, count, handlers },
  icon,
  label,
  slotLabel,
  pileLabel,
  children,
}: PileProps) {
  const anchor = PILE_ANCHORS[kind]
  return (
    <>
      <Slot
        anchor={anchor}
        aria-label={slotLabel}
        icon={icon}
        label={label}
        onClick={() => setHand(unfolded ? { kind: 'none' } : { kind })}
      />
      <AnimatePresence>
        {!unfolded && <PileLabel anchor={anchor}>{pileLabel}</PileLabel>}
      </AnimatePresence>
      <nav aria-label={label} className="isolate" {...handlers}>
        {children}
        <HiddenCards
          shown={unfolded}
          opening={state.moving}
          offset={state.offset}
          count={count}
          slots={state.slots}
        />
      </nav>
    </>
  )
}
