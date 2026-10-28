import { cn } from '@src/lib/utils.ts'
import type { ComponentProps } from 'react'

export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'bg-foreground text-background inline-flex items-center rounded-full px-[9px] py-[3px] text-xs font-bold tracking-[0.04em]',
        className,
      )}
      {...props}
    />
  )
}
