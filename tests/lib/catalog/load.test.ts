// @vitest-environment happy-dom

import type { CatalogSources } from '@src/lib/catalog/load.ts'
import { buildCatalog } from '@src/lib/catalog/load.ts'
import type { PartConfig } from '@src/lib/catalog/types.ts'
import { describe, expect, it } from 'vitest'

const LOCALES = ['fr', 'en']

const svg = (label: string, attrs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"${attrs}><title lang="fr">${label}</title><title lang="en">${label}</title><path d="M0 0L10 10"/></svg>`

const config = (extra: Partial<PartConfig> = {}): PartConfig => ({
  label: { fr: 'Partie', en: 'Part' },
  default: 'a',
  ...extra,
})

function build(sources: Partial<CatalogSources> & Pick<CatalogSources, 'configs'>) {
  const partIds = Object.keys(sources.configs)
  return buildCatalog({
    drawings: {},
    coded: {},
    planes: [{ id: 'main', depth: 1, parts: partIds }],
    partsPile: partIds,
    locales: LOCALES,
    ...sources,
  })
}

describe('buildCatalog', () => {
  it('orders the drawings as listed, then the others alphabetically', () => {
    const { parts } = build({
      configs: { eyes: config({ default: 'c', order: ['d', 'b'] }) },
      drawings: { eyes: { d: svg('D'), a: svg('A'), c: svg('C'), b: svg('B'), e: svg('E') } },
    })
    expect(parts[0]?.variants.map((variant) => variant.id)).toEqual(['c', 'd', 'b', 'a', 'e'])
  })

  it('puts the default first, then drawings in alphabetical order', () => {
    const { parts } = build({
      configs: { eyes: config({ default: 'c' }) },
      drawings: { eyes: { d: svg('D'), a: svg('A'), c: svg('C'), b: svg('B') } },
    })
    expect(parts[0]?.variants.map((variant) => variant.id)).toEqual(['c', 'a', 'b', 'd'])
  })

  it('keeps coded variants in their listed order, before drawings', () => {
    const { parts } = build({
      configs: { skin: config({ default: 'mint' }) },
      coded: {
        skin: [
          {
            id: 'pierre',
            label: { fr: 'Vert', en: 'Green' },
            skin: '#21C488',
            shadow: '#20A069',
          },
          { id: 'mint', label: { fr: 'Menthe', en: 'Mint' }, skin: '#20C1A9', shadow: '#1D9E83' },
          {
            id: 'apple',
            label: { fr: 'Pomme', en: 'Apple' },
            skin: '#3CC24D',
            shadow: '#399D3C',
          },
        ],
      },
    })
    expect(parts[0]?.variants.map((variant) => variant.id)).toEqual(['mint', 'pierre', 'apple'])
  })

  it('orders parts by the pile, then puts parts outside it alphabetically', () => {
    const { parts, partsPile } = build({
      configs: { zeta: config(), body: config(), late: config(), early: config() },
      drawings: {
        zeta: { a: svg('A') },
        body: { a: svg('A') },
        late: { a: svg('A') },
        early: { a: svg('A') },
      },
      partsPile: ['late', 'early'],
    })
    expect(parts.map((part) => part.id)).toEqual(['late', 'early', 'body', 'zeta'])
    expect(partsPile.map((part) => part.id)).toEqual(['late', 'early'])
  })

  it('rejects a coded variants folder missing from parts.ts', () => {
    expect(() =>
      build({
        configs: { eyes: config() },
        drawings: { eyes: { a: svg('A') } },
        coded: { hat: [{ id: 'red', label: { fr: 'Rouge', en: 'Red' }, fill: '#FF0000' }] },
      }),
    ).toThrow(/hat\/: this folder has no entry in parts\.ts/)
  })

  it('rejects a drawing folder missing from parts.ts', () => {
    expect(() =>
      build({
        configs: { eyes: config() },
        drawings: { eyes: { a: svg('A') }, hat: { cap: svg('C') } },
      }),
    ).toThrow(/hat\/: this folder has no entry in parts\.ts/)
  })

  it.each([
    ['an unknown part', ['eyes', 'hat'], /partsPile\): unknown part "hat"/],
    ['a part listed twice', ['eyes', 'eyes'], /partsPile\): a part is listed twice/],
  ])('rejects a parts pile with %s', (_, partsPile, error) => {
    expect(() =>
      build({ configs: { eyes: config() }, drawings: { eyes: { a: svg('A') } }, partsPile }),
    ).toThrow(error)
  })

  it('merges a coded variant with the drawing of the same id', () => {
    const { parts } = build({
      configs: { background: config({ default: 'cream' }) },
      coded: {
        background: [
          { id: 'cream', label: { fr: 'Crème', en: 'Cream' }, fill: '#FFF4DC' },
          {
            id: 'mountain',
            label: { fr: 'Montagne', en: 'Mountain' },
            fill: '#CFE8FF',
            hidden: true,
          },
        ],
      },
      drawings: { background: { mountain: svg('Montagne') } },
    })
    const [cream, mountain] = parts[0]?.variants ?? []
    expect(cream?.paint).toEqual({
      kind: 'background',
      fill: '#FFF4DC',
      pattern: null,
      dark: false,
    })
    expect(cream?.layers).toEqual({})
    expect(mountain?.hidden).toBe(true)
    expect(mountain?.layers['main']).toHaveLength(1)
  })

  it('parses background patterns', () => {
    const { parts } = build({
      configs: { background: config({ default: 'dots' }) },
      coded: {
        background: [
          {
            id: 'dots',
            label: { fr: 'Pois', en: 'Dots' },
            fill: '#FFF4DC',
            pattern: { width: 34, height: 34, svg: '<circle cx="17" cy="17" r="6.5"/>' },
          },
        ],
      },
    })
    const paint = parts[0]?.variants[0]?.paint
    expect(paint?.kind === 'background' && paint.pattern?.nodes[0]?.tag).toBe('circle')
  })

  it('splits a part drawn on several planes', () => {
    const arms = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><title lang="fr">B</title><title lang="en">A</title><g data-plane="back"><path d="M0 0"/></g><g data-plane="front"><path d="M1 1"/></g></svg>`
    const { parts, planes } = build({
      configs: { arms: config({ default: 'basic' }) },
      drawings: { arms: { basic: arms } },
      planes: [
        { id: 'back', depth: 2, parts: ['arms'] },
        { id: 'front', depth: 5, parts: ['arms'] },
      ],
    })
    expect(planes.map((plane) => plane.id)).toEqual(['back', 'front'])
    expect(Object.keys(parts[0]?.variants[0]?.layers ?? {})).toEqual(['back', 'front'])
  })

  it.each([
    [
      'an ordered variant that is not a drawing',
      { default: 'a', order: ['ghost'] },
      { a: svg('A') },
      /ordered variant "ghost" is not a drawing/,
    ],
    [
      'a missing default',
      { default: 'ghost' },
      { a: svg('A') },
      /default variant "ghost" does not exist/,
    ],
    [
      'a hidden default',
      {},
      { a: svg('A', ' data-hidden="true"') },
      /default variant "a" is hidden/,
    ],
    [
      'an alias clashing with an id',
      {},
      { a: svg('A'), b: svg('B', ' data-aliases="a"') },
      /"a" is used by both/,
    ],
    ['a non kebab-case file', {}, { a: svg('A'), Big_Tooth: svg('B') }, /invalid id/],
    ['no variant at all', {}, {}, /does not exist/],
  ])('rejects %s', (_, extra: Partial<PartConfig>, drawings, error) => {
    expect(() => build({ configs: { eyes: config(extra) }, drawings: { eyes: drawings } })).toThrow(
      error,
    )
  })

  it.each([
    [
      'a depth that does not increase',
      [
        { id: 'a', depth: 2, parts: [] },
        { id: 'b', depth: 2, parts: ['eyes'] },
      ],
      /increasing/,
    ],
    ['a non-integer depth', [{ id: 'a', depth: 1.5, parts: ['eyes'] }], /positive integers/],
    ['a zero depth', [{ id: 'a', depth: 0, parts: ['eyes'] }], /positive integers/],
    ['an unknown part', [{ id: 'a', depth: 1, parts: ['eyes', 'hat'] }], /unknown part "hat"/],
    [
      'a part listed twice in a plane',
      [{ id: 'a', depth: 1, parts: ['eyes', 'eyes'] }],
      /listed twice/,
    ],
    [
      'a plane declared twice',
      [
        { id: 'a', depth: 1, parts: ['eyes'] },
        { id: 'a', depth: 2, parts: [] },
      ],
      /declared twice/,
    ],
    ['a drawn part on no plane', [{ id: 'a', depth: 1, parts: [] }], /not placed on any plane/],
  ])('rejects planes with %s', (_, planes, error) => {
    expect(() =>
      build({ configs: { eyes: config() }, drawings: { eyes: { a: svg('A') } }, planes }),
    ).toThrow(error)
  })
})
