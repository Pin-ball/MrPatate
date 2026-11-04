import { clamp } from '@src/lib/utils.ts'
import { unionBox } from './box.ts'
import type { Box, Camera, Variant } from './types.ts'

export const FRAME: Box = [180, 190, 620, 740]

export const FRAME_RATIO = (FRAME[2] - FRAME[0]) / (FRAME[3] - FRAME[1])

const FILL = 0.75

export const MAX_ZOOM = 1.6

export const FRAME_CAMERA: Camera = {
  zoom: 1,
  focus: [(FRAME[0] + FRAME[2]) / 2, (FRAME[1] + FRAME[3]) / 2],
}

export function viewBoxOf([x0, y0, x1, y1]: Box): string {
  return `${x0} ${y0} ${x1 - x0} ${y1 - y0}`
}

export function cameraOf(variants: Variant[]): Camera | null {
  const [fx0, fy0, fx1, fy1] = FRAME
  const box = unionBox(
    variants
      .filter((variant) => !variant.hidden)
      .flatMap((variant) => (variant.box ? [variant.box] : [])),
  )
  if (!box) return null

  const [x0, y0, x1, y1] = box
  const fit = Math.min((fx1 - fx0) / (x1 - x0), (fy1 - fy0) / (y1 - y0))
  const zoom = Math.round(clamp(FILL * fit, 1, MAX_ZOOM) * 20) / 20
  const halfWidth = (fx1 - fx0) / zoom / 2
  return {
    zoom,
    focus: [
      Math.round(clamp((x0 + x1) / 2, fx0 + halfWidth, fx1 - halfWidth)),
      Math.round((y0 + y1) / 2),
    ],
  }
}

export function frameView(zoom: number, ratio: number): Box {
  const [x, y] = FRAME_CAMERA.focus
  const width = (FRAME[2] - FRAME[0]) / zoom
  const height = width * ratio
  return [x - width / 2, y - height / 2, x + width / 2, y + height / 2]
}

const THUMBNAIL_MARGIN = 1.3
const THUMBNAIL_MIN_WIDTH = 96

export function thumbnailView(variant: Variant): Box {
  if (!variant.box) return frameView(1, 1)
  const [x0, y0, x1, y1] = variant.box
  const size = Math.max(
    THUMBNAIL_MIN_WIDTH,
    (x1 - x0) * THUMBNAIL_MARGIN,
    (y1 - y0) * THUMBNAIL_MARGIN,
  )
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2
  return [cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2]
}
