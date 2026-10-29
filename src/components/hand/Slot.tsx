import type { Anchor } from '@src/lib/hand.ts'
import { placeStyle } from '@src/lib/hand.ts'
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

type SlotProps = Omit<ComponentProps<'button'>, 'style' | 'children'> & {
  anchor: Anchor
  icon: LucideIcon
  label: string
}

export function Slot({ anchor, icon: Icon, label, type = 'button', ...props }: SlotProps) {
  return (
    <button
      type={type}
      style={placeStyle(anchor)}
      className="border-stroke border-slot text-muted-foreground hover:text-foreground on-dark:border-background/50 on-dark:text-background/75 on-dark:hover:text-background absolute flex h-36 w-28 -translate-1/2 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-dashed backdrop-blur-sm transition-colors"
      {...props}
    >
      <Icon size={22} strokeWidth={2.25} />
      <span className="text-xs font-bold">{label}</span>
    </button>
  )
}
