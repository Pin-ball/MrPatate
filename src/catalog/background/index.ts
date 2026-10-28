import type { Part } from '@src/catalog/types.ts'

export const background: Part = {
  id: 'background',
  label: 'Fond',
  variants: [
    {
      id: 'none',
      label: 'Aucun fond',
      layers: [],
    },
    {
      id: 'mountain',
      label: 'Montagne',
      layers: [{ z: 0, Component: () => null, parallax: { x: 10, y: 1 } }],
    },
  ],
}
