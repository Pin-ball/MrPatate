import { cn } from '@src/lib/utils.ts'

type ToastProps = {
  message: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function Toast({ message, action, className }: ToastProps) {
  return (
    <div
      role="status"
      className={cn(
        'animate-fade-in bg-foreground text-background flex items-center justify-between gap-2 rounded-md px-3 py-2 text-[13px] font-medium',
        className,
      )}
    >
      <span>{message}</span>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="-my-2 min-h-8 cursor-pointer px-1 font-bold underline underline-offset-3"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
