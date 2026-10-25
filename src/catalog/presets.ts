import type { Preset } from '@src/catalog/types.ts'

export const presets: Preset[] = [
  {
    id: 'basic',
    label: 'Normal',
    icon: '/assets/icons/body/basic.svg',
    look: {},
  },
  {
    id: 'caveman',
    label: 'Homme des cavernes',
    icon: '/assets/icons/arms/club.svg',
    look: {
      mouth: 'big-tooth',
      eyes: 'bottom',
      arms: 'club',
    },
  },
  {
    id: 'superhero',
    label: 'Super-héros',
    icon: '/assets/icons/back/hero-cape.svg',
    look: {
      eyes: 'hero',
      back: 'hero-cape',
    },
  },
]
