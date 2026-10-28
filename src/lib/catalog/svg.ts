import { svgPathBbox } from 'svg-path-bbox'
import type { Box, Label, SvgNode } from './types.ts'

export const VIEW_BOX = '0 0 800 1000'

const SVG_NS = 'http://www.w3.org/2000/svg'

const DRAWING_TAGS = new Set(['g', 'path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline'])

const FORBIDDEN_ATTRIBUTES = new Set(['id', 'class', 'style'])

export class CatalogError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`)
    this.name = 'CatalogError'
  }
}

function parseSvgRoot(source: string, file: string): Element {
  const document = new DOMParser().parseFromString(source, 'image/svg+xml')
  if (document.querySelector('parsererror')) throw new CatalogError(file, 'invalid SVG markup')
  return document.documentElement
}

function toReactName(name: string): string {
  if (name.startsWith('data-') || name.startsWith('aria-')) return name
  return name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function toSvgNode(element: Element, file: string): SvgNode {
  const tag = element.localName
  if (!DRAWING_TAGS.has(tag)) throw new CatalogError(file, `unsupported <${tag}>`)
  const attrs: Record<string, string> = {}
  for (const { name, value } of element.attributes) {
    if (name.startsWith('xmlns')) continue
    if (FORBIDDEN_ATTRIBUTES.has(name)) {
      throw new CatalogError(file, `<${tag}> must not have a "${name}" attribute`)
    }
    attrs[toReactName(name)] = value
  }
  return { tag, attrs, children: [...element.children].map((child) => toSvgNode(child, file)) }
}

export function parseNodes(markup: string, file: string): SvgNode[] {
  const root = parseSvgRoot(`<svg xmlns="${SVG_NS}">${markup}</svg>`, file)
  return [...root.children].map((child) => toSvgNode(child, file))
}

function nodeBox({ tag, attrs }: SvgNode): Box | null {
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

export function boxOf(nodes: SvgNode[]): Box | null {
  const boxes = flatten(nodes)
    .map(nodeBox)
    .filter((box) => box !== null)
  if (!boxes.length) return null
  return [
    Math.floor(Math.min(...boxes.map((box) => box[0]))),
    Math.floor(Math.min(...boxes.map((box) => box[1]))),
    Math.ceil(Math.max(...boxes.map((box) => box[2]))),
    Math.ceil(Math.max(...boxes.map((box) => box[3]))),
  ]
}

function readLabel(root: Element, locales: readonly string[], file: string): Label {
  const label: Record<string, string> = {}
  for (const title of root.children) {
    if (title.localName !== 'title') continue
    const locale = title.getAttribute('lang')
    if (!locale) throw new CatalogError(file, 'every <title> needs a lang attribute')
    if (!locales.includes(locale)) throw new CatalogError(file, `unknown locale "${locale}"`)
    if (label[locale]) throw new CatalogError(file, `label "${locale}" given twice`)
    const text = title.textContent?.trim()
    if (text) label[locale] = text
  }
  const missing = locales.filter((locale) => !label[locale])
  if (missing.length) throw new CatalogError(file, `missing label for ${missing.join(', ')}`)
  return label as Label
}

function readLayers(drawing: Element[], planeIds: string[], file: string) {
  const layers: Record<string, SvgNode[]> = {}
  const [onlyPlane] = planeIds
  if (drawing.length && !onlyPlane) {
    throw new CatalogError(file, 'this part is not placed on any plane (planes.ts)')
  }
  if (planeIds.length === 1 && onlyPlane) {
    if (drawing.length) layers[onlyPlane] = drawing.map((child) => toSvgNode(child, file))
    return layers
  }
  for (const group of drawing) {
    const plane = group.getAttribute('data-plane')
    if (group.localName !== 'g' || !plane) {
      throw new CatalogError(
        file,
        `top-level content must be <g data-plane="…"> (${planeIds.join(', ')})`,
      )
    }
    if (!planeIds.includes(plane)) {
      throw new CatalogError(
        file,
        `plane "${plane}" is not used by this part (${planeIds.join(', ')})`,
      )
    }
    if (layers[plane]) throw new CatalogError(file, `plane "${plane}" used twice`)
    layers[plane] = [...group.children].map((child) => toSvgNode(child, file))
  }
  return layers
}

export type Drawing = {
  label: Label
  hidden: boolean
  aliases: string[]
  layers: Record<string, SvgNode[]>
  box: Box | null
}

export function parseDrawing(
  source: string,
  file: string,
  planeIds: string[],
  locales: readonly string[],
): Drawing {
  const root = parseSvgRoot(source, file)
  if (root.localName !== 'svg') throw new CatalogError(file, 'expected an <svg> root')
  if (root.getAttribute('viewBox') !== VIEW_BOX) {
    throw new CatalogError(file, `viewBox must be "${VIEW_BOX}"`)
  }
  const drawing = [...root.children].filter((child) => child.localName !== 'title')
  const layers = readLayers(drawing, planeIds, file)
  return {
    label: readLabel(root, locales, file),
    hidden: root.getAttribute('data-hidden') === 'true',
    aliases: (root.getAttribute('data-aliases') ?? '').split(/\s+/).filter(Boolean),
    layers,
    box: boxOf(Object.values(layers).flat()),
  }
}
