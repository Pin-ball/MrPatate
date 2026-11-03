import { presets } from '@src/catalog/presets.ts'
import { defaultLook } from '@src/lib/catalog/index.ts'
import { lookEquals, readLook } from '@src/lib/catalog/look.ts'
import type { Look } from '@src/lib/catalog/types.ts'
import { readField } from '@src/lib/utils.ts'

export type Favorite = {
  id: string
  name?: string
  createdAt: number
  look: Look
}

export const DEFAULT_FAVORITE_ID = 'default'

export const builtInFavorites: Favorite[] = [
  ...presets.map(({ id, look }) => ({ id, createdAt: 0, look: { ...defaultLook, ...look } })),
  { id: DEFAULT_FAVORITE_ID, createdAt: 0, look: defaultLook },
]

export function createFavoriteId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function allFavorites(favorites: Favorite[]): Favorite[] {
  return [...favorites, ...builtInFavorites]
}

export function findFavorite(favorites: Favorite[], look: Look): Favorite | undefined {
  return allFavorites(favorites).find((favorite) => lookEquals(favorite.look, look))
}

export function readFavorites(persisted: unknown): Favorite[] {
  const stored = readField(persisted, 'favorites')
  if (!Array.isArray(stored)) return []
  return stored.flatMap((item: unknown) => {
    const id = readField(item, 'id')
    const name = readField(item, 'name')
    const createdAt = readField(item, 'createdAt')
    if (typeof id !== 'string' || typeof createdAt !== 'number') return []
    const look = readLook(readField(item, 'look'))
    return [{ id, createdAt, look, ...(typeof name === 'string' && { name }) }]
  })
}
