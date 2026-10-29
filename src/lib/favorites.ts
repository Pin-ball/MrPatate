import { presets } from '@src/catalog/presets.ts'
import { defaultLook } from '@src/lib/catalog/index.ts'
import { lookEquals, readLook } from '@src/lib/catalog/look.ts'
import type { Look } from '@src/lib/catalog/types.ts'

export type Favorite = {
  id: string
  name?: string
  createdAt: number
  look: Look
}

export const builtInFavorites: Favorite[] = [
  ...presets.map(({ id, look }) => ({ id, createdAt: 0, look: { ...defaultLook, ...look } })),
  { id: 'default', createdAt: 0, look: defaultLook },
]

export function findFavorite(favorites: Favorite[], look: Look): Favorite | undefined {
  return [...favorites, ...builtInFavorites].find((favorite) => lookEquals(favorite.look, look))
}

export function readFavorites(persisted: unknown): Favorite[] {
  const stored: unknown =
    typeof persisted === 'object' && persisted !== null ? Reflect.get(persisted, 'favorites') : null
  if (!Array.isArray(stored)) return []
  return stored.flatMap((item: unknown) => {
    if (typeof item !== 'object' || item === null) return []
    const { id, name, createdAt, look } = item as Record<string, unknown>
    if (typeof id !== 'string' || typeof createdAt !== 'number') return []
    return [{ id, createdAt, look: readLook(look), ...(typeof name === 'string' && { name }) }]
  })
}
