import type { Box, Camera, Variant } from './types.ts'

export const FRAME: Box = [180, 190, 620, 740]

export const FILL = 0.75

export const MAX_ZOOM = 1.9

export function unionBox(boxes: Box[]): Box | null {
  if (!boxes.length) return null
  return [
    Math.min(...boxes.map((box) => box[0])),
    Math.min(...boxes.map((box) => box[1])),
    Math.max(...boxes.map((box) => box[2])),
    Math.max(...boxes.map((box) => box[3])),
  ]
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function cameraOf(variants: Variant[]): Camera {
  const [fx0, fy0, fx1, fy1] = FRAME
  const box = unionBox(
    variants
      .filter((variant) => !variant.hidden)
      .flatMap((variant) => (variant.box ? [variant.box] : [])),
  )
  if (!box) return { zoom: 1, focus: [(fx0 + fx1) / 2, (fy0 + fy1) / 2] }

  const [x0, y0, x1, y1] = box
  const fit = Math.min((fx1 - fx0) / (x1 - x0), (fy1 - fy0) / (y1 - y0))
  const zoom = Math.round(clamp(FILL * fit, 1, MAX_ZOOM) * 20) / 20
  const halfWidth = (fx1 - fx0) / zoom / 2
  const halfHeight = (fy1 - fy0) / zoom / 2
  return {
    zoom,
    focus: [
      Math.round(clamp((x0 + x1) / 2, fx0 + halfWidth, fx1 - halfWidth)),
      Math.round(clamp((y0 + y1) / 2, fy0 + halfHeight, fy1 - halfHeight)),
    ],
  }
}
