import type { Part } from '@src/catalog/types.ts'
import { LegLeftBasic } from './LegLeftBasic.tsx'
import { LegRightBasic } from './LegRightBasic.tsx'

export const legs: Part = {
  id: 'legs',
  label: 'Jambes',
  variants: [
    {
      id: 'basic',
      label: 'Jambes standard',
      layers: [
        { z: 3, Component: LegRightBasic, parallax: { x: 1, y: 1 } },
        { z: 5, Component: LegLeftBasic, parallax: { x: 2, y: 1 } },
      ],
    },
  ],
}
