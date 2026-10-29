import { Button } from '@src/ui/Button.tsx'
import { MenuContext } from '@src/ui/MenuContext.ts'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

type MenuProps = Omit<ComponentProps<typeof Button>, 'children' | 'onClick' | 'ref'> & {
  trigger: ReactNode
  children: ReactNode
}

export function Menu({ trigger, children, ...buttonProps }: MenuProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      button.current?.focus()
    }
    const listeners = new AbortController()
    document.addEventListener('pointerdown', closeOutside, listeners)
    document.addEventListener('keydown', closeOnEscape, listeners)
    return () => listeners.abort()
  }, [open])

  const close = () => {
    setOpen(false)
    button.current?.focus()
  }

  return (
    <div ref={root} className="relative">
      <Button ref={button} aria-expanded={open} onClick={() => setOpen(!open)} {...buttonProps}>
        {trigger}
      </Button>
      {open && (
        <div className="border-stroke bg-popover text-popover-foreground shadow-hard-lg animate-fade-in absolute top-[calc(100%+10px)] right-0 z-40 flex min-w-[220px] flex-col rounded-xl p-1.5">
          <MenuContext value={close}>{children}</MenuContext>
        </div>
      )}
    </div>
  )
}
