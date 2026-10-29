import { Backdrop } from '@src/components/character/Backdrop.tsx'
import { useParallax } from '@src/hooks/useParallax.ts'
import type { BackgroundPaint } from '@src/lib/catalog/layers.ts'
import { useRef } from 'react'

export function Background({ paint }: { paint: BackgroundPaint }) {
  const ref = useRef<HTMLDivElement>(null)
  useParallax(ref)

  return (
    <div
      ref={ref}
      className="ease-out-strong fixed -inset-3 -z-10 translate-x-[calc(var(--pointer-x,0)*-10px)] translate-y-[calc(var(--pointer-y,0)*-10px)] transition-[translate] duration-600"
    >
      <svg className="size-full" aria-hidden>
        <Backdrop paint={paint} />
      </svg>
    </div>
  )
}
