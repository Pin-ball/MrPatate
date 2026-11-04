import type { CardLayout } from '@src/lib/hand/cards.ts'
import { Dices } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { HandCard } from './HandCard.tsx'

type RandomCardProps = {
  layout: CardLayout
  onClick: () => void
  onPointerEnter: () => void
  onFocus: () => void
}

export function RandomCard({ layout, onClick, onPointerEnter, onFocus }: RandomCardProps) {
  const { t } = useTranslation()

  return (
    <HandCard
      layout={layout}
      aria-label={t('variants.random')}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
    >
      <span className="border-foreground bg-background flex size-(--card-picture) shrink-0 items-center justify-center rounded-[14px] border-2 border-dashed">
        <Dices size={30} strokeWidth={2.25} />
      </span>
      <span className="w-full truncate text-xs font-bold">{t('variants.random_card')}</span>
    </HandCard>
  )
}
