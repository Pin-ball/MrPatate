import type { Part } from '@src/catalog/types.ts'
import { ArmLeftBasic } from './ArmLeftBasic.tsx'
import { ArmLeftClub } from './ArmLeftClub.tsx'
import { ArmRightBasic } from './ArmRightBasic.tsx'

export const arms: Part = {
  id: 'arms',
  label: 'Bras',
  variants: [
    {
      id: 'basic',
      label: 'Bras standard',
      layers: [
        { z: 3, Component: ArmRightBasic, parallax: { x: 0.5, y: 1 } },
        { z: 5, Component: ArmLeftBasic, parallax: { x: 2, y: 1 } },
      ],
    },
    {
      id: 'club',
      label: 'Bras massue',
      layers: [
        { z: 3, Component: ArmRightBasic, parallax: { x: 0.5, y: 1 } },
        { z: 5, Component: ArmLeftClub, parallax: { x: 2, y: 1 } },
      ],
    },
  ],
}
