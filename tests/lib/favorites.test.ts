// @vitest-environment happy-dom
import { defaultLook } from '@src/lib/catalog/index.ts'
import { builtInFavorites, findFavorite, readFavorites } from '@src/lib/favorites.ts'
import { describe, expect, it } from 'vitest'

const sixEyes = { ...defaultLook, eyes: 'six' } as const

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
        { id: 'a', createdAt: 1, name: 'Pierre', look: { eyes: 'six', mouth: 'gone' } },
        { id: 'b', look: sixEyes },
        'junk',
      ],
    })
    expect(favorites).toEqual([{ id: 'a', createdAt: 1, name: 'Pierre', look: sixEyes }])
  })

  it('reads nothing from an empty or broken save', () => {
    expect(readFavorites(null)).toEqual([])
    expect(readFavorites({ favorites: 'junk' })).toEqual([])
  })
})
