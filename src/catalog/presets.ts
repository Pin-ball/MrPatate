import type { Preset } from '@src/lib/catalog/types.ts'

export const presets = [
  {
    id: 'caveman',
    name: 'Silex',
    look: {
      mouth: 'big-tooth',
      eyes: 'bottom',
      arms: 'club',
    },
  },
  {
    id: 'superhero',
    name: 'Captain',
    look: {
      eyes: 'hero',
      back: 'hero-cape',
    },
  },
  {
    id: 'default',
    name: 'Original',
    look: {},
  },
] as const satisfies Preset[]
