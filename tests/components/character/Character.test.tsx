// @vitest-environment happy-dom
import { Character } from '@src/components/character/Character.tsx'
import { defaultLook } from '@src/lib/catalog/index.ts'
import { useEditor } from '@src/stores/editor.ts'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

describe('Character', () => {
  useEditor.setState({ look: defaultLook, preview: null })
  const markup = renderToStaticMarkup(<Character label="Pierre" />)

  it('labels the 3D character as an image', () => {
    expect(markup).toMatch(
      /^<div role="img" aria-label="Pierre" style="aspect-ratio:0.8" class="character-perspective"/,
    )
  })

  it('stacks one svg per plane, without a backdrop', () => {
    expect(markup.match(/<svg/g)).toHaveLength(5)
    expect(markup).not.toContain('data-plane="backdrop"')
  })

  it('keeps the pupil role so the pupils can follow the pointer', () => {
    expect(markup.match(/data-role="eye-pupil"/g)).toHaveLength(2)
  })

  it('gives each plane its depth relative to the pivot', () => {
    expect(markup).toContain(
      'data-plane="background" viewBox="180 190 440 550" class="character-plane" style="--depth:-40"',
    )
    expect(markup).toContain(
      'data-plane="back" viewBox="180 190 440 550" class="character-plane" style="--depth:40"',
    )
    expect(markup).toContain(
      'data-plane="front" viewBox="180 190 440 550" class="character-plane" style="--depth:100"',
    )
  })
})
