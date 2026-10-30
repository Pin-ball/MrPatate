import { useFavoriteActions } from '@src/hooks/useFavoriteActions.ts'
import { usePile } from '@src/hooks/usePile.ts'
import { allFavorites, builtInFavorites, DEFAULT_FAVORITE_ID } from '@src/lib/favorites.ts'
import { setHand, setPreview } from '@src/stores/editor.ts'
import { useFavorites } from '@src/stores/favorites.ts'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AddCard } from './AddCard.tsx'
import { FavoriteCard } from './FavoriteCard.tsx'
import { Pile } from './Pile.tsx'

export function FavoritesPile() {
  const { t } = useTranslation()
  const favorites = allFavorites(useFavorites((state) => state.favorites))
  const { currentFavorite, add, remove, apply } = useFavoriteActions()
  const count = favorites.length + 1
  const pile = usePile(
    'favorites',
    count,
    currentFavorite ? favorites.indexOf(currentFavorite) + 1 : 0,
  )
  const { unfolded, layoutOf, rendered, reveal, spreadPile } = pile

  const unfold = () => {
    setHand({ kind: 'favorites' })
  }

  return (
    <Pile
      pile={pile}
      icon={Star}
      label={t('favorites.label')}
      slotLabel={t(unfolded ? 'favorites.fold' : 'favorites.unfold')}
      pileLabel={t('favorites.count', { count: favorites.length })}
    >
      {rendered(0) && (
        <AddCard
          added={Boolean(currentFavorite)}
          layout={layoutOf(0, { zIndex: 1, top: count === 1 })}
          onClick={unfolded ? add : unfold}
          onPointerEnter={unfolded ? () => setPreview(null) : spreadPile}
          onFocus={() => {
            reveal(0)
            setPreview(null)
          }}
        />
      )}
      {favorites.map((favorite, index) => {
        if (!rendered(index + 1)) return null
        const selected = favorite === currentFavorite
        const preview = () => setPreview(selected ? null : favorite.look)
        return (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            number={index + 1}
            selected={selected}
            isDefault={favorite.id === DEFAULT_FAVORITE_ID}
            removable={!builtInFavorites.includes(favorite)}
            layout={layoutOf(index + 1, { zIndex: count - index, top: index === 0 })}
            onClick={unfolded ? () => apply(favorite) : unfold}
            onPointerEnter={unfolded ? preview : spreadPile}
            onFocus={() => {
              reveal(index + 1)
              preview()
            }}
            onRemove={() => remove(favorite)}
          />
        )
      })}
    </Pile>
  )
}
