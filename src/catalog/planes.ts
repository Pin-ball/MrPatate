import type { Plane } from '@src/lib/catalog/types.ts'

export const planes = [
  {
    id: 'scene',
    depth: 1,
    parts: ['background'],
  },
  {
    id: 'back',
    depth: 2,
    parts: ['arms', 'legs'],
  },
  {
    id: 'body',
    depth: 3,
    parts: ['body', 'back'],
  },
  {
    id: 'face',
    depth: 4,
    parts: ['mouth', 'eyes'],
  },
  {
    id: 'front',
    depth: 5,
    parts: ['arms', 'legs'],
  },
] satisfies Plane[]
