import type { usePile } from '@src/hooks/usePile.ts'
import { setHand } from '@src/stores/editor.ts'
import type { LucideIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import type { ReactNode } from 'react'
import { HandBar } from './HandBar.tsx'
import { HandDragArea } from './HandDragArea.tsx'
import { PileLabel } from './PileLabel.tsx'
import { PileSlot } from './PileSlot.tsx'
import { ScrollCues } from './ScrollCues.tsx'

type PileProps = {
  pile: ReturnType<typeof usePile>
  icon: LucideIcon
  label: string
  firstIndex?: number
  pileSlotLabel: string
  pileLabel: string
  children: ReactNode
}

export function Pile({
  pile: { kind, anchor, lowered, unfolded, state, handlers },
  icon,
  label,
  firstIndex = 0,
  pileSlotLabel,
  pileLabel,
  children,
}: PileProps) {
  return (
    <>
      <PileSlot
        anchor={anchor}
        inert={lowered}
        aria-label={pileSlotLabel}
        icon={icon}
        label={label}
        onClick={() => setHand(unfolded ? { kind: 'none' } : { kind })}
      />
      <AnimatePresence>
        {!unfolded && !lowered && <PileLabel anchor={anchor}>{pileLabel}</PileLabel>}
      </AnimatePresence>
      <nav aria-label={label} className="isolate touch-pan-y" {...handlers}>
        <HandDragArea state={state} />
        {children}
        <ScrollCues state={state} />
      </nav>
      <HandBar state={state} firstIndex={firstIndex} icon={icon} name={label} />
    </>
  )
}
