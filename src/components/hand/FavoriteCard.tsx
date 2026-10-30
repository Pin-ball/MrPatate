import { CharacterImage } from '@src/components/character/CharacterImage.tsx'
import { frameView } from '@src/lib/catalog/camera.ts'
import type { Favorite } from '@src/lib/favorites.ts'
import type { CardLayout } from '@src/lib/hand.ts'
import { cn } from '@src/lib/utils.ts'
import { useTranslation } from 'react-i18next'
import { HandCard } from './HandCard.tsx'

const PORTRAIT_WIDTH = 72
const PORTRAIT_HEIGHT = 88
const PORTRAIT_ZOOM = 1.05
const PORTRAIT_VIEW = frameView(PORTRAIT_ZOOM, PORTRAIT_HEIGHT / PORTRAIT_WIDTH)

type FavoriteCardProps = {
  favorite: Favorite
  number: number
  selected: boolean
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
  number,
  selected,
  isDefault,
  removable,
  layout,
  onClick,
  onPointerEnter,
  onFocus,
  onRemove,
}: FavoriteCardProps) {
  const { t } = useTranslation()
  const caption = selected ? t('favorites.current') : isDefault ? t('favorites.default') : ''

  return (
    <HandCard
      layout={layout}
      className={cn(selected && 'bg-accent')}
      aria-label={isDefault ? t('favorites.apply_default') : t('favorites.apply', { n: number })}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      corner={
        removable &&
        !layout.folded && (
          <button
            type="button"
            aria-label={t('favorites.remove', { n: number })}
            onClick={onRemove}
            onFocus={onFocus}
            className="border-foreground bg-card hover:bg-primary absolute -top-[11px] -right-[11px] flex size-7 cursor-pointer items-center justify-center rounded-full border-2 text-[13px] font-bold opacity-0 transition-[opacity,background-color] duration-150 group-hover:opacity-100 focus-visible:opacity-100"
          >
            ✕
          </button>
        )
      }
    >
      <span
        style={{ width: PORTRAIT_WIDTH, height: PORTRAIT_HEIGHT }}
        className="border-foreground shrink-0 overflow-hidden rounded-[10px] border-2"
      >
        <CharacterImage look={favorite.look} view={PORTRAIT_VIEW} className="block size-full" />
      </span>
      <span className="text-muted-foreground h-[1.1em] text-xs font-medium">{caption}</span>
    </HandCard>
  )
}
