import { cameraOf, FRAME, MAX_ZOOM } from '@src/lib/catalog/camera.ts'
import type { Box, Variant } from '@src/lib/catalog/types.ts'
import { describe, expect, it } from 'vitest'

const variant = (box: Box | null, hidden = false): Variant => ({
  id: 'v',
  label: { fr: 'V', en: 'V' },
  hidden,
  aliases: [],
  box,
  layers: {},
  paint: null,
})

describe('cameraOf', () => {
  it('frames the whole of Pierre when nothing is drawn', () => {
    expect(cameraOf([variant(null)])).toEqual({ zoom: 1, focus: [400, 465] })
  })

  it('centres on the union of the visible variants', () => {
    const camera = cameraOf([variant([250, 350, 550, 650]), variant([0, 0, 800, 1000], true)])
    expect(camera.focus).toEqual([400, 500])
    expect(camera.zoom).toBe(1.1)
  })

  it('caps the zoom on tiny parts', () => {
    expect(cameraOf([variant([395, 495, 405, 505])]).zoom).toBe(MAX_ZOOM)
  })

  it('never zooms out below the frame', () => {
    expect(cameraOf([variant([0, 0, 800, 1000])]).zoom).toBe(1)
  })

  it('keeps the zoomed window inside the frame horizontally only', () => {
    const { zoom, focus } = cameraOf([variant([600, 700, 640, 740])])
    const [fx0, , fx1] = FRAME
    expect(focus[0] + (fx1 - fx0) / zoom / 2).toBeLessThanOrEqual(fx1 + 0.5)
    expect(focus[0] - (fx1 - fx0) / zoom / 2).toBeGreaterThanOrEqual(fx0 - 0.5)
    expect(focus[1]).toBe(720)
  })
})
