import type { Part } from '@src/catalog/types.ts'
import { BackHeroCape } from './BackHeroCape.tsx'

export const back: Part = {
  id: 'back',
  label: 'Dos',
  variants: [
    {
      id: 'none',
      label: 'Rien de spécial',
      layers: [],
    },
    {
      id: 'hero-cape',
      label: 'Cape de super-héros',
      layers: [{ z: 5, Component: BackHeroCape, parallax: { x: 1, y: 1 } }],
    },
  ],
}
