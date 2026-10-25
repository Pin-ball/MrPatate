type ImageSize = { width: number; height: number }

function toSvgBlob(svg: SVGSVGElement, size?: ImageSize): Blob {
  const clone = svg.cloneNode(true) as SVGSVGElement
  if (size) {
    clone.setAttribute('width', String(size.width))
    clone.setAttribute('height', String(size.height))
  }
  return new Blob([clone.outerHTML], { type: 'image/svg+xml;charset=utf-8' })
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadSvg(svg: SVGSVGElement, fileName: string) {
  saveBlob(toSvgBlob(svg), fileName)
}

export async function downloadPng(svg: SVGSVGElement, fileName: string, size: ImageSize) {
  const url = URL.createObjectURL(toSvgBlob(svg, size))
  try {
    const image = new Image()
    image.src = url
    await image.decode()

    const canvas = document.createElement('canvas')
    canvas.width = size.width
    canvas.height = size.height
    canvas.getContext('2d')?.drawImage(image, 0, 0, size.width, size.height)

    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (png) saveBlob(png, fileName)
  } finally {
    URL.revokeObjectURL(url)
  }
}
