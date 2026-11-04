// @vitest-environment happy-dom
import { defaultLook } from '@src/lib/catalog/index.ts'
import type { Look } from '@src/lib/catalog/types.ts'
import { decodeLook, encodeLook, shareUrl, withoutLook } from '@src/lib/share.ts'
import { describe, expect, it } from 'vitest'

const look: Look = { ...defaultLook, eyes: 'hero', arms: 'club' }

describe('share', () => {
  it('encodes only what differs from the default look', () => {
    expect(encodeLook(defaultLook)).toBe('v1')
    expect(encodeLook(look)).toBe('v1&eyes=hero&arms=club')
  })

  it('decodes what it encodes', () => {
    expect(decodeLook(encodeLook(look))).toEqual({ look, complete: true })
    expect(decodeLook(`?${encodeLook(look)}&utm_source=mail`)).toEqual({ look, complete: true })
  })

  it('ignores addresses without a look', () => {
    expect(decodeLook('')).toBeNull()
    expect(decodeLook('eyes=hero')).toBeNull()
    expect(decodeLook('v=1&eyes=hero')).toBeNull()
  })

  it('falls back to the default for unknown variants', () => {
    expect(decodeLook('v1&eyes=gone&arms=club')).toEqual({
      look: { ...defaultLook, arms: 'club' },
      complete: false,
    })
  })

  it('reads an unknown version as best it can', () => {
    expect(decodeLook('v2&eyes=hero')).toEqual({
      look: { ...defaultLook, eyes: 'hero' },
      complete: false,
    })
  })

  it('builds a clean link from the page', () => {
    expect(shareUrl(look, 'https://example.com/patate/?eyes=six&ref=x#top')).toBe(
      'https://example.com/patate/?v1&eyes=hero&arms=club',
    )
    expect(shareUrl(defaultLook, 'https://example.com/')).toBe('https://example.com/?v1')
  })

  it('removes the look from the address only', () => {
    expect(withoutLook('https://example.com/?v1&eyes=hero')).toBe('https://example.com/')
    expect(withoutLook('https://example.com/?v1&eyes=hero&ref=x#top')).toBe(
      'https://example.com/?ref=x#top',
    )
  })
})
