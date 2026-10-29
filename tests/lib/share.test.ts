// @vitest-environment happy-dom
import { defaultLook, partById } from '@src/lib/catalog/index.ts'
import { decodeLook, encodeLook, shareUrl, withoutLook } from '@src/lib/share.ts'
import { describe, expect, it } from 'vitest'

const look = { ...defaultLook, eyes: 'hero', arms: 'club' } as const

describe('share', () => {
  it('encodes only what differs from the default look', () => {
    expect(encodeLook(defaultLook)).toBe('v=1')
    expect(encodeLook(look)).toBe('v=1&eyes=hero&arms=club')
  })

  it('decodes what it encodes', () => {
    expect(decodeLook(encodeLook(look))).toEqual({ look, complete: true })
    expect(decodeLook(`?${encodeLook(look)}`)).toEqual({ look, complete: true })
  })

  it('ignores addresses without a look', () => {
    expect(decodeLook('')).toBeNull()
    expect(decodeLook('eyes=hero')).toBeNull()
  })

  it('follows aliases', () => {
    const six = partById.eyes.variants.find((variant) => variant.id === 'six')
    six?.aliases.push('spider')
    expect(decodeLook('v=1&eyes=spider')).toEqual({
      look: { ...defaultLook, eyes: 'six' },
      complete: true,
    })
    six?.aliases.pop()
  })

  it('falls back to the default for unknown variants', () => {
    expect(decodeLook('v=1&eyes=gone&arms=club')).toEqual({
      look: { ...defaultLook, arms: 'club' },
      complete: false,
    })
  })

  it('ignores unrelated parameters', () => {
    expect(decodeLook('v=1&eyes=hero&utm_source=mail')).toEqual({
      look: { ...defaultLook, eyes: 'hero' },
      complete: true,
    })
  })

  it('reads an unknown version as best it can', () => {
    expect(decodeLook('v=2&eyes=hero')).toEqual({
      look: { ...defaultLook, eyes: 'hero' },
      complete: false,
    })
  })

  it('builds a clean link from the page', () => {
    expect(shareUrl(look, 'https://example.com/patate/?eyes=six&ref=x#top')).toBe(
      'https://example.com/patate/?v=1&eyes=hero&arms=club',
    )
  })

  it('removes the look from the address only', () => {
    expect(withoutLook('https://example.com/?v=1&eyes=hero')).toBe('https://example.com/')
    expect(withoutLook('https://example.com/?v=1&eyes=hero&ref=x#top')).toBe(
      'https://example.com/?ref=x#top',
    )
  })
})
