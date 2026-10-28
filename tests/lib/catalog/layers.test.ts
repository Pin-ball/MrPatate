// @vitest-environment happy-dom
import { defaultLook } from '@src/lib/catalog/index.ts'
import { backgroundOf, layersOf, pivotDepth, skinOf } from '@src/lib/catalog/layers.ts'
import type { Look } from '@src/lib/catalog/types.ts'
import { describe, expect, it } from 'vitest'

const order = (look: Look) =>
  layersOf(look).flatMap(({ plane, layers }) => layers.map(({ part }) => `${plane.id}:${part}`))

describe('layersOf', () => {
  it('draws planes back to front, and parts in their plane order', () => {
    expect(order({ ...defaultLook, back: 'hero-cape' })).toEqual([
      'back:arms',
      'back:legs',
      'body:body',
      'body:back',
      'face:mouth',
      'face:eyes',
      'front:arms',
      'front:legs',
    ])
  })

  it('skips parts with nothing to draw on a plane', () => {
    expect(order(defaultLook)).not.toContain('body:back')
    expect(order(defaultLook)).not.toContain('scene:background')
  })

  it('falls back to the default variant for an unknown id', () => {
    const look = { ...defaultLook, eyes: 'gone' } as unknown as Look
    const eyes = layersOf(look)
      .flatMap(({ layers }) => layers)
      .find(({ part }) => part === 'eyes')
    expect(eyes?.variant.id).toBe(defaultLook.eyes)
  })

  it('pivots the parallax on the body plane', () => {
    expect(pivotDepth).toBe(3)
  })
})

describe('paints', () => {
  it('resolves the skin and background of a look', () => {
    const look: Look = { ...defaultLook, skin: 'violet', background: 'night' }
    expect(skinOf(look)).toEqual({ kind: 'skin', skin: '#C984FF', shadow: '#9D6FE0' })
    expect(backgroundOf(look)).toMatchObject({ fill: '#2F2A4A', dark: true })
  })
})
