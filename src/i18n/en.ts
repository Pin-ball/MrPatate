import type { fr } from './fr.ts'

export const en = {
  app: {
    title: 'Mr Patate',
    character: 'Pierre',
    language: 'Language: {{language}}',
  },
  toolbar: {
    label: 'Actions',
    undo: 'Undo',
    redo: 'Redo',
    random_look: 'Surprise: a random Pierre',
  },
  share: {
    label: 'Share',
    copy_link: 'Copy link',
    download_png: 'Download PNG',
    download_svg: 'Download SVG',
    native: 'Share via…',
  },
  scene: {
    preview: 'trying',
  },
  parts: {
    label: 'Parts',
    unfold: 'Unfold the Parts',
    fold: 'Fold the Parts back into their slot',
    card: '{{part}}: {{variant}}, {{count}} variants',
  },
  variants: {
    label: 'Variants: {{part}}',
    random: 'Random variant',
    back_to_parts: 'Parts',
  },
  favorites: {
    label: 'Favorites',
    count: 'Favorites · {{count}}',
    unfold: 'Unfold the Favorites',
    fold: 'Fold the Favorites back into their slot',
    add: 'Add to Favorites',
    in: 'In Favorites',
    add_card: {
      title: 'Add',
      look: 'this look',
      done: 'already added',
    },
    current: 'worn',
    default: 'default',
    apply: 'Wear Favorite {{n}}',
    apply_default: 'Wear the default Pierre',
    remove: 'Remove Favorite {{n}} from Favorites',
  },
  toast: {
    random_look: 'New random look',
    link_copied: 'Link copied',
    link_not_copied: "Couldn't copy the link",
    link_incomplete: 'Unknown variants replaced by defaults',
    png_downloaded: 'PNG downloaded',
    svg_downloaded: 'SVG downloaded',
    favorite_added: 'Added to Favorites',
    favorite_removed: 'Removed from Favorites',
    favorite_built_in: "This favorite can't be removed",
    favorite_applied: 'Favorite worn',
  },
} satisfies typeof fr
