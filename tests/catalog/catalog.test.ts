// @vitest-environment happy-dom

import { presets } from '@src/catalog/presets.ts'
import {
  defaultLook,
  findVariant,
  partById,
  partIds,
  parts,
  partsPile,
  planes,
} from '@src/lib/catalog/index.ts'
import { describe, expect, it } from 'vitest'

describe('catalog', () => {
  it('has unique part ids', () => {
    expect(new Set(partIds).size).toBe(parts.length)
  })

  it('resolves every id and alias to a single variant', () => {
    for (const part of parts) {
      for (const variant of part.variants) {
        for (const name of [variant.id, ...variant.aliases]) {
          expect(findVariant(part, name)).toBe(variant)
        }
      }
    }
  })

  it('uses visible variants by default', () => {
    for (const id of partIds) {
      expect(findVariant(partById[id], defaultLook[id])?.hidden).toBe(false)
    }
  })

  it('only draws on planes that list the part', () => {
    for (const part of parts) {
      const ids = planes.filter((plane) => plane.parts.includes(part.id)).map((plane) => plane.id)
      for (const variant of part.variants) {
        for (const plane of Object.keys(variant.layers)) expect(ids).toContain(plane)
      }
    }
  })

  it('draws the cape over the body on the same plane', () => {
    const body = planes.find((plane) => plane.id === 'body')
    expect(body?.parts).toEqual(['body', 'back'])
  })

  it('paints every Couleur and Fond variant', () => {
    for (const variant of [...partById.skin.variants, ...partById.background.variants]) {
      expect(variant.paint).not.toBeNull()
    }
  })

  it('keeps the unfinished mountain background hidden', () => {
    expect(findVariant(partById.background, 'mountain')?.hidden).toBe(true)
  })

  it('keeps the body out of the Parties pile', () => {
    expect(partsPile.map((part) => part.id)).not.toContain('body')
  })

  it('only uses visible variants in presets', () => {
    for (const preset of presets) {
      for (const [id, variantId] of Object.entries(preset.look)) {
        expect(findVariant(partById[id as keyof typeof partById], variantId)?.hidden).toBe(false)
      }
    }
  })
})
