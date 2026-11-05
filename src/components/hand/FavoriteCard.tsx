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
const WIGGLE_PHASES = [
  '[animation-delay:0ms]',
  '[animation-delay:calc(var(--duration-wiggle)*-0.67)]',
  '[animation-delay:calc(var(--duration-wiggle)*-1.33)]',
]

type FavoriteCardProps = {
  favorite: Favorite
  position: number
  chosen: boolean
  isDefault: boolean
  removable: boolean
  removeMode: boolean
  layout: CardLayout
  onClick: () => void
  onPointerEnter: () => void
  onFocus: () => void
  onRemove: () => void
  onEnterRemoveMode: () => void
  onExitRemoveMode: () => void
}

export function FavoriteCard({
  favorite,
  position,
  chosen,
  isDefault,
  removable,
  removeMode,
  layout,
  onClick,
  onPointerEnter,
  onFocus,
  onRemove,
  onEnterRemoveMode,
  onExitRemoveMode,
}: FavoriteCardProps) {
  const { t } = useTranslation()
  const removableInHand = removable && !layout.state.inPile
  const wiggling = removeMode && removableInHand

  return (
    <HandCard
      data-favorite
      layout={layout}
      className={cn(
        chosen && 'bg-accent',
        wiggling && ['card-wiggle', WIGGLE_PHASES[position % WIGGLE_PHASES.length]],
      )}
      aria-label={isDefault ? t('favorites.apply_default') : t('favorites.apply', { position })}
      onClick={removeMode ? onExitRemoveMode : onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      onLongPress={removableInHand ? onEnterRemoveMode : undefined}
      corner={
        removableInHand && (
          <button
            data-favorite
            type="button"
            aria-label={t('favorites.remove', { position })}
            onClick={onRemove}
            onFocus={onFocus}
            className={cn(
              'border-foreground bg-card hover:bg-primary card-remove absolute -top-[11px] -right-[11px] flex size-7 cursor-pointer items-center justify-center rounded-full border-2 text-[13px] font-bold',
              removeMode && 'card-remove-shown bg-primary',
            )}
          >
            ✕
          </button>
        )
      }
    >
      <span className="border-foreground w-(--card-picture) shrink-0 overflow-hidden rounded-[10px] border-2">
        <CharacterImage look={favorite.look} view={PORTRAIT_VIEW} className="block h-auto w-full" />
      </span>
      <span className="text-muted-foreground h-lh w-full truncate text-xs font-medium">
        {favorite.name}
      </span>
    </HandCard>
  )
}
