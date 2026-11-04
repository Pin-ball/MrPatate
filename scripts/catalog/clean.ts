import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { Window } from 'happy-dom'
import { svgPathBbox } from 'svg-path-bbox'
import type { CustomPlugin, XastChild, XastElement } from 'svgo'
import { optimize } from 'svgo'
import svgpath from 'svgpath'
import { partConfigs } from '../../src/catalog/parts.ts'
import { planes } from '../../src/catalog/planes.ts'
import skinVariants from '../../src/catalog/skin/variants.ts'
import { boxOf, DRAWING_BOX } from '../../src/lib/catalog/box.ts'
import {
  CatalogError,
  checkId,
  DRAWING_TAGS,
  FORBIDDEN_ATTRIBUTES,
  parseDrawing,
} from '../../src/lib/catalog/svg.ts'
import type { Box, SvgNode } from '../../src/lib/catalog/types.ts'
import { CATALOG_DIR } from './ids.ts'
import type { ShadowLayer } from './raster.ts'
import { checkShadows, isSolidFill } from './raster.ts'

export type Finding = { level: 'error' | 'warning' | 'info'; message: string }

export type CleanResult = { svg: string; findings: Finding[] }

type Point = [x: number, y: number]

function drawnColors(): Record<string, string> {
  const defaultSkin = skinVariants.find(({ id }) => id === partConfigs.skin.default)
  if (!defaultSkin) throw new Error(`skin "${partConfigs.skin.default}" not found`)
  return { skin: defaultSkin.skin, shadow: defaultSkin.shadow, outline: 'black' }
}

const DRAWN_COLORS = drawnColors()

const NAMED_COLORS: Record<string, string> = { '#000000': 'black', '#FFFFFF': 'white' }

const NEAR_COLOR_DISTANCE = 30
const PUPIL_MAX_AREA = 0.25
const HOLE_MIN_OVERLAP = 0.5
const PRECISION = 2
const CURVE_STEPS = 8
const ELLIPSE_STEPS = 16
const EYES_PART = 'eyes'

function isElement(child: XastChild): child is XastElement {
  return child.type === 'element'
}

function elementsOf(parent: { children: XastChild[] }): XastElement[] {
  return parent.children.filter(isElement)
}

function descendantsOf(parent: XastElement): XastElement[] {
  return elementsOf(parent).flatMap((child) => [child, ...descendantsOf(child)])
}

function toNode(element: XastElement): SvgNode {
  return {
    tag: element.name,
    attrs: element.attributes,
    children: elementsOf(element).map(toNode),
  }
}

function boxOfElement(element: XastElement): Box | null {
  return boxOf([toNode(element)])
}

function area([x0, y0, x1, y1]: Box): number {
  return Math.max(0, x1 - x0) * Math.max(0, y1 - y0)
}

function contains(outer: Box, inner: Box): boolean {
  return (
    inner[0] >= outer[0] && inner[1] >= outer[1] && inner[2] <= outer[2] && inner[3] <= outer[3]
  )
}

function overlap(a: Box, b: Box): number {
  const shared = area([
    Math.max(a[0], b[0]),
    Math.max(a[1], b[1]),
    Math.min(a[2], b[2]),
    Math.min(a[3], b[3]),
  ])
  return shared / (area(a) + area(b) - shared || 1)
}

function cornersOf([x0, y0, x1, y1]: Box): Point[] {
  return [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ]
}

function curvePoint(controls: Point[], t: number): Point {
  let points = controls
  while (points.length > 1) {
    points = points.slice(1).map(([x, y], i): Point => {
      const [px, py] = points[i] ?? [x, y]
      return [px + (x - px) * t, py + (y - py) * t]
    })
  }
  return points[0] ?? [0, 0]
}

function ellipseOutline([x0, y0, x1, y1]: Box): Point[] {
  const [cx, cy, rx, ry] = [(x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2]
  return Array.from({ length: ELLIPSE_STEPS }, (_, i): Point => {
    const angle = (i / ELLIPSE_STEPS) * 2 * Math.PI
    return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]
  })
}

function outlinesOf(element: XastElement): Point[][] {
  const d = element.attributes['d']
  if (element.name !== 'path' || !d) {
    const box = boxOfElement(element)
    if (!box) return []
    const round = element.name === 'circle' || element.name === 'ellipse'
    return [round ? ellipseOutline(box) : cornersOf(box)]
  }
  const outlines: Point[][] = []
  svgpath(d)
    .abs()
    .unarc()
    .unshort()
    .iterate(([command, ...values], _index, x, y) => {
      const at = (i: number) => values[i] ?? 0
      if (command === 'M') {
        outlines.push([[at(0), at(1)]])
        return
      }
      const outline = outlines.at(-1)
      if (!outline) return
      if (command === 'L') outline.push([at(0), at(1)])
      if (command === 'H') outline.push([at(0), y])
      if (command === 'V') outline.push([x, at(0)])
      if (command === 'C' || command === 'Q') {
        const controls: Point[] = [[x, y]]
        for (let i = 0; i < values.length; i += 2) controls.push([at(i), at(i + 1)])
        for (let step = 1; step <= CURVE_STEPS; step++) {
          outline.push(curvePoint(controls, step / CURVE_STEPS))
        }
      }
    })
  return outlines
}

function isInsidePolygon([x, y]: Point, polygon: Point[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i] ?? [0, 0]
    const [xj, yj] = polygon[j] ?? [0, 0]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function isInsideShape(inner: XastElement, outer: XastElement): boolean {
  const outerBox = boxOfElement(outer)
  const innerBox = boxOfElement(inner)
  if (!outerBox || !innerBox || !contains(outerBox, innerBox)) return false
  const polygons = outlinesOf(outer)
  return outlinesOf(inner)
    .flat()
    .every((point) => polygons.some((polygon) => isInsidePolygon(point, polygon)))
}

function describe(element: XastElement): string {
  const box = boxOfElement(element)
  return box ? `<${element.name}> at ${box[0]},${box[1]}` : `<${element.name}>`
}

export function canonicalColor(value: string): string {
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value)
  const hex = short ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}` : value
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return value
  const upper = hex.toUpperCase()
  return NAMED_COLORS[upper] ?? upper
}

function rgbOf(color: string): number[] | null {
  const hex = Object.entries(NAMED_COLORS).find(([, name]) => name === color)?.[0] ?? color
  const match = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/.exec(hex)
  return match ? match.slice(1).map((channel) => Number.parseInt(channel, 16)) : null
}

function colorDistance(a: string, b: string): number {
  const first = rgbOf(a)
  const second = rgbOf(b)
  if (!first || !second) return Number.POSITIVE_INFINITY
  return first.reduce((sum, channel, i) => sum + Math.abs(channel - (second[i] ?? 0)), 0)
}

function roleOf(element: XastElement): string | undefined {
  return element.attributes['data-role']
}

function setRole(element: XastElement, role: string): void {
  element.attributes = { 'data-role': role, ...element.attributes }
}

function dataAttributesFirst(element: XastElement): void {
  const entries = Object.entries(element.attributes)
  element.attributes = Object.fromEntries([
    ...entries.filter(([name]) => name.startsWith('data-')),
    ...entries.filter(([name]) => !name.startsWith('data-')),
  ])
}

function removeHoles(white: XastElement, pupil: XastElement): boolean {
  const d = white.attributes['d']
  const pupilBox = boxOfElement(pupil)
  if (white.name !== 'path' || !d || !pupilBox) return false
  const subpaths = svgpath(d).abs().toString().split(/(?=M)/)
  if (subpaths.length < 2) return false
  const largest = Math.max(...subpaths.map((subpath) => area(svgPathBbox(subpath))))
  const kept = subpaths.filter((subpath) => {
    const box = svgPathBbox(subpath)
    return area(box) === largest || overlap(box, pupilBox) < HOLE_MIN_OVERLAP
  })
  if (kept.length === subpaths.length) return false
  white.attributes['d'] = svgpath(kept.join('')).rel().round(PRECISION).toString()
  return true
}

type White = { element: XastElement; area: number }

function isPupilSized(pupil: XastElement, white: White): boolean {
  const box = boxOfElement(pupil)
  return box !== null && area(box) <= white.area * PUPIL_MAX_AREA
}

function groupEyes(container: XastElement, name: string, findings: Finding[]): void {
  const loose = elementsOf(container).filter((child) => child.name !== 'g' && !roleOf(child))
  const whites = loose
    .filter((child) => child.attributes['fill'] === 'white')
    .flatMap((element): White[] => {
      const box = boxOfElement(element)
      return box ? [{ element, area: area(box) }] : []
    })
    .sort((a, b) => a.area - b.area)
  const blacks = loose.filter((child) => child.attributes['fill'] === 'black')
  const inside = new Map<White, XastElement[]>()
  for (const black of blacks) {
    const owner = whites.find(({ element }) => isInsideShape(black, element))
    if (owner) inside.set(owner, [...(inside.get(owner) ?? []), black])
  }
  let grouped = 0
  for (const [white, shapes] of inside) {
    const [pupil] = shapes
    if (shapes.length > 1 || !pupil || !isPupilSized(pupil, white)) {
      findings.push({
        level: 'warning',
        message: `${describe(white.element)}: ${shapes.length} black shape(s) inside a white shape, not a pupil, no eye grouped`,
      })
      continue
    }
    if (removeHoles(white.element, pupil)) {
      findings.push({
        level: 'info',
        message: `${describe(white.element)}: hole under the pupil filled`,
      })
    }
    setRole(white.element, 'eye-white')
    setRole(pupil, 'eye-pupil')
    const eye: XastElement = {
      type: 'element',
      name: 'g',
      attributes: { 'data-role': 'eye' },
      children: [white.element, pupil],
    }
    container.children = container.children
      .filter((child) => child !== pupil)
      .map((child) => (child === white.element ? eye : child))
    grouped++
  }
  if (grouped) findings.push({ level: 'info', message: `${name}: ${grouped} eye(s) grouped` })
}

function colorRole(color: string): string | undefined {
  return Object.entries(DRAWN_COLORS).find(([, drawn]) => drawn === color)?.[0]
}

function checkColors(element: XastElement, findings: Finding[]): void {
  const fill = element.attributes['fill']
  const role = roleOf(element)
  const expected = role ? DRAWN_COLORS[role] : undefined
  if (expected && fill !== expected) {
    findings.push({
      level: 'warning',
      message: `${describe(element)}: role "${role}" but fill ${fill ?? 'none'}, expected ${expected}`,
    })
  }
  if (!fill || colorRole(fill)) return
  for (const [role, drawn] of Object.entries(DRAWN_COLORS)) {
    if (colorDistance(fill, drawn) <= NEAR_COLOR_DISTANCE) {
      findings.push({
        level: 'warning',
        message: `${describe(element)}: fill ${fill} is close to the ${role} color ${drawn}`,
      })
    }
  }
}

function markupOf(element: XastElement): string {
  const attributes = Object.entries(element.attributes)
    .map(([name, value]) => ` ${name}="${value}"`)
    .join('')
  const children = elementsOf(element).map(markupOf).join('')
  return `<${element.name}${attributes}>${children}</${element.name}>`
}

function isSolidElement(element: XastElement, above: XastElement[]): boolean {
  const box = boxOfElement(element)
  const covering = above.filter((shape) => shape.name !== 'g' && roleOf(shape) !== 'shadow')
  return box !== null && isSolidFill(markupOf(element), box, covering.map(markupOf))
}

function assignRoles(container: XastElement, findings: Finding[]): Record<string, number> {
  const added: Record<string, number> = {}
  const elements = descendantsOf(container)
  for (const [index, element] of elements.entries()) {
    if (element.name === 'g') continue
    const current = roleOf(element)
    const role = current ?? colorRole(element.attributes['fill'] ?? '')
    if (role === 'outline' && isSolidElement(element, elements.slice(index + 1))) {
      findings.push({
        level: 'warning',
        message: current
          ? `${describe(element)}: role "outline" on a solid black fill, outline is for lines`
          : `${describe(element)}: solid black fill, left without the outline role`,
      })
      continue
    }
    if (current || !role) continue
    setRole(element, role)
    added[role] = (added[role] ?? 0) + 1
  }
  return added
}

function shadowLayer(container: XastElement, name: string): ShadowLayer {
  const elements = descendantsOf(container)
  const withRole = (role: string) =>
    elements.filter((element) => roleOf(element) === role).map(markupOf)
  return { name, skin: withRole('skin'), shadow: withRole('shadow') }
}

function unwrapPlainGroups(parent: XastElement): void {
  parent.children = parent.children.flatMap((child) => {
    if (!isElement(child)) return [child]
    unwrapPlainGroups(child)
    const plain = child.name === 'g' && !Object.keys(child.attributes).length
    return plain ? child.children : [child]
  })
}

function keepRootAttributes(svg: XastElement): void {
  svg.attributes = Object.fromEntries(
    Object.entries(svg.attributes).filter(
      ([name]) => name === 'xmlns' || name === 'viewBox' || name.startsWith('data-'),
    ),
  )
}

function checkElements(svg: XastElement, findings: Finding[]): void {
  const drawn = descendantsOf(svg).filter(
    (element) => DRAWING_TAGS.has(element.name) && element.name !== 'g',
  )
  const count = (test: (element: XastElement) => boolean) => drawn.filter(test).length
  const transformed = count((element) => 'transform' in element.attributes)
  const stroked = count((element) => 'stroke' in element.attributes)
  const unfilled = count((element) => !('fill' in element.attributes))
  if (transformed)
    findings.push({ level: 'warning', message: `${transformed} element(s) keep a transform` })
  if (stroked) findings.push({ level: 'warning', message: `${stroked} element(s) use a stroke` })
  if (unfilled) findings.push({ level: 'warning', message: `${unfilled} element(s) have no fill` })
  for (const element of drawn) {
    const box = boxOfElement(element)
    if (box && contains(box, DRAWING_BOX)) {
      findings.push({ level: 'warning', message: `${describe(element)} covers the whole frame` })
    }
  }
}

function planeContainers(svg: XastElement): [XastElement, string][] {
  const planes = elementsOf(svg).filter(
    (child) => child.name === 'g' && child.attributes['data-plane'],
  )
  if (!planes.length) return [[svg, 'drawing']]
  return planes.map((plane) => [plane, `plane ${plane.attributes['data-plane']}`])
}

function checkNestedRoles(container: XastElement, name: string, findings: Finding[]): void {
  for (const element of descendantsOf(container)) {
    const role = roleOf(element)
    if ((role !== 'skin' && role !== 'shadow') || container.children.includes(element)) continue
    findings.push({
      level: 'warning',
      message: `${name}: ${describe(element)} has role "${role}" inside a group, the shadow clip only reads top-level shapes`,
    })
  }
}

function rolesPlugin(part: string, findings: Finding[], layers: ShadowLayer[]): CustomPlugin {
  return {
    name: 'catalogRoles',
    fn: (root) => {
      const svg = elementsOf(root).find((child) => child.name === 'svg')
      if (!svg) {
        findings.push({ level: 'error', message: 'no <svg> root' })
        return
      }
      keepRootAttributes(svg)
      unwrapPlainGroups(svg)
      for (const element of descendantsOf(svg)) checkColors(element, findings)
      checkElements(svg, findings)
      for (const [container, name] of planeContainers(svg)) {
        if (part === EYES_PART) groupEyes(container, name, findings)
        const added = assignRoles(container, findings)
        checkNestedRoles(container, name, findings)
        const summary = Object.entries(added).map(([role, n]) => `${role} ×${n}`)
        if (summary.length)
          findings.push({ level: 'info', message: `${name}: roles added ${summary.join(', ')}` })
        layers.push(shadowLayer(container, name))
      }
      for (const element of descendantsOf(svg)) dataAttributesFirst(element)
    },
  }
}

function removeClipsAndMasksPlugin(findings: Finding[]): CustomPlugin {
  return {
    name: 'removeClipsAndMasks',
    fn: () => ({
      element: {
        enter: (element) => {
          for (const name of ['clip-path', 'mask']) {
            if (!(name in element.attributes)) continue
            delete element.attributes[name]
            findings.push({ level: 'warning', message: `${describe(element)}: ${name} removed` })
          }
        },
      },
    }),
  }
}

function planeIdsOf(part: string): string[] {
  return planes.filter((plane) => plane.parts.some((name) => name === part)).map(({ id }) => id)
}

function validate(svg: string, part: string, id: string): Finding[] {
  if (typeof DOMParser === 'undefined')
    Object.assign(globalThis, { DOMParser: new Window().DOMParser })
  const file = `${part}/${id}.svg`
  try {
    checkId(id, file)
    parseDrawing(svg, file, planeIdsOf(part))
    return []
  } catch (error) {
    if (error instanceof CatalogError) return [{ level: 'error', message: error.message }]
    throw error
  }
}

const canonicalColorsPlugin: CustomPlugin = {
  name: 'canonicalColors',
  fn: () => ({
    element: {
      enter: (element) => {
        for (const name of ['fill', 'stroke']) {
          const value = element.attributes[name]
          if (value) element.attributes[name] = canonicalColor(value)
        }
      },
    },
  }),
}

function stabilize(source: string, findings: Finding[]): string {
  return optimize(source, {
    multipass: true,
    floatPrecision: PRECISION,
    js2svg: { pretty: true, indent: 2 },
    plugins: [
      'convertStyleToAttrs',
      removeClipsAndMasksPlugin(findings),
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles: { onlyMatchedOnce: false },
            convertColors: { shorthex: false, shortname: false },
            removeUnknownsAndDefaults: { defaultAttrs: false, unknownAttrs: false },
            moveElemsAttrsToGroup: false,
            collapseGroups: false,
            mergePaths: false,
            sortAttrs: false,
          },
        },
      },
      'removeDimensions',
      { name: 'removeAttrs', params: { attrs: [...FORBIDDEN_ATTRIBUTES] } },
      canonicalColorsPlugin,
    ],
  }).data
}

export function cleanDrawing(source: string, part: string, id: string): CleanResult {
  const findings: Finding[] = []
  const layers: ShadowLayer[] = []
  const cleaned = stabilize(source, findings)
  const withRoles = optimize(cleaned, { plugins: [rolesPlugin(part, findings, layers)] }).data
  const svg = `${stabilize(withRoles, findings)}\n`
  return { svg, findings: [...findings, ...validate(svg, part, id), ...checkShadows(layers)] }
}

function printReport(file: string, findings: Finding[], status: string): void {
  console.log(`${relative(process.cwd(), file)} — ${status}`)
  for (const { level, message } of findings) console.log(`  ${level.padEnd(7)} ${message}`)
}

function statusOf(hasError: boolean, changed: boolean, written: string | null): string {
  if (hasError) return 'errors, not written'
  if (!changed) return 'unchanged'
  return written ? `written to ${written}` : 'would change (--write to apply)'
}

function run(): number {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { to: { type: 'string' }, write: { type: 'boolean', default: false } },
  })
  if (!positionals.length) {
    console.error(
      'usage: npm run catalog:clean -- <file.svg> --to <part>/<id> | <catalog files…> [--write]',
    )
    return 1
  }
  if (values.to && positionals.length !== 1) {
    console.error('--to takes a single source file')
    return 1
  }
  let failed = false
  for (const file of positionals.map((path) => resolve(path))) {
    const target = values.to ? join(CATALOG_DIR, `${values.to}.svg`) : file
    const part = relative(CATALOG_DIR, dirname(target))
    if (!part || part.startsWith('..') || part.includes('/') || !existsSync(dirname(target))) {
      console.error(`${target}: not in a part folder of ${relative(process.cwd(), CATALOG_DIR)}`)
      failed = true
      continue
    }
    if (values.to && existsSync(target) && target !== file) {
      console.error(`${relative(process.cwd(), target)} already exists`)
      failed = true
      continue
    }
    let source: string
    let result: CleanResult
    try {
      source = readFileSync(file, 'utf8')
      result = cleanDrawing(source, part, basename(target, '.svg'))
    } catch (error) {
      printReport(file, [{ level: 'error', message: String(error) }], 'not cleaned')
      failed = true
      continue
    }
    const hasError = result.findings.some((finding) => finding.level === 'error')
    const changed = result.svg !== source
    const write = !hasError && changed && (values.to !== undefined || values.write)
    if (write) writeFileSync(target, result.svg)
    const written = write ? relative(process.cwd(), target) : null
    printReport(file, result.findings, statusOf(hasError, changed, written))
    failed ||= hasError
  }
  return failed ? 1 : 0
}

if (import.meta.main) process.exitCode = run()
