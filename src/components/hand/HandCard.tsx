import { useHandGeometry } from '@src/hooks/useLayout.ts'
import type { CardLayout } from '@src/lib/hand/cards.ts'
import { CARD_MOTION_DURATIONS } from '@src/lib/hand/cards.ts'
import { cardSize } from '@src/lib/hand/geometry.ts'
import { cn } from '@src/lib/utils.ts'
import type { ComponentProps, ReactNode } from 'react'

type HandCardProps = Omit<ComponentProps<'button'>, 'style' | 'className'> & {
  layout: CardLayout
  corner?: ReactNode
  className?: string
}

const CARD_RADIUS = 18

export function HandCard({
  layout: { style, state },
  corner,
  className,
  type = 'button',
  onFocus,
  ...props
}: HandCardProps) {
  const { cardZoom } = useHandGeometry()

  return (
    <div
      style={{
        ...style,
        ...cardSize(cardZoom),
        borderWidth: `calc(var(--stroke) * ${cardZoom})`,
        borderRadius: CARD_RADIUS * cardZoom,
        '--card-duration': `${CARD_MOTION_DURATIONS[state.motion]}ms`,
        '--card-delay': `${state.delay ?? 0}ms`,
      }}
      data-motion={state.motion}
      data-in-pile={state.inPile || undefined}
      data-hidden={state.hidden || undefined}
      data-partial={state.partial || undefined}
      data-ignore-pointer={state.ignorePointer || undefined}
      data-added={state.added || undefined}
      data-other-added={state.otherAdded || undefined}
      data-removed={state.removed || undefined}
      data-just-chosen={state.justChosen || undefined}
      inert={state.removed}
      className={cn('bg-card card-motion group absolute origin-bottom -translate-1/2', className)}
    >
      <div style={{ borderRadius: CARD_RADIUS, zoom: cardZoom }} className="relative size-full">
        <button
          type={type}
          aria-hidden={state.inPile || undefined}
          tabIndex={state.inPile ? -1 : undefined}
          onFocus={state.inPile ? undefined : onFocus}
          className="flex size-full cursor-pointer flex-col items-center justify-start gap-2 rounded-[inherit] px-2 pt-2.5 pb-2 text-center leading-[1.15]"
          {...props}
        />
        {corner}
      </div>
    </div>
  )
}
