import type { Look } from '@src/lib/catalog/types.ts'
import type { Favorite } from '@src/lib/favorites.ts'
import { findFavorite, readFavorites } from '@src/lib/favorites.ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Removal = { favorite: Favorite; index: number }

type FavoritesState = {
  favorites: Favorite[]
}

export const FAVORITES_KEY = 'mr-patate:favorites'

export const useFavorites = create<FavoritesState>()(
  persist((): FavoritesState => ({ favorites: [] }), {
    name: FAVORITES_KEY,
    version: 1,
    merge: (persisted, current) => ({ ...current, favorites: readFavorites(persisted) }),
  }),
)

const { getState, setState } = useFavorites

export function addFavorite(look: Look): Favorite | null {
  const { favorites } = getState()
  if (findFavorite(favorites, look)) return null
  const favorite = { id: crypto.randomUUID(), createdAt: Date.now(), look }
  setState({ favorites: [favorite, ...favorites] })
  return favorite
}

export function removeFavorite(id: string): Removal | null {
  const { favorites } = getState()
  const index = favorites.findIndex((favorite) => favorite.id === id)
  const favorite = favorites[index]
  if (!favorite) return null
  setState({ favorites: favorites.toSpliced(index, 1) })
  return { favorite, index }
}

export function restoreFavorite({ favorite, index }: Removal): void {
  const { favorites } = getState()
  if (favorites.some(({ id }) => id === favorite.id)) return
  setState({ favorites: favorites.toSpliced(index, 0, favorite) })
}
