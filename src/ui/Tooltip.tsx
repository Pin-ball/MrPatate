import type { ReactNode } from 'react'

type TooltipProps = {
  label: string
  keys?: string[] | undefined
  children: ReactNode
}

export function Tooltip({ label, keys, children }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        aria-hidden
        className="bg-foreground text-background pointer-events-none absolute top-[calc(100%+20px)] left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover/tooltip:opacity-100 group-hover/tooltip:delay-400 group-has-focus-visible/tooltip:opacity-100"
      >
        {label}
        {keys && (
          <span className="flex gap-0.5">
            {keys.map((key) => (
              <kbd
                key={key}
                className="bg-background/20 rounded-sm px-1 font-sans text-[11px] font-bold"
              >
                {key}
              </kbd>
            ))}
          </span>
        )}
      </span>
    </span>
  )
}
