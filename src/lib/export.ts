import { CharacterImage } from '@src/components/character/CharacterImage.tsx'
import { FRAME } from '@src/lib/catalog/camera.ts'
import type { Look } from '@src/lib/catalog/types.ts'
import { createElement } from 'react'

const [x0, y0, x1, y1] = FRAME
const FRAME_WIDTH = x1 - x0
const FRAME_HEIGHT = y1 - y0

const PNG_WIDTH = 1080

export async function characterSvg(look: Look, label: string): Promise<string> {
  const { renderToStaticMarkup } = await import('react-dom/server')
  return renderToStaticMarkup(
    createElement(CharacterImage, { look, label, width: FRAME_WIDTH, height: FRAME_HEIGHT }),
  )
}

export async function characterPng(look: Look, label: string, width = PNG_WIDTH): Promise<Blob> {
  const image = new Image()
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(await characterSvg(look, label))}`
  await image.decode()

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = Math.round((width * FRAME_HEIGHT) / FRAME_WIDTH)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D unavailable')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed'))),
      'image/png',
    ),
  )
}
