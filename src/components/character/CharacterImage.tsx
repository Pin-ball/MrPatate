import { FRAME, viewBoxOf } from '@src/lib/catalog/camera.ts'
import { backgroundOf, layersOf, skinOf } from '@src/lib/catalog/layers.ts'
import type { Box, Look } from '@src/lib/catalog/types.ts'
import { Backdrop } from './Backdrop.tsx'
import { PartLayers } from './PartLayers.tsx'

type CharacterImageProps = {
  look: Look
  view?: Box
  width?: number
  height?: number
  label?: string
  className?: string
}

export function CharacterImage({
  look,
  view = FRAME,
  width,
  height,
  label,
  className,
}: CharacterImageProps) {
  const skin = skinOf(look)
  const [x0, y0, x1, y1] = view

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBoxOf(view)}
      width={width}
      height={height}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Backdrop
        paint={backgroundOf(look)}
        area={{ x: x0, y: y0, width: x1 - x0, height: y1 - y0 }}
      />
      {layersOf(look).map(({ plane, layers }) => (
        <g key={plane.id} data-plane={plane.id}>
          <PartLayers layers={layers} skin={skin} />
        </g>
      ))}
    </svg>
  )
}
