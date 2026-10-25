import type { ReactNode } from 'react'

type PopoverProps = {
  title: string
  children: ReactNode
}

export function Popover({ title, children }: PopoverProps) {
  return (
    <div className="border-border bg-surface absolute top-16 right-0 rounded-lg border px-4 py-2">
      <div className="text-muted mb-4 text-sm font-extralight">{title}</div>
      {children}
    </div>
  )
}
