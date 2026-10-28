import type { Part } from '@src/catalog/types.ts'
import { MouthBigTooth } from './MouthBigTooth.tsx'
import { MouthClosed } from './MouthClosed.tsx'
import { MouthDrool } from './MouthDrool.tsx'
import { MouthHappy } from './MouthHappy.tsx'
import { MouthSad } from './MouthSad.tsx'
import { MouthZip } from './MouthZip.tsx'

export const mouth: Part = {
  id: 'mouth',
  label: 'Bouche',
  variants: [
    {
      id: 'happy',
      label: 'Bouche standard',
      layers: [{ z: 5, Component: MouthHappy, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'drool',
      label: 'Bouche baveuse',
      layers: [{ z: 5, Component: MouthDrool, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'big-tooth',
      label: 'Bouche à grosse dent',
      layers: [{ z: 5, Component: MouthBigTooth, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'sad',
      label: 'Bouche triste',
      layers: [{ z: 5, Component: MouthSad, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'closed',
      label: 'Bouche fermée',
      layers: [{ z: 5, Component: MouthClosed, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'zip',
      label: 'Bouche zippée',
      layers: [{ z: 5, Component: MouthZip, parallax: { x: 2, y: 1 } }],
    },
  ],
}
