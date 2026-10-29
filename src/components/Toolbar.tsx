import { findFavorite } from '@src/lib/favorites.ts'
import { cn } from '@src/lib/utils.ts'
import { randomizeLook, redo, undo, useEditor, useHistory } from '@src/stores/editor.ts'
import {
  addFavorite,
  removeFavorite,
  restoreFavorite,
  useFavorites,
} from '@src/stores/favorites.ts'
import { showToast } from '@src/stores/toast.ts'
import { IconButton } from '@src/ui/IconButton.tsx'
import { Dices, Redo2, Star, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ICON_SIZE = 22

export function Toolbar() {
  const { t } = useTranslation()
  const { canUndo, canRedo } = useHistory()
  const look = useEditor((state) => state.look)
  const favorites = useFavorites((state) => state.favorites)
  const favorite = findFavorite(favorites, look)

  const surprise = () => {
    randomizeLook()
    showToast(t('toast_random_look'), { label: t('undo'), onClick: undo })
  }

  const toggleFavorite = () => {
    if (!favorite) {
      addFavorite(look)
      return showToast(t('toast_favorite_added'))
    }
    const removal = removeFavorite(favorite.id)
    if (!removal) return showToast(t('toast_favorite_built_in'))
    showToast(t('toast_favorite_removed'), {
      label: t('undo'),
      onClick: () => restoreFavorite(removal),
    })
  }

  return (
    <fieldset className="border-stroke bg-card shadow-hard flex h-12 items-center gap-1 rounded-full px-[5px]">
      <legend className="sr-only">{t('actions')}</legend>
      <IconButton variant="ghost" label={t('undo')} disabled={!canUndo} onClick={undo}>
        <Undo2 size={ICON_SIZE} />
      </IconButton>
      <IconButton variant="ghost" label={t('redo')} disabled={!canRedo} onClick={redo}>
        <Redo2 size={ICON_SIZE} />
      </IconButton>
      <span className="bg-divider mx-[5px] h-5 w-0.5 rounded-full" />
      <IconButton variant="ghost" label={t('surprise')} onClick={surprise}>
        <Dices size={ICON_SIZE} />
      </IconButton>
      <IconButton
        variant="ghost"
        label={t(favorite ? 'favorite_kept' : 'favorite_add')}
        aria-pressed={Boolean(favorite)}
        onClick={toggleFavorite}
      >
        <Star size={ICON_SIZE} className={cn(favorite && 'fill-accent')} />
      </IconButton>
    </fieldset>
  )
}
