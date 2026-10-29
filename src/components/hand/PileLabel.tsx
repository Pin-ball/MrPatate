import type { Anchor } from '@src/lib/hand.ts'

const BELOW_PILE_CENTER = 90

export function PileLabel({ anchor, children }: { anchor: Anchor; children: string }) {
  return (
    <span
      style={{ left: anchor.left, top: `calc(100% - ${anchor.bottom - BELOW_PILE_CENTER}px)` }}
      className="border-foreground bg-card pointer-events-none absolute z-25 -translate-x-1/2 animate-[fade-in_0.3s_ease_0.3s_both] rounded-full border-2 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap"
    >
      {children}
    </span>
  )
}
