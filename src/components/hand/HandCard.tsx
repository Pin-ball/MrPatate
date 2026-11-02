import type { CardLayout } from '@src/lib/hand/cards.ts'
import { MOTION_DURATIONS } from '@src/lib/hand/cards.ts'
import { CARD_HEIGHT, CARD_WIDTH } from '@src/lib/hand/geometry.ts'
import { cn } from '@src/lib/utils.ts'
import type { ComponentProps, ReactNode } from 'react'

type HandCardProps = Omit<ComponentProps<'button'>, 'style' | 'className'> & {
  layout: CardLayout
  corner?: ReactNode
  className?: string
}

export function HandCard({
  layout: { place, state },
  corner,
  className,
  type = 'button',
  onFocus,
  ...props
}: HandCardProps) {
  return (
    <div
      style={{
        ...place,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        '--move-duration': `${MOTION_DURATIONS[state.motion]}ms`,
        '--move-delay': `${state.delay ?? 0}ms`,
      }}
      data-motion={state.motion}
      data-folded={state.folded || undefined}
      data-hidden={state.hidden || undefined}
      data-ignore-pointer={state.ignorePointer || undefined}
      data-added={state.added || undefined}
      data-other-added={state.otherAdded || undefined}
      data-removed={state.removed || undefined}
      data-just-chosen={state.justChosen || undefined}
      inert={state.removed}
      className={cn(
        'border-stroke bg-card card-motion group absolute origin-bottom -translate-1/2 rounded-[18px]',
        className,
      )}
    >
      <button
        type={type}
        aria-hidden={state.folded || undefined}
        tabIndex={state.folded ? -1 : undefined}
        onFocus={state.folded ? undefined : onFocus}
        className="flex size-full cursor-pointer flex-col items-center justify-start gap-2 rounded-[inherit] px-2 pt-2.5 pb-2 text-center leading-[1.15]"
        {...props}
      />
      {corner}
    </div>
  )
}
