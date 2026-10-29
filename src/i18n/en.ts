import type { fr } from './fr.ts'

export const en = {
  app_title: 'Mr Patate',
  language: 'Language',
  actions: 'Actions',
  undo: 'Undo',
  redo: 'Redo',
  surprise: 'Surprise: a random Pierre',
  favorites: 'Favorites',
  favorite_add: 'Add to Favorites',
  favorite_remove: 'Remove from Favorites',
  share: 'Share',
  share_copy_link: 'Copy link',
  share_download_png: 'Download PNG',
  share_download_svg: 'Download SVG',
  random_variant: 'Random variant',
  back_to_parts: 'Parts',
  preview: 'trying',
  toast_favorite_removed: 'Removed from Favorites',
  character: 'Pierre',
  whole_character: 'Whole Pierre',
} satisfies Record<keyof typeof fr, string>
