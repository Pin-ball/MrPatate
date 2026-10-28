import { cn } from '@src/lib/utils.ts'
import type { ComponentProps } from 'react'

export function Pill({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'border-stroke bg-card text-card-foreground shadow-hard flex h-11 items-center gap-2.5 rounded-full px-[18px] whitespace-nowrap',
        className,
      )}
      {...props}
    />
  )
}
