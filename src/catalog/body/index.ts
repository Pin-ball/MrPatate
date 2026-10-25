import type { Part } from '@src/catalog/types.ts'
import { BodyBasic } from './BodyBasic.tsx'

export const body: Part = {
  id: 'body',
  label: 'Corps',
  icon: '/assets/icons/body.svg',
  variants: [
    {
      id: 'basic',
      label: 'Corps standard',
      icon: '/assets/icons/body/basic.svg',
      layers: [{ z: 4, Component: BodyBasic, parallax: { x: 1, y: 1 } }],
    },
  ],
}
