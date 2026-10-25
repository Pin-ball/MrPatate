import type { Part } from '@src/catalog/types.ts'
import { BackHeroCape } from './BackHeroCape.tsx'

export const back: Part = {
  id: 'back',
  label: 'Dos',
  icon: '/assets/icons/back.svg',
  variants: [
    {
      id: 'none',
      label: 'Rien de spécial',
      icon: '/assets/icons/none.svg',
      layers: [],
    },
    {
      id: 'hero-cape',
      label: 'Cape de super-héros',
      icon: '/assets/icons/back/hero-cape.svg',
      layers: [{ z: 5, Component: BackHeroCape, parallax: { x: 1, y: 1 } }],
    },
  ],
}
