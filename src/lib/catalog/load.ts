import { cameraOf } from './camera.ts'
import type { Drawing } from './svg.ts'
import { CatalogError, parseDrawing, parseNodes } from './svg.ts'
import type { Paint, Part, PartConfig, PartId, Plane, Variant, VariantConfig } from './types.ts'

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/

type PlaneSource = { id: string; depth: number; parts: readonly string[] }

export type CatalogSources = {
  configs: Record<string, PartConfig>
  drawings: Record<string, Record<string, string>>
  coded: Record<string, readonly VariantConfig[]>
  planes: readonly PlaneSource[]
  partsPile: readonly string[]
  locales: readonly string[]
}

export type Catalog = { parts: Part[]; planes: Plane[]; partsPile: Part[] }

function checkId(id: string, file: string) {
  if (!ID.test(id)) throw new CatalogError(file, `invalid id "${id}" (kebab-case expected)`)
}

export function checkPlanes(planes: readonly PlaneSource[], partIds: string[]) {
  const file = 'planes.ts'
  const ids = new Set<string>()
  let previousDepth = 0
  for (const { id, depth, parts } of planes) {
    if (ids.has(id)) throw new CatalogError(file, `plane "${id}" declared twice`)
    ids.add(id)
    if (!Number.isInteger(depth) || depth <= previousDepth) {
      throw new CatalogError(
        file,
        `plane "${id}": depths must be positive integers, increasing from back to front`,
      )
    }
    previousDepth = depth
    for (const part of parts) {
      if (!partIds.includes(part)) {
        throw new CatalogError(file, `plane "${id}": unknown part "${part}"`)
      }
    }
    if (new Set(parts).size !== parts.length) {
      throw new CatalogError(file, `plane "${id}": a part is listed twice`)
    }
  }
}

export function checkPartsPile(pile: readonly string[], partIds: string[]) {
  const file = 'parts.ts (partsPile)'
  for (const part of pile) {
    if (!partIds.includes(part)) throw new CatalogError(file, `unknown part "${part}"`)
  }
  if (new Set(pile).size !== pile.length) throw new CatalogError(file, 'a part is listed twice')
}

function toPaint(config: VariantConfig, file: string): Paint {
  if ('skin' in config) return { kind: 'skin', skin: config.skin, shadow: config.shadow }
  const { pattern } = config
  return {
    kind: 'background',
    fill: config.fill,
    dark: config.dark ?? false,
    pattern: pattern
      ? {
          width: pattern.width,
          height: pattern.height,
          transform: pattern.transform ?? null,
          nodes: parseNodes(pattern.svg, file),
        }
      : null,
  }
}

function buildVariants(
  partId: string,
  config: PartConfig,
  sources: Record<string, string>,
  coded: readonly VariantConfig[],
  planeIds: string[],
  locales: readonly string[],
): Variant[] {
  const file = `parts.ts (${partId})`
  const drawings = new Map<string, Drawing>()
  for (const [id, source] of Object.entries(sources)) {
    const svgFile = `${partId}/${id}.svg`
    checkId(id, svgFile)
    drawings.set(id, parseDrawing(source, svgFile, planeIds, locales))
  }

  const codedFile = `${partId}/variants.ts`
  const codedVariants = coded.map((variant): Variant => {
    checkId(variant.id, codedFile)
    const drawing = drawings.get(variant.id)
    drawings.delete(variant.id)
    return {
      id: variant.id,
      label: variant.label,
      hidden: variant.hidden ?? false,
      aliases: [...(variant.aliases ?? [])],
      box: drawing?.box ?? null,
      layers: drawing?.layers ?? {},
      paint: toPaint(variant, codedFile),
    }
  })

  const drawnVariants = [...drawings]
    .map(([id, drawing]): Variant => ({ id, ...drawing, paint: null }))
    .sort((a, b) => a.id.localeCompare(b.id))

  const variants = [...codedVariants, ...drawnVariants]
  const fallback = variants.find((variant) => variant.id === config.default)
  if (!fallback) throw new CatalogError(file, `default variant "${config.default}" does not exist`)
  if (fallback.hidden) throw new CatalogError(file, `default variant "${config.default}" is hidden`)
  return [fallback, ...variants.filter((variant) => variant !== fallback)]
}

function checkVariants(part: Part, file: string) {
  const names = new Map<string, string>()
  for (const variant of part.variants) {
    for (const alias of variant.aliases) checkId(alias, file)
    for (const name of [variant.id, ...variant.aliases]) {
      const owner = names.get(name)
      if (owner) {
        throw new CatalogError(file, `"${name}" is used by both "${owner}" and "${variant.id}"`)
      }
      names.set(name, variant.id)
    }
  }
}

export function buildCatalog({
  configs,
  drawings,
  coded,
  planes,
  partsPile,
  locales,
}: CatalogSources): Catalog {
  const partIds = Object.keys(configs)
  for (const folder of new Set([...Object.keys(drawings), ...Object.keys(coded)])) {
    if (!partIds.includes(folder)) {
      throw new CatalogError(`${folder}/`, 'this folder has no entry in parts.ts')
    }
  }
  checkPlanes(planes, partIds)
  checkPartsPile(partsPile, partIds)
  const parts = Object.entries(configs).map(([id, config]) => {
    const file = `parts.ts (${id})`
    checkId(id, file)
    const planeIds = planes.filter((plane) => plane.parts.includes(id)).map((plane) => plane.id)
    const variants = buildVariants(
      id,
      config,
      drawings[id] ?? {},
      coded[id] ?? [],
      planeIds,
      locales,
    )
    const part: Part = {
      id: id as PartId,
      label: config.label,
      camera: config.camera ?? cameraOf(variants),
      variants,
    }
    checkVariants(part, file)
    return part
  })
  const rank = (id: string) => (partsPile.includes(id) ? partsPile.indexOf(id) : partsPile.length)
  parts.sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id))
  return {
    parts,
    planes: planes as Plane[],
    partsPile: parts.filter((part) => partsPile.includes(part.id)),
  }
}
