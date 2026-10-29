import { defaultLook, findVariant, partById, partIds } from '@src/lib/catalog/index.ts'
import { readLook } from '@src/lib/catalog/look.ts'
import type { Look } from '@src/lib/catalog/types.ts'

const SHARE_VERSION = '1'
const VERSION_PARAM = 'v'

type SharedLook = { look: Look; complete: boolean }

export function encodeLook(look: Look): string {
  const params = new URLSearchParams({ [VERSION_PARAM]: SHARE_VERSION })
  for (const id of partIds) if (look[id] !== defaultLook[id]) params.set(id, look[id])
  return params.toString()
}

export function decodeLook(search: string): SharedLook | null {
  const values: Record<string, string> = Object.fromEntries(new URLSearchParams(search))
  const version = values[VERSION_PARAM]
  if (version === undefined) return null

  const known = partIds.every((id) => {
    const value = values[id]
    return value === undefined || findVariant(partById[id], value) !== undefined
  })
  return { look: readLook(values), complete: version === SHARE_VERSION && known }
}

export function shareUrl(look: Look, page: string): string {
  const url = new URL(page)
  url.search = encodeLook(look)
  url.hash = ''
  return url.href
}

export function withoutLook(page: string): string {
  const url = new URL(page)
  for (const key of [VERSION_PARAM, ...partIds]) url.searchParams.delete(key)
  return url.href
}
