// @vitest-environment happy-dom
import { defaultLook } from '@src/lib/catalog/index.ts'
import {
  addFavorite,
  FAVORITES_KEY,
  removeFavorite,
  restoreFavorite,
  useFavorites,
} from '@src/stores/favorites.ts'
import { beforeEach, describe, expect, it } from 'vitest'

const state = () => useFavorites.getState()
const sixEyes = { ...defaultLook, eyes: 'six' } as const
const sadMouth = { ...defaultLook, mouth: 'sad' } as const

beforeEach(() => {
  localStorage.clear()
  useFavorites.setState({ favorites: [] })
})

describe('favorites', () => {
  it('adds a new look first, once', () => {
    addFavorite(sixEyes)
    addFavorite(sadMouth)
    expect(addFavorite(sixEyes)).toBeNull()
    expect(addFavorite(defaultLook)).toBeNull()
    expect(state().favorites.map(({ look }) => look)).toEqual([sadMouth, sixEyes])
  })

  it('restores a removed favorite at its place', () => {
    addFavorite(sixEyes)
    addFavorite(sadMouth)
    const removal = removeFavorite(state().favorites[1]?.id ?? '')
    expect(state().favorites).toHaveLength(1)
    if (removal) restoreFavorite(removal)
    if (removal) restoreFavorite(removal)
    expect(state().favorites.map(({ look }) => look)).toEqual([sadMouth, sixEyes])
  })

  it('cannot remove a built-in favorite', () => {
    expect(removeFavorite('default')).toBeNull()
  })

  it('saves favorites in the browser', () => {
    const favorite = addFavorite(sixEyes)
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '{}')
    expect(saved).toEqual({ state: { favorites: [favorite] }, version: 1 })
  })

  it('reads saved favorites tolerantly', async () => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify({
        state: {
          favorites: [
            { id: 'a', createdAt: 1, look: { eyes: 'six', mouth: 'gone' } },
            { id: 'b', look: sadMouth },
            'junk',
          ],
        },
        version: 1,
      }),
    )
    await useFavorites.persist.rehydrate()
    expect(state().favorites).toEqual([{ id: 'a', createdAt: 1, look: sixEyes }])
  })
})
