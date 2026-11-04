import type { fr } from './fr.ts'

export const en = {
  app: {
    title: 'Kayoo',
    character: 'Pierre',
    language: 'Language: {{language}}',
  },
  history: {
    undo: 'Undo',
    redo: 'Redo',
  },
  toolbar: {
    label: 'Actions',
  },
  look: {
    random: 'Random look',
    random_done: 'New look',
    preview: 'trying',
  },
  parallax: {
    ask: 'Turn on the depth effect by tilting your phone?',
    enable: 'Enable',
  },
  share: {
    label: 'Share',
    copy_link: 'Copy link',
    download_png: 'Download PNG',
    download_svg: 'Download SVG',
    native: 'Share',
    link_copied: 'Link copied',
    link_not_copied: "Couldn't copy the link",
    link_incomplete: 'Part of the link is unknown, defaults used',
    png_downloaded: 'PNG downloaded',
    svg_downloaded: 'SVG downloaded',
  },
  pile: {
    unfold: 'Unfold: {{name}}',
    fold: 'Fold: {{name}}',
  },
  hand: {
    scroll_hint: 'Scroll or drag to see more',
    close: 'Close: {{name}}',
  },
  parts: {
    label: 'Appearance',
    card_one: '{{part}}: {{variant}}, {{count}} choice',
    card_other: '{{part}}: {{variant}}, {{count}} choices',
  },
  variants: {
    label: 'Choices: {{part}}',
    random: 'Random choice',
    random_card: 'Random',
  },
  favorites: {
    label: 'Favorites',
    count: 'Favorites · {{count}}',
    add: 'Add to Favorites',
    in: 'In Favorites',
    add_card: {
      title: 'Add',
      look: 'this look',
      done: 'already added',
    },
    apply: 'Choose Favorite {{position}}',
    apply_default: 'Choose the default look',
    remove: 'Remove Favorite {{position}}',
    added: 'Added to Favorites',
    removed: 'Removed from Favorites',
    built_in: "This Favorite can't be removed",
    applied: 'Favorite chosen',
  },
} satisfies typeof fr
