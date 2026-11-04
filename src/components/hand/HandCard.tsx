import { useHandGeometry } from '@src/hooks/useLayout.ts'
import type { CardLayout } from '@src/lib/hand/cards.ts'
import { CARD_MOTION_DURATIONS } from '@src/lib/hand/cards.ts'
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
  onPointerEnter,
  ...props
}: HandCardProps) {
  const { card } = useHandGeometry()

  return (
    <div
      style={{
        ...style,
        width: card.width,
        height: card.height,
        borderRadius: CARD_RADIUS,
        '--card-picture': `${card.picture}px`,
        '--card-duration': `${CARD_MOTION_DURATIONS[state.motion]}ms`,
        '--card-delay': `${state.delay ?? 0}ms`,
      }}
      data-motion={state.motion}
      data-in-pile={state.inPile || undefined}
      data-hidden={state.hidden || undefined}
      data-ignore-pointer={state.ignorePointer || undefined}
      data-added={state.added || undefined}
      data-other-added={state.otherAdded || undefined}
      data-removed={state.removed || undefined}
      data-just-chosen={state.justChosen || undefined}
      inert={state.removed}
      className={cn(
        'border-stroke bg-card card-motion group absolute origin-bottom -translate-1/2',
        className,
      )}
    >
      <button
        type={type}
        aria-hidden={state.inPile || undefined}
        tabIndex={state.inPile ? -1 : undefined}
        onFocus={state.inPile ? undefined : onFocus}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') onPointerEnter?.(event)
        }}
        className="flex size-full cursor-pointer flex-col items-center justify-start gap-1.5 rounded-[inherit] px-1.5 py-2 text-center leading-[1.15]"
        {...props}
      />
      {corner}
    </div>
  )
}
