import { VariantThumbnail } from '@src/components/character/VariantThumbnail.tsx'
import { useLabel } from '@src/hooks/useLocale.ts'
import { findVariant, visibleVariants } from '@src/lib/catalog/index.ts'
import type { Look, Part } from '@src/lib/catalog/types.ts'
import { useTranslation } from 'react-i18next'
import type { CardLayout } from './HandCard.tsx'
import { HandCard } from './HandCard.tsx'

type PartCardProps = {
  part: Part
  look: Look
  layout: CardLayout
  open: boolean
  onClick: () => void
  onPointerEnter?: (() => void) | undefined
  onFocus: () => void
}

export function PartCard({
  part,
  look,
  layout,
  open,
  onClick,
  onPointerEnter,
  onFocus,
}: PartCardProps) {
  const { t } = useTranslation()
  const label = useLabel()
  const variant = findVariant(part, look[part.id])
  if (!variant) return null
  const count = visibleVariants(part).length

  return (
    <HandCard
      layout={layout}
      aria-label={t('parts.card', { part: label(part), variant: label(variant), count })}
      aria-expanded={open}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      corner={
        <span
          aria-hidden
          className="bg-foreground text-background pointer-events-none absolute -top-2.5 -right-2.5 flex h-[26px] min-w-[26px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold"
        >
          {count}
        </span>
      }
    >
      <VariantThumbnail look={look} part={part} variant={variant} />
      <span className="flex w-full flex-col gap-0.5">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase">{label(part)}</span>
        <span className="text-muted-foreground truncate text-xs font-medium">{label(variant)}</span>
      </span>
    </HandCard>
  )
}
