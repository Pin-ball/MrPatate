import { BackgroundFill } from '@src/components/character/BackgroundFill.tsx'
import { useParallax } from '@src/hooks/useParallax.ts'
import type { BackgroundPaint } from '@src/lib/catalog/layers.ts'
import { useRef } from 'react'

export function Background({ paint }: { paint: BackgroundPaint }) {
  const ref = useRef<HTMLDivElement>(null)
  useParallax(ref)

  return (
    <div
      ref={ref}
      className="fixed -inset-3 -z-10 translate-x-[calc(var(--parallax-x,0)*-10px)] translate-y-[calc(var(--parallax-y,0)*-10px)] transition-[translate] duration-(--duration-parallax) ease-(--ease-out-strong)"
    >
      <svg className="size-full" aria-hidden>
        <BackgroundFill paint={paint} />
      </svg>
    </div>
  )
}
