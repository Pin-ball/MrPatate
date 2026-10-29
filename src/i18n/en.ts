import type { fr } from './fr.ts'

export const en = {
  app_title: 'Mr Patate',
  language: 'Language',
  actions: 'Actions',
  undo: 'Undo',
  redo: 'Redo',
  surprise: 'Surprise: a random Pierre',
  favorite_add: 'Add to Favorites',
  share: 'Share',
  share_copy_link: 'Copy link',
  share_download_png: 'Download PNG',
  share_download_svg: 'Download SVG',
  random_variant: 'Random variant',
  back_to_parts: 'Parts',
  trial: 'trying',
  toast_favorite_removed: 'Removed from Favorites',
  character: 'Pierre',
  whole_character: 'Whole Pierre',
} satisfies Record<keyof typeof fr, string>
