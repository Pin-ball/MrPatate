import type { Part } from '@src/catalog/types.ts'

export const background: Part = {
  id: 'background',
  label: 'Fond',
  icon: '/assets/icons/body.svg',
  variants: [
    {
      id: 'none',
      label: 'Aucun fond',
      icon: '/assets/icons/none.svg',
      layers: [],
    },
    {
      id: 'mountain',
      label: 'Montagne',
      icon: '/assets/icons/body/basic.svg',
      layers: [{ z: 0, Component: () => null, parallax: { x: 10, y: 1 } }],
    },
  ],
}
