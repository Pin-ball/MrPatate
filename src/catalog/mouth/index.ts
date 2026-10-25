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
  icon: '/assets/icons/mouth.svg',
  variants: [
    {
      id: 'happy',
      label: 'Bouche standard',
      icon: '/assets/icons/mouth/happy.svg',
      layers: [{ z: 5, Component: MouthHappy, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'drool',
      label: 'Bouche baveuse',
      icon: '/assets/icons/mouth/drool.svg',
      layers: [{ z: 5, Component: MouthDrool, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'big-tooth',
      label: 'Bouche à grosse dent',
      icon: '/assets/icons/mouth/big-tooth.svg',
      layers: [{ z: 5, Component: MouthBigTooth, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'sad',
      label: 'Bouche triste',
      icon: '/assets/icons/mouth/sad.svg',
      layers: [{ z: 5, Component: MouthSad, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'closed',
      label: 'Bouche fermée',
      icon: '/assets/icons/mouth/closed.svg',
      layers: [{ z: 5, Component: MouthClosed, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'zip',
      label: 'Bouche zippée',
      icon: '/assets/icons/mouth/zip.svg',
      layers: [{ z: 5, Component: MouthZip, parallax: { x: 2, y: 1 } }],
    },
  ],
}
