import { VariantThumbnail } from '@src/components/character/VariantThumbnail.tsx'
import { useLabel } from '@src/hooks/useLocale.ts'
import type { Look, Part, Variant } from '@src/lib/catalog/types.ts'
import type { CardLayout } from '@src/lib/hand.ts'
import { cn } from '@src/lib/utils.ts'
import { HandCard } from './HandCard.tsx'

type VariantCardProps = {
  look: Look
  part: Part
  variant: Variant
  selected: boolean
  layout: CardLayout
  onPointerEnter: () => void
  onFocus: () => void
  onClick: () => void
}

export function VariantCard({
  look,
  part,
  variant,
  selected,
  layout,
  onPointerEnter,
  onFocus,
  onClick,
}: VariantCardProps) {
  const label = useLabel()

  return (
    <HandCard
      layout={layout}
      className={cn(selected && 'bg-accent')}
      aria-pressed={selected}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      onClick={onClick}
    >
      <VariantThumbnail look={look} part={part} variant={variant} />
      <span className="line-clamp-2 w-full text-xs font-bold">{label(variant)}</span>
    </HandCard>
  )
}
