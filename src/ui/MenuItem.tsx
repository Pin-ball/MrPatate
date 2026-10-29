import { Button } from '@src/ui/Button.tsx'
import { MenuContext } from '@src/ui/MenuContext.ts'
import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import type { ComponentProps, MouseEvent } from 'react'
import { use } from 'react'

type MenuItemProps = Omit<ComponentProps<typeof Button>, 'variant'> & {
  icon?: LucideIcon
  checked?: boolean
}

export function MenuItem({ icon: Icon, checked, children, onClick, ...props }: MenuItemProps) {
  const close = use(MenuContext)

  const activate = (event: MouseEvent<HTMLButtonElement>) => {
    close()
    onClick?.(event)
  }

  return (
    <Button
      variant="ghost"
      className="text-[14px]"
      aria-pressed={checked}
      onClick={activate}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      <span className="flex-1 text-left">{children}</span>
      {checked && <Check size={16} strokeWidth={2.5} />}
    </Button>
  )
}
