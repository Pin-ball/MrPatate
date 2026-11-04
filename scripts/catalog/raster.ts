import { Resvg } from '@resvg/resvg-js'
import { VIEW_BOX } from '../../src/lib/catalog/box.ts'
import type { Box } from '../../src/lib/catalog/types.ts'
import type { Finding } from './clean.ts'

export type ShadowLayer = { name: string; skin: string[]; shadow: string[] }

const SCALE = 2
const EXPECTED_EXTENSION = 3
const MAX_EXTENSION = 4.5
const HOLE_TOLERANCE = 2
const MEASURED_EXTENSION = 50
const SOLID_DEPTH = 4
const SOLID_SHARE = 0.1
const CROP_MARGIN = 2

type Mask = { width: number; height: number; filled: Uint8Array }

function renderMask(markup: string[], viewBox = VIEW_BOX): Mask {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${markup.join('')}</svg>`
  const image = new Resvg(svg, { fitTo: { mode: 'zoom', value: SCALE } }).render()
  const { width, height, pixels } = image
  const filled = new Uint8Array(width * height)
  for (let i = 0; i < filled.length; i++) filled[i] = (pixels[i * 4 + 3] ?? 0) > 127 ? 1 : 0
  return { width, height, filled }
}

function neighbours(index: number, width: number, height: number): number[] {
  const x = index % width
  const y = (index - x) / width
  const found: number[] = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx
      const ny = y + dy
      if ((dx || dy) && nx >= 0 && ny >= 0 && nx < width && ny < height) found.push(ny * width + nx)
    }
  }
  return found
}

function exteriorOf({ width, height, filled }: Mask): Uint8Array {
  const exterior = new Uint8Array(filled.length)
  const queue: number[] = []
  for (let i = 0; i < filled.length; i++) {
    const x = i % width
    const y = (i - x) / width
    const onBorder = x === 0 || y === 0 || x === width - 1 || y === height - 1
    if (onBorder && !filled[i]) {
      exterior[i] = 1
      queue.push(i)
    }
  }
  for (let head = 0; head < queue.length; head++) {
    for (const next of neighbours(queue[head] ?? 0, width, height)) {
      if (filled[next] || exterior[next]) continue
      exterior[next] = 1
      queue.push(next)
    }
  }
  return exterior
}

function distanceFrom(
  { width, height, filled }: Mask,
  fromFilled: boolean,
  limit: number,
): Uint16Array {
  const distance = new Uint16Array(filled.length).fill(limit)
  const queue: number[] = []
  for (let i = 0; i < filled.length; i++) {
    if (Boolean(filled[i]) !== fromFilled) continue
    distance[i] = 0
    queue.push(i)
  }
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head] ?? 0
    const step = (distance[current] ?? limit) + 1
    if (step >= limit) continue
    for (const next of neighbours(current, width, height)) {
      if ((distance[next] ?? 0) <= step) continue
      distance[next] = step
      queue.push(next)
    }
  }
  return distance
}

function checkLayer({ name, skin, shadow }: ShadowLayer): Finding[] {
  if (!shadow.length) return []
  if (!skin.length) return [{ level: 'error', message: `${name}: shadow without skin` }]
  const skinMask = renderMask(skin)
  const shadowMask = renderMask(shadow)
  const exterior = exteriorOf(skinMask)
  const limit = MEASURED_EXTENSION * SCALE
  const distance = distanceFrom(skinMask, true, limit)
  let holes = 0
  let outside = 0
  let touchesEdge = false
  let farthest = 0
  for (let i = 0; i < shadowMask.filled.length; i++) {
    if (!shadowMask.filled[i]) continue
    if (skinMask.filled[i]) {
      const nextToExterior = neighbours(i, skinMask.width, skinMask.height).some(
        (next) => exterior[next],
      )
      if (nextToExterior) touchesEdge = true
      continue
    }
    if (!exterior[i]) {
      holes++
      continue
    }
    outside++
    farthest = Math.max(farthest, distance[i] ?? limit)
  }
  const findings: Finding[] = []
  const units = (pixels: number) => Math.round((pixels / SCALE) * 10) / 10
  const holeArea = Math.ceil(holes / SCALE ** 2)
  if (holeArea > HOLE_TOLERANCE) {
    findings.push({
      level: 'error',
      message: `${name}: skin missing under the shadow (${holeArea} units²)`,
    })
  }
  if (!outside && touchesEdge) {
    findings.push({
      level: 'warning',
      message: `${name}: shadow stops at the silhouette, extend it ${EXPECTED_EXTENSION} units beyond`,
    })
  }
  if (outside) {
    const extension = units(farthest)
    findings.push({
      level: extension > MAX_EXTENSION ? 'warning' : 'info',
      message: `${name}: shadow extends ${extension} units beyond the skin (expected ${EXPECTED_EXTENSION})`,
    })
  }
  return findings
}

export function checkShadows(layers: ShadowLayer[]): Finding[] {
  return layers.flatMap(checkLayer)
}

export function isSolidFill(markup: string, [x0, y0, x1, y1]: Box, above: string[]): boolean {
  const viewBox = [
    x0 - CROP_MARGIN,
    y0 - CROP_MARGIN,
    x1 - x0 + 2 * CROP_MARGIN,
    y1 - y0 + 2 * CROP_MARGIN,
  ].join(' ')
  const shape = renderMask([markup], viewBox)
  const cover = renderMask(above, viewBox)
  const mask = {
    ...shape,
    filled: shape.filled.map((filled, i) => (filled && !cover.filled[i] ? 1 : 0)),
  }
  const depth = SOLID_DEPTH * SCALE
  const distance = distanceFrom(mask, false, depth + 1)
  let filled = 0
  let deep = 0
  for (let i = 0; i < mask.filled.length; i++) {
    if (!mask.filled[i]) continue
    filled++
    if ((distance[i] ?? 0) > depth) deep++
  }
  return deep > filled * SOLID_SHARE
}
