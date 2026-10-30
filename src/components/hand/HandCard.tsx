import type { CardLayout } from '@src/lib/hand.ts'
import { CARD_HEIGHT, CARD_WIDTH, MOVE_DURATION } from '@src/lib/hand.ts'
import { cn } from '@src/lib/utils.ts'
import type { ComponentProps, ReactNode } from 'react'

type HandCardProps = Omit<ComponentProps<'button'>, 'style' | 'className'> & {
  layout: CardLayout
  corner?: ReactNode
  className?: string
}

export function HandCard({
  layout: {
    place,
    folded = false,
    ignorePointer,
    moveDuration = MOVE_DURATION,
    moveDelay = 0,
    ease = 'overshoot',
    hidden = false,
    scrolling = false,
    enter,
  },
  corner,
  className,
  type = 'button',
  ...props
}: HandCardProps) {
  return (
    <div
      style={{
        ...place,
        ...enter,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        '--move-duration': `${moveDuration}ms`,
        '--move-delay': `${moveDelay}ms`,
      }}
      data-ease={ease}
      data-hidden={hidden || undefined}
      data-scrolling={scrolling || undefined}
      className={cn(
        'border-stroke bg-card card-motion group absolute origin-bottom -translate-1/2 rounded-[18px]',
        folded
          ? 'shadow-hard-sm'
          : 'shadow-hard hover:-mt-6 hover:after:absolute hover:after:inset-x-0 hover:after:top-full hover:after:h-8 has-focus-visible:-mt-6',
        ignorePointer && 'pointer-events-none',
        enter && 'animate-enter',
        className,
      )}
    >
      <button
        type={type}
        aria-hidden={folded || undefined}
        tabIndex={folded ? -1 : undefined}
        className="flex size-full cursor-pointer flex-col items-center justify-start gap-2 rounded-[inherit] px-2 pt-2.5 pb-2 text-center leading-[1.15]"
        {...props}
      />
      {corner}
    </div>
  )
}
