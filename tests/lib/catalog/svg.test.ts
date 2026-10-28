// @vitest-environment happy-dom

import { boxOf, parseDrawing, parseNodes } from '@src/lib/catalog/svg.ts'
import { describe, expect, it } from 'vitest'

const LOCALES = ['fr', 'en']

const svg = (body: string, attrs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"${attrs}>${body}</svg>`

const titles = (text = 'A') => `<title lang="fr">${text}</title><title lang="en">${text}</title>`

describe('parseDrawing', () => {
  it('reads the label, roles and React attribute names of a single-plane drawing', () => {
    const drawing = parseDrawing(
      svg(
        `<title lang="fr">Œil &amp; demi</title><title lang="en">Eye</title><path data-role="skin" fill-rule="evenodd" fill="#21C488" d="M10 20L30 40"/>`,
      ),
      'eyes/test.svg',
      ['face'],
      LOCALES,
    )
    expect(drawing.label).toEqual({ fr: 'Œil & demi', en: 'Eye' })
    expect(drawing.hidden).toBe(false)
    expect(drawing.aliases).toEqual([])
    expect(drawing.layers['face']).toEqual([
      {
        tag: 'path',
        attrs: { 'data-role': 'skin', fillRule: 'evenodd', fill: '#21C488', d: 'M10 20L30 40' },
        children: [],
      },
    ])
    expect(drawing.box).toEqual([10, 20, 30, 40])
  })

  it('splits a multi-plane drawing by data-plane groups', () => {
    const drawing = parseDrawing(
      svg(
        `${titles()}<g data-plane="back"><path d="M0 0L1 1"/></g><g data-plane="front"><rect x="5" y="5" width="10" height="10"/></g>`,
      ),
      'arms/test.svg',
      ['back', 'front'],
      LOCALES,
    )
    expect(Object.keys(drawing.layers)).toEqual(['back', 'front'])
    expect(drawing.box).toEqual([0, 0, 15, 15])
  })

  it('reads hidden and aliases from the root', () => {
    const drawing = parseDrawing(
      svg(titles(), ' data-hidden="true" data-aliases="old ancient"'),
      'x.svg',
      ['face'],
      LOCALES,
    )
    expect(drawing.hidden).toBe(true)
    expect(drawing.aliases).toEqual(['old', 'ancient'])
    expect(drawing.layers).toEqual({})
    expect(drawing.box).toBeNull()
  })

  it.each([
    ['invalid markup', '<svg viewBox="0 0 800 1000"><title>', ['face'], /invalid SVG/],
    ['a missing title', svg('<path d="M0 0"/>'), ['face'], /missing label for fr, en/],
    ['a missing translation', svg('<title lang="fr">A</title>'), ['face'], /missing label for en/],
    ['a title without lang', svg('<title>A</title>'), ['face'], /lang attribute/],
    [
      'an unknown locale',
      svg(`${titles()}<title lang="de">A</title>`),
      ['face'],
      /unknown locale "de"/,
    ],
    [
      'a wrong viewBox',
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">${titles()}</svg>`,
      ['face'],
      /viewBox/,
    ],
    [
      'a plane not used by the part',
      svg(`${titles()}<g data-plane="side"/>`),
      ['back', 'front'],
      /not used by this part/,
    ],
    [
      'content outside plane groups',
      svg(`${titles()}<path d="M0 0"/>`),
      ['back', 'front'],
      /data-plane/,
    ],
    [
      'a duplicated plane',
      svg(`${titles()}<g data-plane="back"/><g data-plane="back"/>`),
      ['back', 'front'],
      /twice/,
    ],
    ['an id attribute', svg(`${titles()}<path id="x" d="M0 0"/>`), ['face'], /"id"/],
    [
      'an unsupported tag',
      svg(`${titles()}<image href="a.png"/>`),
      ['face'],
      /unsupported <image>/,
    ],
    [
      'a drawing on a part without plane',
      svg(`${titles()}<path d="M0 0"/>`),
      [],
      /not placed on any plane/,
    ],
  ])('rejects %s', (_, source, planes, error) => {
    expect(() => parseDrawing(source, 'x.svg', planes, LOCALES)).toThrow(error)
  })
})

describe('boxOf', () => {
  it('covers circles, ellipses and polygons and rounds outwards', () => {
    const nodes = parseNodes(
      '<circle cx="10.5" cy="10" r="2"/><ellipse cx="50" cy="50" rx="5" ry="1"/><polygon points="0,100 20,90.2 5,95"/>',
      'x.svg',
    )
    expect(boxOf(nodes)).toEqual([0, 8, 55, 100])
  })
})
