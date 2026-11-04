// @vitest-environment happy-dom
import { defaultLook } from '@src/lib/catalog/index.ts'
import type { Look } from '@src/lib/catalog/types.ts'
import type { Favorite } from '@src/lib/favorites.ts'
import {
  builtInFavorites,
  createFavoriteId,
  findFavorite,
  pickFavoriteName,
  readFavorites,
} from '@src/lib/favorites.ts'
import { describe, expect, it } from 'vitest'

const sixEyes: Look = { ...defaultLook, eyes: 'six' }

describe('builtInFavorites', () => {
  it('lists the presets, then the default look', () => {
    expect(builtInFavorites.map(({ id }) => id)).toEqual(['caveman', 'superhero', 'default'])
    expect(builtInFavorites[0]?.look).toEqual({
      ...defaultLook,
      mouth: 'big-tooth',
      eyes: 'bottom',
      arms: 'club',
    })
  })
})

describe('findFavorite', () => {
  it('finds a look among saved and built-in favorites', () => {
    const saved = { id: 'a', createdAt: 1, look: sixEyes }
    expect(findFavorite([saved], { ...sixEyes })).toBe(saved)
    expect(findFavorite([], defaultLook)?.id).toBe('default')
    expect(findFavorite([], sixEyes)).toBeUndefined()
  })
})

describe('readFavorites', () => {
  it('completes looks and skips invalid entries', () => {
    const favorites = readFavorites({
      favorites: [
        { id: 'a', createdAt: 1, name: 'Ploumi', look: { eyes: 'six', mouth: 'gone' } },
        { id: 'c', createdAt: 2, name: 3, look: sixEyes },
        { id: 'b', look: sixEyes },
        'junk',
      ],
    })
    expect(favorites).toEqual([
      { id: 'a', createdAt: 1, name: 'Ploumi', look: sixEyes },
      { id: 'c', createdAt: 2, look: sixEyes },
    ])
    expect(readFavorites(null)).toEqual([])
    expect(readFavorites({ favorites: 'junk' })).toEqual([])
  })
})

describe('favorite names', () => {
  it('picks a name no other favorite uses', () => {
    const used: Favorite = { id: 'a', name: 'Zigouigoui', createdAt: 1, look: sixEyes }
    expect(pickFavoriteName([used], () => 0)).toBe('Choupinou')
  })

  it('names built-in favorites after their preset and keeps those names out of the draw', () => {
    expect(builtInFavorites.map(({ name }) => name)).toEqual(['Silex', 'Captain', 'Original'])
    const draws = Array.from({ length: 60 }, (_, i) => pickFavoriteName([], () => i / 60))
    expect(draws).not.toContain('Silex')
  })
})

describe('createFavoriteId', () => {
  it('creates a new random id each time, without needing a secure context', () => {
    const id = createFavoriteId()
    expect(id).toMatch(/^[0-9a-f]{32}$/)
    expect(createFavoriteId()).not.toBe(id)
  })
})
