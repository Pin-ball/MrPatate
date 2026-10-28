// @vitest-environment happy-dom
import { CharacterImage } from '@src/components/character/CharacterImage.tsx'
import { defaultLook } from '@src/lib/catalog/index.ts'
import type { Look } from '@src/lib/catalog/types.ts'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

const render = (look: Look, label?: string) =>
  renderToStaticMarkup(
    label ? <CharacterImage look={look} label={label} /> : <CharacterImage look={look} />,
  )

describe('CharacterImage', () => {
  it('renders a single svg framed on Pierre', () => {
    const markup = render(defaultLook)
    expect(markup.match(/<svg/g)).toHaveLength(1)
    expect(markup).toContain('viewBox="180 190 440 550"')
  })

  it('paints the skin and its shadow with the chosen colour', () => {
    const markup = render({ ...defaultLook, skin: 'violet' })
    expect(markup).toContain('data-role="skin" fill="#C984FF"')
    expect(markup).toContain('data-role="shadow" fill="#9D6FE0"')
    expect(markup).not.toContain('#21C488')
  })

  it('clips each shadow to the skin of its part', () => {
    const markup = render(defaultLook)
    const clip = /<clipPath id="(skin-[a-zA-Z0-9]+)"><path data-role="skin"/.exec(markup)?.[1]
    expect(clip).toBeDefined()
    expect(markup).toContain(`<g clip-path="url(#${clip})"><path data-role="shadow"`)
  })

  it('draws a patterned background behind the planes', () => {
    const markup = render({ ...defaultLook, background: 'dots' })
    expect(markup).toMatch(/<pattern id="pattern-[a-zA-Z0-9]+"/)
    expect(markup.indexOf('<pattern')).toBeLessThan(markup.indexOf('data-plane="body"'))
  })

  it('is decorative without a label', () => {
    expect(render(defaultLook)).toContain('aria-hidden="true"')
    expect(render(defaultLook, 'Pierre')).toContain('role="img" aria-label="Pierre"')
  })
})
