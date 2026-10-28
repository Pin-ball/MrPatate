import type { Part } from '@src/catalog/types.ts'
import { EyesBasic } from './EyesBasic.tsx'
import { EyesBottom } from './EyesBottom.tsx'
import { EyesCrying } from './EyesCrying.tsx'
import { EyesCyclops } from './EyesCyclops.tsx'
import { EyesHero } from './EyesHero.tsx'
import { EyesKawaii } from './EyesKawaii.tsx'
import { EyesMono } from './EyesMono.tsx'
import { EyesSix } from './EyesSix.tsx'
import { EyesTop } from './EyesTop.tsx'

export const eyes: Part = {
  id: 'eyes',
  label: 'Yeux',
  variants: [
    {
      id: 'basic',
      label: 'Yeux standard',
      layers: [{ z: 5, Component: EyesBasic, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'top',
      label: 'Yeux en haut',
      layers: [{ z: 5, Component: EyesTop, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'bottom',
      label: 'Yeux en bas',
      layers: [{ z: 5, Component: EyesBottom, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'crying',
      label: 'Yeux qui pleurent',
      layers: [{ z: 5, Component: EyesCrying, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'cyclops',
      label: 'Œil de cyclope',
      layers: [{ z: 5, Component: EyesCyclops, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'hero',
      label: 'Yeux de héros',
      layers: [{ z: 5, Component: EyesHero, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'kawaii',
      label: 'Yeux kawaii',
      layers: [{ z: 5, Component: EyesKawaii, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'mono',
      label: 'Un œil',
      layers: [{ z: 5, Component: EyesMono, parallax: { x: 2, y: 1 } }],
    },
    {
      id: 'six',
      label: 'Six yeux',
      layers: [{ z: 5, Component: EyesSix, parallax: { x: 2, y: 1 } }],
    },
  ],
}
