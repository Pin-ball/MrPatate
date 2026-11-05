import { useFavoriteActions } from '@src/hooks/useFavoriteActions.ts'
import { useHandCards } from '@src/hooks/useHandCards.ts'
import { usePile } from '@src/hooks/usePile.ts'
import { lookEquals } from '@src/lib/catalog/look.ts'
import { allFavorites, builtInFavorites, DEFAULT_FAVORITE_ID } from '@src/lib/favorites.ts'
import { setHand, setPreview, useEditor } from '@src/stores/editor.ts'
import { useFavorites } from '@src/stores/favorites.ts'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddCard } from './AddCard.tsx'
import { FavoriteCard } from './FavoriteCard.tsx'
import { Pile } from './Pile.tsx'

const FIRST_FAVORITE_INDEX = 1

export function FavoritesPile() {
  const { t } = useTranslation()
  const userFavorites = useFavorites((state) => state.favorites)
  const favorites = allFavorites(userFavorites)
  const look = useEditor((state) => state.look)
  const { currentFavorite, add, remove, apply } = useFavoriteActions()
  const { cards, chosenIndex, events } = useHandCards(favorites, {
    chosenId: currentFavorite?.id,
    firstIndex: FIRST_FAVORITE_INDEX,
  })
  const count = favorites.length + 1
  const pile = usePile('favorites', { count, openingIndex: chosenIndex, events })
  const { unfolded, held, layoutOf, rendered, reveal, spreadPile } = pile
  const [removeMode, setRemoveMode] = useState(false)
  if (removeMode && (!unfolded || userFavorites.length === 0)) setRemoveMode(false)

  useEffect(() => {
    if (!removeMode) return
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-favorite]')) return
      setRemoveMode(false)
    }
    const listeners = new AbortController()
    addEventListener('click', onClick, listeners)
    return () => listeners.abort()
  }, [removeMode])

  const unfold = () => {
    setHand({ kind: 'favorites' })
  }

  return (
    <Pile
      pile={pile}
      icon={Star}
      label={t('favorites.label')}
      firstIndex={FIRST_FAVORITE_INDEX}
      pileSlotLabel={t(unfolded ? 'pile.fold' : 'pile.unfold', { name: t('favorites.label') })}
      pileLabel={t('favorites.count', { count: favorites.length })}
    >
      {rendered(0) && (
        <AddCard
          added={Boolean(currentFavorite)}
          layout={layoutOf(0, { zIndex: 1, onTop: count === 1 })}
          onClick={unfolded ? add : unfold}
          onPointerEnter={unfolded ? () => setPreview(null) : spreadPile}
          onFocus={() => {
            reveal(0)
            setPreview(null)
          }}
        />
      )}
      {cards.map(({ item: favorite, index }) => {
        if (!rendered(index)) return null
        const chosen = lookEquals(favorite.look, look)
        const showPreview = () => setPreview(chosen ? null : favorite.look)
        return (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            position={index}
            chosen={chosen}
            isDefault={favorite.id === DEFAULT_FAVORITE_ID}
            removable={!builtInFavorites.includes(favorite)}
            removeMode={removeMode}
            layout={layoutOf(index, {
              zIndex: count - index + 1,
              onTop: index === Math.max(held.first, 1),
              id: favorite.id,
            })}
            onClick={unfolded ? () => apply(favorite) : unfold}
            onPointerEnter={unfolded ? showPreview : spreadPile}
            onFocus={() => {
              reveal(index)
              showPreview()
            }}
            onRemove={() => remove(favorite)}
            onEnterRemoveMode={() => setRemoveMode(true)}
            onExitRemoveMode={() => setRemoveMode(false)}
          />
        )
      })}
    </Pile>
  )
}
