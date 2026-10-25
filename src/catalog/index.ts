import type { Look, Part, PartId } from '@src/catalog/types.ts'
import { arms } from './arms/index.ts'
import { back } from './back/index.ts'
import { background } from './background/index.ts'
import { body } from './body/index.ts'
import { eyes } from './eyes/index.ts'
import { legs } from './legs/index.ts'
import { mouth } from './mouth/index.ts'

export const partById = {
  body,
  mouth,
  eyes,
  arms,
  legs,
  back,
  background,
} satisfies Record<PartId, Part>

export const parts: Part[] = Object.values(partById)

export const defaultLook: Look = {
  body: 'basic',
  mouth: 'happy',
  eyes: 'basic',
  arms: 'basic',
  legs: 'basic',
  back: 'none',
  background: 'none',
}
