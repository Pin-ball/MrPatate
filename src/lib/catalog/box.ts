import { svgPathBbox } from 'svg-path-bbox'
import type { Box, SvgNode } from './types.ts'

export const VIEW_BOX = '0 0 800 1000'

export const DRAWING_BOX: Box = [0, 0, 800, 1000]

export function nodeBox({ tag, attrs }: Pick<SvgNode, 'tag' | 'attrs'>): Box | null {
  const n = (name: string) => Number(attrs[name] ?? 0)
  switch (tag) {
    case 'path':
      return attrs['d'] ? svgPathBbox(attrs['d']) : null
    case 'rect':
      return [n('x'), n('y'), n('x') + n('width'), n('y') + n('height')]
    case 'circle':
      return [n('cx') - n('r'), n('cy') - n('r'), n('cx') + n('r'), n('cy') + n('r')]
    case 'ellipse':
      return [n('cx') - n('rx'), n('cy') - n('ry'), n('cx') + n('rx'), n('cy') + n('ry')]
    case 'polygon':
    case 'polyline': {
      const values = (attrs['points'] ?? '')
        .trim()
        .split(/[\s,]+/)
        .map(Number)
      const xs = values.filter((_, i) => i % 2 === 0)
      const ys = values.filter((_, i) => i % 2 === 1)
      return xs.length ? [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] : null
    }
    default:
      return null
  }
}

function flatten(nodes: SvgNode[]): SvgNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children)])
}

export function unionBox(boxes: Box[]): Box | null {
  if (!boxes.length) return null
  return [
    Math.min(...boxes.map((box) => box[0])),
    Math.min(...boxes.map((box) => box[1])),
    Math.max(...boxes.map((box) => box[2])),
    Math.max(...boxes.map((box) => box[3])),
  ]
}

export function boxOf(nodes: SvgNode[]): Box | null {
  const box = unionBox(
    flatten(nodes)
      .map(nodeBox)
      .filter((found) => found !== null),
  )
  if (!box) return null
  const [x0, y0, x1, y1] = box
  return [Math.floor(x0), Math.floor(y0), Math.ceil(x1), Math.ceil(y1)]
}
