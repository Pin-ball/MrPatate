import type { PartConfig } from '@src/lib/catalog/types.ts'

export const partConfigs = {
  body: {
    label: { fr: 'Corps', en: 'Body' },
    default: 'basic',
  },
  eyes: {
    label: { fr: 'Yeux', en: 'Eyes' },
    default: 'basic',
  },
  mouth: {
    label: { fr: 'Bouche', en: 'Mouth' },
    default: 'happy',
  },
  background: {
    label: { fr: 'Fond', en: 'Background' },
    default: 'cream',
  },
  skin: {
    label: { fr: 'Couleur', en: 'Color' },
    default: 'pierre',
  },
  arms: {
    label: { fr: 'Bras', en: 'Arms' },
    default: 'basic',
  },
  back: {
    label: { fr: 'Dos', en: 'Back' },
    default: 'none',
  },
  legs: {
    label: { fr: 'Jambes', en: 'Legs' },
    default: 'basic',
  },
} satisfies Record<string, PartConfig>

export const partsPile = [
  'skin',
  'eyes',
  'mouth',
  'arms',
  'back',
  'legs',
  'background',
] satisfies (keyof typeof partConfigs)[]
