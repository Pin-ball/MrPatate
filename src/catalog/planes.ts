import type { Plane } from '@src/lib/catalog/types.ts'

export const pivotDepth = 60

export const planes = [
  {
    id: 'scene',
    depth: 20,
    parts: ['background'],
  },
  {
    id: 'back',
    depth: 100,
    parts: ['arms', 'legs'],
  },
  {
    id: 'body',
    depth: 120,
    parts: ['body', 'back'],
  },
  {
    id: 'face',
    depth: 140,
    parts: ['mouth', 'eyes'],
  },
  {
    id: 'front',
    depth: 160,
    parts: ['arms', 'legs'],
  },
] satisfies Plane[]
