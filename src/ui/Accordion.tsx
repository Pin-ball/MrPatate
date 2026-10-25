import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown, PersonStanding } from 'lucide-react'
import type { ReactNode } from 'react'
import { createContext, use, useState } from 'react'

type AccordionContextValue = {
  openValue: string
  setOpenValue: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

type AccordionProps = {
  defaultValue: string
  children: ReactNode
}

export function Accordion({ defaultValue, children }: AccordionProps) {
  const [openValue, setOpenValue] = useState(defaultValue)

  return (
    <div className="flex min-h-0 grow flex-col gap-2">
      <AccordionContext value={{ openValue, setOpenValue }}>{children}</AccordionContext>
    </div>
  )
}

type AccordionPanelProps = {
  value: string
  title: ReactNode
  icon?: LucideIcon
  children: ReactNode
}

export function AccordionPanel({
  value,
  title,
  icon: Icon = PersonStanding,
  children,
}: AccordionPanelProps) {
  const context = use(AccordionContext)
  if (!context) throw new Error('AccordionPanel must be used within Accordion')

  const expanded = context.openValue === value

  return (
    <section
      className={clsx(
        'border-border bg-surface flex h-14 shrink-0 flex-col overflow-hidden rounded-lg border px-4 duration-200',
        expanded && 'grow',
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => context.setOpenValue(value)}
        className="flex cursor-pointer items-center py-2 text-left"
      >
        <Icon aria-hidden="true" className="text-accent m-2 mr-8 size-6" />
        <span className="grow">{title}</span>
        <ChevronDown
          aria-hidden="true"
          className={clsx(
            'relative ml-4 size-3 transition-all duration-200',
            expanded ? 'top-3 opacity-0' : 'top-0',
          )}
        />
      </button>

      <div className={clsx('py-2', expanded && 'grow overflow-hidden')}>{children}</div>
    </section>
  )
}
