import { CharacterImage } from '@src/components/character/CharacterImage.tsx'
import { useLabel } from '@src/hooks/useLocale.ts'
import { thumbnailView } from '@src/lib/catalog/camera.ts'
import { partById, partsPile, visibleVariants } from '@src/lib/catalog/index.ts'
import { lookEquals } from '@src/lib/catalog/look.ts'
import type { VariantId } from '@src/lib/catalog/types.ts'
import type { Favorite } from '@src/lib/favorites.ts'
import { builtInFavorites } from '@src/lib/favorites.ts'
import { cn } from '@src/lib/utils.ts'
import { setHand, setLook, setPreview, setVariant, useEditor } from '@src/stores/editor.ts'
import { removeFavorite, useFavorites } from '@src/stores/favorites.ts'
import { Button } from '@src/ui/Button.tsx'
import { useTranslation } from 'react-i18next'

const CARD =
  'border-stroke shadow-hard bg-card flex w-[84px] shrink-0 cursor-pointer flex-col items-center gap-1 rounded-2xl p-1.5 text-[11px] font-bold'

export function LabPanel() {
  const { t } = useTranslation()
  const label = useLabel()
  const hand = useEditor((state) => state.hand)
  const look = useEditor((state) => state.look)
  const favorites = useFavorites((state) => state.favorites)
  const part = hand.kind === 'variants' ? partById[hand.part] : null

  return (
    <div className="absolute inset-x-6 bottom-4 flex flex-col gap-3">
      {hand.kind === 'favorites' && (
        <div className="flex gap-3 overflow-x-auto p-3" onPointerLeave={() => setPreview(null)}>
          {[...favorites, ...builtInFavorites].map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              selected={lookEquals(favorite.look, look)}
              removable={!builtInFavorites.includes(favorite)}
            />
          ))}
        </div>
      )}
      {part && (
        <div className="flex gap-3 overflow-x-auto p-3" onPointerLeave={() => setPreview(null)}>
          {visibleVariants(part).map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setVariant(part.id, variant.id as VariantId)}
              onPointerEnter={() => setPreview({ [part.id]: variant.id })}
              className={cn(CARD, look[part.id] === variant.id && 'bg-accent')}
            >
              <CharacterImage
                look={{ ...look, [part.id]: variant.id }}
                view={thumbnailView(variant)}
                className="border-border aspect-4/5 w-full rounded-lg border-2"
              />
              {label(variant)}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {partsPile.map((pilePart) => (
          <Button
            key={pilePart.id}
            className={cn(part?.id === pilePart.id && 'bg-accent')}
            onClick={() => setHand({ kind: 'variants', part: pilePart.id })}
          >
            {label(pilePart)}
          </Button>
        ))}
        <Button
          className={cn(hand.kind === 'favorites' && 'bg-accent')}
          onClick={() => setHand({ kind: 'favorites' })}
        >
          {t('favorites')}
        </Button>
        <Button onClick={() => setHand({ kind: 'none' })}>{t('whole_character')}</Button>
      </div>
    </div>
  )
}

type FavoriteCardProps = {
  favorite: Favorite
  selected: boolean
  removable: boolean
}

function FavoriteCard({ favorite, selected, removable }: FavoriteCardProps) {
  const { t } = useTranslation()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setLook(favorite.look)}
        onPointerEnter={() => setPreview(favorite.look)}
        className={cn(CARD, selected && 'bg-accent')}
      >
        <CharacterImage
          look={favorite.look}
          className="border-border aspect-4/5 w-full rounded-lg border-2"
        />
      </button>
      {removable && (
        <button
          type="button"
          aria-label={t('favorite_remove')}
          onClick={() => removeFavorite(favorite.id)}
          className="border-stroke bg-card absolute -top-2.5 -right-2.5 size-7 cursor-pointer rounded-full text-xs font-bold"
        >
          ✕
        </button>
      )}
    </div>
  )
}
