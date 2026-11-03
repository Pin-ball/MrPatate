import type { usePile } from '@src/hooks/usePile.ts'
import { setHand } from '@src/stores/editor.ts'
import type { LucideIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import type { ReactNode } from 'react'
import { PileLabel } from './PileLabel.tsx'
import { PileSlot } from './PileSlot.tsx'
import { ScrollCues } from './ScrollCues.tsx'

type PileProps = {
  pile: ReturnType<typeof usePile>
  icon: LucideIcon
  label: string
  pileSlotLabel: string
  pileLabel: string
  children: ReactNode
}

export function Pile({
  pile: { kind, anchor, unfolded, state, handlers },
  icon,
  label,
  pileSlotLabel,
  pileLabel,
  children,
}: PileProps) {
  return (
    <>
      <PileSlot
        anchor={anchor}
        aria-label={pileSlotLabel}
        icon={icon}
        label={label}
        onClick={() => setHand(unfolded ? { kind: 'none' } : { kind })}
      />
      <AnimatePresence>
        {!unfolded && <PileLabel anchor={anchor}>{pileLabel}</PileLabel>}
      </AnimatePresence>
      <nav aria-label={label} className="isolate touch-pan-y" {...handlers}>
        {children}
        <ScrollCues state={state} />
      </nav>
    </>
  )
}
