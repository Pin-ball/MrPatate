import { partConfigs, partsPile as partsPileSource } from '../../catalog/parts.ts'
import { planes as planeSources } from '../../catalog/planes.ts'
import { locales } from '../../i18n/locales.ts'
import { buildCatalog } from './load.ts'
import type { Look, Part, PartId, Variant, VariantConfig } from './types.ts'

export const partIds = Object.keys(partConfigs) as PartId[]

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
  locales,
})

export const partById = Object.fromEntries(parts.map((part) => [part.id, part])) as Record<
  PartId,
  Part
>

export const defaultLook = Object.fromEntries(
  parts.map((part) => [part.id, part.variants[0]?.id]),
) as Look

export function visibleVariants(part: Part): Variant[] {
  return part.variants.filter((variant) => !variant.hidden)
}

export function findVariant(part: Part, idOrAlias: string): Variant | undefined {
  return part.variants.find(
    (variant) => variant.id === idOrAlias || variant.aliases.includes(idOrAlias),
  )
}
