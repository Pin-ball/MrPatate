import { partConfigs, partsPile as partsPileSource } from '../../catalog/parts.ts'
import { planes as planeSources } from '../../catalog/planes.ts'
import { buildCatalog } from './load.ts'
import type { Look, Part, PartId, Variant, VariantConfig } from './types.ts'

function isPartId(id: string): id is PartId {
  return Object.hasOwn(partConfigs, id)
}

export const partIds = Object.keys(partConfigs).filter(isPartId)

const codedModules = import.meta.glob<readonly VariantConfig[]>('/src/catalog/*/variants.ts', {
  eager: true,
  import: 'default',
})

const drawingModules = import.meta.glob<string>('/src/catalog/*/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function splitPath(path: string): [folder: string, name: string] {
  const [folder = '', file = ''] = path.split('/').slice(-2)
  return [folder, file.replace(/\.[a-z]+$/, '')]
}

const drawings: Record<string, Record<string, string>> = {}
for (const [path, source] of Object.entries(drawingModules)) {
  const [folder, name] = splitPath(path)
  drawings[folder] = { ...drawings[folder], [name]: source }
}

const coded = Object.fromEntries(
  Object.entries(codedModules).map(([path, variants]) => [splitPath(path)[0], variants]),
)

export const { parts, planes, partsPile } = buildCatalog({
  configs: partConfigs,
  drawings,
  coded,
  planes: planeSources,
  partsPile: partsPileSource,
})

function hasEveryPart<T>(record: Partial<Record<PartId, T>>): record is Record<PartId, T> {
  return partIds.every((id) => record[id] !== undefined)
}

function indexParts(): Record<PartId, Part> {
  const byId: Partial<Record<PartId, Part>> = {}
  for (const part of parts) byId[part.id] = part
  if (!hasEveryPart(byId)) throw new Error('A part is missing from the catalog')
  return byId
}

export const partById = indexParts()

export function visibleVariants(part: Part): Variant[] {
  return part.variants.filter((variant) => !variant.hidden)
}

export function findVariant(part: Part, idOrAlias: string): Variant | undefined {
  return part.variants.find(
    (variant) => variant.id === idOrAlias || variant.aliases.includes(idOrAlias),
  )
}

function isLook(values: Partial<Record<PartId, string>>): values is Look {
  return partIds.every((id) => {
    const value = values[id]
    return value !== undefined && findVariant(partById[id], value)?.id === value
  })
}

export function toLook(values: Partial<Record<PartId, string>>): Look {
  if (!isLook(values)) throw new Error('Not a complete look of known variants')
  return values
}

export const defaultLook = toLook(
  Object.fromEntries(
    parts.flatMap((part) => (part.variants[0] ? [[part.id, part.variants[0].id]] : [])),
  ),
)
