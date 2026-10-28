import type { Preset } from '@src/catalog/types.ts'

export const presets: Preset[] = [
  {
    id: 'basic',
    label: 'Normal',
    look: {},
  },
  {
    id: 'caveman',
    label: 'Homme des cavernes',
    look: {
      mouth: 'big-tooth',
      eyes: 'bottom',
      arms: 'club',
    },
  },
  {
    id: 'superhero',
    label: 'Super-héros',
    look: {
      eyes: 'hero',
      back: 'hero-cape',
    },
  },
]
