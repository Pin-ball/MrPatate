import { CARD_HEIGHT, CARD_WIDTH, MOVE_DURATION } from '@src/lib/hand.ts'
import { cn } from '@src/lib/utils.ts'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'

export type CardLayout = {
  place: CSSProperties
  folded?: boolean
  ignorePointer: boolean
  moveDuration?: number
  moveDelay?: number
}

type HandCardProps = Omit<ComponentProps<'button'>, 'style' | 'className'> & {
  layout: CardLayout
  corner?: ReactNode
  className?: string
}

export function HandCard({
  layout: { place, folded = false, ignorePointer, moveDuration = MOVE_DURATION, moveDelay = 0 },
  corner,
  className,
  type = 'button',
  ...props
}: HandCardProps) {
  return (
    <div
      style={{
        ...place,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        '--move-duration': `${moveDuration}ms`,
        transitionDelay: `${moveDelay}ms`,
      }}
      className={cn(
        'border-stroke bg-card group absolute origin-bottom -translate-1/2 rounded-[18px] [transition:left_var(--move-duration)_var(--ease-overshoot-sm),top_var(--move-duration)_var(--ease-overshoot-sm),rotate_var(--move-duration)_var(--ease-overshoot-sm),margin-top_0.2s_var(--ease-overshoot-lg),background-color_0.15s_ease]',
        folded ? 'shadow-hard-sm' : 'shadow-hard hover:-mt-6 has-focus-visible:-mt-6',
        ignorePointer && 'pointer-events-none',
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
