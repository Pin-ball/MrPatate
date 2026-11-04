import type { Preset } from '@src/lib/catalog/types.ts'

export const presets = [
  {
    id: 'caveman',
    look: {
      mouth: 'big-tooth',
      eyes: 'bottom',
      arms: 'club',
    },
  },
  {
    id: 'superhero',
    look: {
      eyes: 'hero',
      back: 'hero-cape',
    },
  },
] as const satisfies Preset[]
