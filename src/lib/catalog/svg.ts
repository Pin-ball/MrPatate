import { locales } from '../../i18n/locales.ts'
import { boxOf, VIEW_BOX } from './box.ts'
import type { Box, Label, SvgNode } from './types.ts'

const SVG_NS = 'http://www.w3.org/2000/svg'

export const DRAWING_TAGS = new Set([
  'g',
  'path',
  'circle',
  'ellipse',
  'rect',
  'polygon',
  'polyline',
])

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const FORBIDDEN_ATTRIBUTES = new Set(['id', 'class', 'style'])

export class CatalogError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`)
    this.name = 'CatalogError'
  }
}

export function checkId(id: string, file: string) {
  if (!ID.test(id)) throw new CatalogError(file, `invalid id "${id}" (kebab-case expected)`)
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

function isLabel(label: Partial<Label>): label is Label {
  return locales.every((locale) => label[locale] !== undefined)
}

function readLabel(root: Element, file: string): Label {
  const label: Partial<Label> = {}
  for (const title of root.children) {
    if (title.localName !== 'title') continue
    const lang = title.getAttribute('lang')
    if (!lang) throw new CatalogError(file, 'every <title> needs a lang attribute')
    const locale = locales.find((known) => known === lang)
    if (!locale) throw new CatalogError(file, `unknown locale "${lang}"`)
    if (label[locale]) throw new CatalogError(file, `label "${locale}" given twice`)
    const text = title.textContent?.trim()
    if (text) label[locale] = text
  }
  if (!isLabel(label)) {
    const missing = locales.filter((locale) => !label[locale])
    throw new CatalogError(file, `missing label for ${missing.join(', ')}`)
  }
  return label
}

function readLayers(elements: Element[], planeIds: string[], file: string) {
  const layers: Record<string, SvgNode[]> = {}
  const [onlyPlane] = planeIds
  if (elements.length && !onlyPlane) {
    throw new CatalogError(file, 'this part is not placed on any plane (planes.ts)')
  }
  if (planeIds.length === 1 && onlyPlane) {
    if (elements.length) layers[onlyPlane] = elements.map((child) => toSvgNode(child, file))
    return layers
  }
  for (const group of elements) {
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

export function parseDrawing(source: string, file: string, planeIds: string[]): Drawing {
  const root = parseSvgRoot(source, file)
  if (root.localName !== 'svg') throw new CatalogError(file, 'expected an <svg> root')
  if (root.getAttribute('viewBox') !== VIEW_BOX) {
    throw new CatalogError(file, `viewBox must be "${VIEW_BOX}"`)
  }
  const elements = [...root.children].filter((child) => child.localName !== 'title')
  const layers = readLayers(elements, planeIds, file)
  return {
    label: readLabel(root, file),
    hidden: root.getAttribute('data-hidden') === 'true',
    aliases: (root.getAttribute('data-aliases') ?? '').split(/\s+/).filter(Boolean),
    layers,
    box: boxOf(Object.values(layers).flat()),
  }
}
