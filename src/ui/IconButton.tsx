import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

type IconButtonProps = {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick: () => void
}

export function IconButton({ icon: Icon, label, active = false, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={clsx(
        'cursor-pointer rounded-full p-2 transition-all active:scale-90',
        active ? 'bg-accent' : 'bg-surface-raised hover:bg-accent',
      )}
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  )
}
