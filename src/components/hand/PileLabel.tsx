import type { Anchor } from '@src/lib/hand/geometry.ts'
import { labelStyle } from '@src/lib/hand/geometry.ts'
import { Appear } from '@src/ui/Appear.tsx'

export function PileLabel({ anchor, children }: { anchor: Anchor; children: string }) {
  return (
    <Appear
      delay={0.3}
      style={labelStyle(anchor.left)}
      className="border-foreground bg-card pointer-events-none absolute z-25 -translate-x-1/2 rounded-full border-2 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap"
    >
      {children}
    </Appear>
  )
}
