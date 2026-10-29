// @vitest-environment happy-dom

import { defaultLook } from '@src/lib/catalog/index.ts'
import { characterSvg } from '@src/lib/export.ts'
import { describe, expect, it } from 'vitest'

describe('characterSvg', () => {
  it('produces a standalone svg sized on the frame', async () => {
    const svg = await characterSvg(defaultLook, 'Mr Patate')
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/)
    expect(svg).toContain('viewBox="180 190 440 550" width="440" height="550"')
    expect(svg).toContain('role="img" aria-label="Mr Patate"')
  })

  it('resolves the colours in the markup', async () => {
    const svg = await characterSvg({ ...defaultLook, skin: 'violet' }, 'Mr Patate')
    expect(svg).toContain('data-role="skin" fill="#C984FF"')
    expect(svg).not.toMatch(/class=|style=|var\(/)
  })
})
