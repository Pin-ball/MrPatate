// @vitest-environment happy-dom
import { Character } from '@src/components/character/Character.tsx'
import { defaultLook } from '@src/lib/catalog/index.ts'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

describe('Character', () => {
  const markup = renderToStaticMarkup(<Character look={defaultLook} label="Pierre" />)

  it('labels the 3D stage as an image', () => {
    expect(markup).toMatch(/^<div role="img" aria-label="Pierre" class="character-stage"/)
  })

  it('stacks one svg per plane, without a backdrop', () => {
    expect(markup.match(/<svg/g)).toHaveLength(5)
    expect(markup).not.toContain('data-plane="backdrop"')
  })

  it('keeps the pupil role so the gaze can follow the pointer', () => {
    expect(markup.match(/data-role="eye-pupil"/g)).toHaveLength(2)
  })

  it('gives each plane its depth relative to the pivot', () => {
    expect(markup).toContain(
      'data-plane="scene" viewBox="180 190 440 550" class="character-plane" style="--depth:-40"',
    )
    expect(markup).toContain(
      'data-plane="back" viewBox="180 190 440 550" class="character-plane" style="--depth:40"',
    )
    expect(markup).toContain(
      'data-plane="front" viewBox="180 190 440 550" class="character-plane" style="--depth:100"',
    )
  })
})
