import { defaultLook, findVariant, partById, partIds } from '@src/lib/catalog/index.ts'
import { readLook } from '@src/lib/catalog/look.ts'
import type { Look } from '@src/lib/catalog/types.ts'

const SHARE_VERSION = 'v1'
const VERSION = /^v\d+$/

type SharedLook = { look: Look; complete: boolean }

export function encodeLook(look: Look): string {
  const params = new URLSearchParams()
  for (const id of partIds) if (look[id] !== defaultLook[id]) params.set(id, look[id])
  return [SHARE_VERSION, params.toString()].filter(Boolean).join('&')
}

export function decodeLook(search: string): SharedLook | null {
  const values: Record<string, string> = Object.fromEntries(new URLSearchParams(search))
  const version = Object.keys(values).find((key) => VERSION.test(key))
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
  const versions = [...url.searchParams.keys()].filter((key) => VERSION.test(key))
  for (const key of [...versions, ...partIds]) url.searchParams.delete(key)
  return url.href
}
