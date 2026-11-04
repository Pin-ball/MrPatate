import { CharacterImage } from '@src/components/character/CharacterImage.tsx'
import { frameView } from '@src/lib/catalog/camera.ts'
import type { Favorite } from '@src/lib/favorites.ts'
import type { CardLayout } from '@src/lib/hand/cards.ts'
import { cn } from '@src/lib/utils.ts'
import { useTranslation } from 'react-i18next'
import { HandCard } from './HandCard.tsx'

const PORTRAIT_ZOOM = 1.05
const PORTRAIT_RATIO = 11 / 9
const PORTRAIT_VIEW = frameView(PORTRAIT_ZOOM, PORTRAIT_RATIO)

type FavoriteCardProps = {
  favorite: Favorite
  position: number
  chosen: boolean
  isDefault: boolean
  removable: boolean
  layout: CardLayout
  onClick: () => void
  onPointerEnter: () => void
  onFocus: () => void
  onRemove: () => void
}

export function FavoriteCard({
  favorite,
  position,
  chosen,
  isDefault,
  removable,
  layout,
  onClick,
  onPointerEnter,
  onFocus,
  onRemove,
}: FavoriteCardProps) {
  const { t } = useTranslation()

  return (
    <HandCard
      layout={layout}
      className={cn(chosen && 'bg-accent')}
      aria-label={isDefault ? t('favorites.apply_default') : t('favorites.apply', { position })}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      corner={
        removable &&
        !layout.state.inPile && (
          <button
            type="button"
            aria-label={t('favorites.remove', { position })}
            onClick={onRemove}
            onFocus={onFocus}
            className="border-foreground bg-card hover:bg-primary absolute -top-[11px] -right-[11px] flex size-7 cursor-pointer items-center justify-center rounded-full border-2 text-[13px] font-bold opacity-0 transition-[opacity,background-color] duration-(--duration-short) group-hover:opacity-100 focus-visible:opacity-100"
          >
            ✕
          </button>
        )
      }
    >
      <span
        style={{ aspectRatio: 1 / PORTRAIT_RATIO }}
        className="border-foreground w-(--card-picture) shrink-0 overflow-hidden rounded-[10px] border-2"
      >
        <CharacterImage look={favorite.look} view={PORTRAIT_VIEW} className="block size-full" />
      </span>
      <span className="text-muted-foreground h-lh w-full truncate text-xs font-medium">
        {favorite.name}
      </span>
    </HandCard>
  )
}
