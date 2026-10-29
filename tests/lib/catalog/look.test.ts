// @vitest-environment happy-dom
import { defaultLook, partById, partIds, visibleVariants } from '@src/lib/catalog/index.ts'
import { lookEquals, randomLook, randomVariant, readLook } from '@src/lib/catalog/look.ts'
import { describe, expect, it } from 'vitest'

const sequence = (...values: number[]) => {
  let i = 0
  return () => values[i++ % values.length] ?? 0
}

describe('lookEquals', () => {
  it('compares every part', () => {
    expect(lookEquals(defaultLook, { ...defaultLook })).toBe(true)
    expect(lookEquals(defaultLook, { ...defaultLook, eyes: 'six' })).toBe(false)
  })
})

describe('randomVariant', () => {
  it('never returns the current variant', () => {
    for (const value of [0, 0.5, 0.999]) {
      expect(randomVariant(partById.arms, 'basic', () => value)).toBe('club')
    }
  })

  it('keeps the variant when there is no other choice', () => {
    expect(randomVariant(partById.body, 'basic')).toBe('basic')
  })

  it('never picks a hidden variant', () => {
    const picks = [0, 0.25, 0.5, 0.75, 0.999].map((value) =>
      randomVariant(partById.background, 'cream', () => value),
    )
    expect(picks).not.toContain('mountain')
  })
})

describe('randomLook', () => {
  it('picks a visible variant for every part', () => {
    const look = randomLook(defaultLook, sequence(0.1, 0.7, 0.4, 0.9))
    for (const id of partIds) {
      expect(visibleVariants(partById[id]).map((variant) => variant.id)).toContain(look[id])
    }
  })

  it('always differs from the current look', () => {
    const first = randomLook(defaultLook, () => 0)
    expect(
      lookEquals(
        randomLook(first, () => 0),
        first,
      ),
    ).toBe(false)
  })
})

describe('readLook', () => {
  it('fills missing and unknown parts with the default', () => {
    expect(readLook({ eyes: 'six', mouth: 'gone', hat: 'top' })).toEqual({
      ...defaultLook,
      eyes: 'six',
    })
    expect(readLook(null)).toEqual(defaultLook)
  })

  it('resolves aliases to the current id', () => {
    const six = partById.eyes.variants.find((variant) => variant.id === 'six')
    six?.aliases.push('spider')
    expect(readLook({ eyes: 'spider' }).eyes).toBe('six')
    six?.aliases.pop()
  })
})
