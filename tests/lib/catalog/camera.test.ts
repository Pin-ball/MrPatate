import { cameraOf, FRAME, frameView, MAX_ZOOM, thumbnailView } from '@src/lib/catalog/camera.ts'
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

function framed(...variants: Variant[]) {
  const camera = cameraOf(variants)
  if (!camera) throw new Error('expected a camera')
  return camera
}

describe('cameraOf', () => {
  it('has no camera of its own when nothing is drawn', () => {
    expect(cameraOf([variant(null)])).toBeNull()
  })

  it('centres on the union of the visible variants', () => {
    const camera = framed(variant([250, 350, 550, 650]), variant([0, 0, 800, 1000], true))
    expect(camera.focus).toEqual([400, 500])
    expect(camera.zoom).toBe(1.1)
  })

  it('caps the zoom on tiny parts', () => {
    expect(framed(variant([395, 495, 405, 505])).zoom).toBe(MAX_ZOOM)
  })

  it('never zooms out below the frame', () => {
    expect(framed(variant([0, 0, 800, 1000])).zoom).toBe(1)
  })

  it('keeps the zoomed window inside the frame horizontally only', () => {
    const { zoom, focus } = framed(variant([600, 700, 640, 740]))
    const [fx0, , fx1] = FRAME
    expect(focus[0] + (fx1 - fx0) / zoom / 2).toBeLessThanOrEqual(fx1 + 0.5)
    expect(focus[0] - (fx1 - fx0) / zoom / 2).toBeGreaterThanOrEqual(fx0 - 0.5)
    expect(focus[1]).toBe(720)
  })
})

describe('frameView', () => {
  it('zooms the frame around its center, cropped to a ratio', () => {
    expect(frameView(1, 550 / 440)).toEqual(FRAME)
    const [x0, y0, x1, y1] = frameView(1.1, 1)
    expect([(x0 + x1) / 2, (y0 + y1) / 2]).toEqual([400, 465])
    expect(x1 - x0).toBeCloseTo(400)
    expect(y1 - y0).toBeCloseTo(400)
  })
})

describe('thumbnailView', () => {
  it('crops a square around the variant, with a margin', () => {
    expect(thumbnailView(variant([300, 400, 500, 500]))).toEqual([270, 320, 530, 580])
  })

  it('keeps a minimum size for tiny variants', () => {
    expect(thumbnailView(variant([395, 495, 405, 505]))).toEqual([352, 452, 448, 548])
  })

  it('crops the whole character to a square when nothing is drawn', () => {
    expect(thumbnailView(variant(null))).toEqual(frameView(1, 1))
  })
})
