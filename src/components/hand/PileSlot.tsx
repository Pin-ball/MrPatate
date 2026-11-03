import { useHandGeometry } from '@src/hooks/useLayout.ts'
import type { Anchor } from '@src/lib/hand/geometry.ts'
import { cardSize, placeStyle } from '@src/lib/hand/geometry.ts'
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

type PileSlotProps = Omit<ComponentProps<'button'>, 'style' | 'children'> & {
  anchor: Anchor
  icon: LucideIcon
  label: string
}

const PILE_SLOT_MARGIN = 8

export function PileSlot({ anchor, icon: Icon, label, type = 'button', ...props }: PileSlotProps) {
  const { cardZoom } = useHandGeometry()
  const { width, height } = cardSize(cardZoom)

  return (
    <button
      type={type}
      style={{
        ...placeStyle(anchor),
        width: width + PILE_SLOT_MARGIN,
        height: height + PILE_SLOT_MARGIN,
      }}
      className="border-stroke border-slot text-muted-foreground hover:text-foreground on-dark:border-background/50 on-dark:text-background/75 on-dark:hover:text-background absolute flex -translate-1/2 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-dashed backdrop-blur-sm transition-colors"
      {...props}
    >
      <Icon size={22} strokeWidth={2.25} />
      <span className="text-xs font-bold">{label}</span>
    </button>
  )
}
