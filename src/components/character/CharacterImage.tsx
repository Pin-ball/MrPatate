import { FRAME } from '@src/lib/catalog/camera.ts'
import { backgroundOf, layersOf, skinOf } from '@src/lib/catalog/layers.ts'
import type { Box, Look } from '@src/lib/catalog/types.ts'
import { Backdrop } from './Backdrop.tsx'
import { viewBoxOf } from './nodes.ts'
import { PartLayers } from './PartLayers.tsx'

type CharacterImageProps = {
  look: Look
  view?: Box
  label?: string
  className?: string
}

export function CharacterImage({ look, view = FRAME, label, className }: CharacterImageProps) {
  const skin = skinOf(look)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBoxOf(view)}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Backdrop paint={backgroundOf(look)} />
      {layersOf(look).map(({ plane, layers }) => (
        <g key={plane.id} data-plane={plane.id}>
          <PartLayers layers={layers} skin={skin} />
        </g>
      ))}
    </svg>
  )
}
