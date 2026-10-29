import { lookEquals } from '@src/lib/catalog/look.ts'
import type { Favorite } from '@src/lib/favorites.ts'
import { findFavorite } from '@src/lib/favorites.ts'
import { setLook, undo, useEditor } from '@src/stores/editor.ts'
import {
  addFavorite,
  removeFavorite,
  restoreFavorite,
  useFavorites,
} from '@src/stores/favorites.ts'
import { showToast } from '@src/stores/toast.ts'
import { useTranslation } from 'react-i18next'

export function useFavoriteActions() {
  const { t } = useTranslation()
  const look = useEditor((state) => state.look)
  const favorites = useFavorites((state) => state.favorites)
  const currentFavorite = findFavorite(favorites, look)

  const add = () => {
    if (currentFavorite) return
    addFavorite(look)
    showToast(t('toast.favorite_added'))
  }

  const remove = (favorite: Favorite) => {
    const removal = removeFavorite(favorite.id)
    if (!removal) return showToast(t('toast.favorite_built_in'))
    showToast(t('toast.favorite_removed'), {
      label: t('toolbar.undo'),
      onClick: () => restoreFavorite(removal),
    })
  }

  const apply = (favorite: Favorite) => {
    if (lookEquals(favorite.look, look)) return
    setLook(favorite.look)
    showToast(t('toast.favorite_applied'), { label: t('toolbar.undo'), onClick: undo })
  }

  return { currentFavorite, add, remove, apply }
}
