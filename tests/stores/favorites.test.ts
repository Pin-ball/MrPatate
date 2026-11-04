// @vitest-environment happy-dom
import { defaultLook } from '@src/lib/catalog/index.ts'
import type { Look } from '@src/lib/catalog/types.ts'
import {
  addFavorite,
  FAVORITES_KEY,
  removeFavorite,
  restoreFavorite,
  useFavorites,
} from '@src/stores/favorites.ts'
import { beforeEach, describe, expect, it } from 'vitest'

function state() {
  return useFavorites.getState()
}

const sixEyes: Look = { ...defaultLook, eyes: 'six' }
const sadMouth: Look = { ...defaultLook, mouth: 'sad' }

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
    const [first, second] = state().favorites
    expect(first?.name).toBeDefined()
    expect(first?.name).not.toBe(second?.name)
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

  it('reads saved favorites back, skipping broken entries', async () => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify({
        state: { favorites: [{ id: 'a', createdAt: 1, look: sadMouth }, 'junk'] },
        version: 1,
      }),
    )
    await useFavorites.persist.rehydrate()
    expect(state().favorites).toEqual([{ id: 'a', createdAt: 1, look: sadMouth }])
  })
})
