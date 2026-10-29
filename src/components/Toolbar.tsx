import { useFavoriteActions } from '@src/hooks/useFavoriteActions.ts'
import { cn } from '@src/lib/utils.ts'
import { randomizeLook, redo, undo, useHistory } from '@src/stores/editor.ts'
import { showToast } from '@src/stores/toast.ts'
import { IconButton } from '@src/ui/IconButton.tsx'
import { useHotkey } from '@tanstack/react-hotkeys'
import { Dices, Redo2, Star, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ICON_SIZE = 22

export function Toolbar() {
  const { t } = useTranslation()
  const { canUndo, canRedo } = useHistory()
  const { currentFavorite, add, remove } = useFavoriteActions()

  const randomize = () => {
    randomizeLook()
    showToast(t('toast.random_look'), { label: t('toolbar.undo'), onClick: undo })
  }

  const toggleFavorite = () => (currentFavorite ? remove(currentFavorite) : add())

  useHotkey('Mod+Z', undo)
  useHotkey('Mod+Shift+Z', redo)
  useHotkey('Mod+Y', redo)
  useHotkey('R', randomize)
  useHotkey('F', toggleFavorite)

  return (
    <fieldset className="border-stroke bg-card shadow-hard flex h-12 items-center gap-1 rounded-full px-[5px]">
      <legend className="sr-only">{t('toolbar.label')}</legend>
      <IconButton
        variant="ghost"
        label={t('toolbar.undo')}
        hotkey="Mod+Z"
        disabled={!canUndo}
        onClick={undo}
      >
        <Undo2 size={ICON_SIZE} />
      </IconButton>
      <IconButton
        variant="ghost"
        label={t('toolbar.redo')}
        hotkey="Mod+Shift+Z"
        disabled={!canRedo}
        onClick={redo}
      >
        <Redo2 size={ICON_SIZE} />
      </IconButton>
      <span className="bg-divider mx-[5px] h-5 w-0.5 rounded-full" />
      <IconButton variant="ghost" label={t('toolbar.random_look')} hotkey="R" onClick={randomize}>
        <Dices size={ICON_SIZE} />
      </IconButton>
      <IconButton
        variant="ghost"
        label={t(currentFavorite ? 'favorites.in' : 'favorites.add')}
        hotkey="F"
        aria-pressed={Boolean(currentFavorite)}
        onClick={toggleFavorite}
      >
        <Star size={ICON_SIZE} className={cn(currentFavorite && 'fill-accent')} />
      </IconButton>
    </fieldset>
  )
}
