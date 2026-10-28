import type { Part } from '@src/catalog/types.ts'
import { BodyBasic } from './BodyBasic.tsx'

export const body: Part = {
  id: 'body',
  label: 'Corps',
  variants: [
    {
      id: 'basic',
      label: 'Corps standard',
      layers: [{ z: 4, Component: BodyBasic, parallax: { x: 1, y: 1 } }],
    },
  ],
}
