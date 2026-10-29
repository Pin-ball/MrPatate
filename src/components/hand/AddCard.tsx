import { cn } from '@src/lib/utils.ts'
import { Check, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { CardLayout } from './HandCard.tsx'
import { HandCard } from './HandCard.tsx'

type AddCardProps = {
  added: boolean
  layout: CardLayout
  onClick: () => void
  onPointerEnter: () => void
  onFocus: () => void
}

export function AddCard({ added, layout, onClick, onPointerEnter, onFocus }: AddCardProps) {
  const { t } = useTranslation()
  const Icon = added ? Check : Plus

  return (
    <HandCard
      layout={layout}
      aria-label={t(added ? 'favorites.in' : 'favorites.add')}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
    >
      <span
        className={cn(
          'border-foreground flex size-[72px] shrink-0 items-center justify-center rounded-[14px] border-2',
          added ? 'bg-accent' : 'bg-background border-dashed',
        )}
      >
        <Icon size={30} strokeWidth={2.5} />
      </span>
      <span className="flex w-full flex-col gap-0.5">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase">
          {t('favorites.add_card.title')}
        </span>
        <span className="text-muted-foreground truncate text-xs font-medium">
          {t(added ? 'favorites.add_card.done' : 'favorites.add_card.look')}
        </span>
      </span>
    </HandCard>
  )
}
