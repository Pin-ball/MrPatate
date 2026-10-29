import { Backdrop } from '@src/components/character/Backdrop.tsx'
import type { BackgroundPaint } from '@src/lib/catalog/layers.ts'

const WHOLE_PAGE = { x: 0, y: 0, width: '100%', height: '100%' }

export function Background({ paint }: { paint: BackgroundPaint }) {
  return (
    <div className="ease-soft fixed -inset-3 -z-10 translate-x-[calc(var(--pointer-x,0)*-10px)] translate-y-[calc(var(--pointer-y,0)*-10px)] transition-[translate] duration-600">
      <svg className="size-full" aria-hidden>
        <Backdrop paint={paint} area={WHOLE_PAGE} />
      </svg>
    </div>
  )
}
