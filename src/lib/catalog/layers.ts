import { findVariant, partById, planes } from './index.ts'
import type { Look, Paint, PartId, Plane, SvgNode, Variant } from './types.ts'

export type SkinPaint = Extract<Paint, { kind: 'skin' }>

export type BackgroundPaint = Extract<Paint, { kind: 'background' }>

export type Layer = {
  part: PartId
  variant: Variant
  nodes: SvgNode[]
}

export type PlaneLayers = {
  plane: Plane
  layers: Layer[]
}

export const PIVOT_PLANE = 'body'

export const pivotDepth = planes.find((plane) => plane.id === PIVOT_PLANE)?.depth ?? 0

export function variantOf(look: Look, part: PartId): Variant {
  const { variants } = partById[part]
  const variant = findVariant(partById[part], look[part]) ?? variants[0]
  if (!variant) throw new Error(`Part "${part}" has no variant`)
  return variant
}

export function layersOf(look: Look): PlaneLayers[] {
  return planes.map((plane) => ({
    plane,
    layers: plane.parts.flatMap((part) => {
      const variant = variantOf(look, part)
      const nodes = variant.layers[plane.id]
      return nodes ? [{ part, variant, nodes }] : []
    }),
  }))
}

export function skinOf(look: Look): SkinPaint {
  const paint = variantOf(look, 'skin').paint
  if (paint?.kind !== 'skin') throw new Error('The skin variant has no skin paint')
  return paint
}

export function backgroundOf(look: Look): BackgroundPaint {
  const paint = variantOf(look, 'background').paint
  if (paint?.kind !== 'background') throw new Error('The background variant has no paint')
  return paint
}
