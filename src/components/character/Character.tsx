import { useParallax } from '@src/hooks/useParallax.ts'
import { FRAME, viewBoxOf } from '@src/lib/catalog/camera.ts'
import { backgroundOf, layersOf, pivotDepth, skinOf } from '@src/lib/catalog/layers.ts'
import type { Box, Look } from '@src/lib/catalog/types.ts'
import { cn } from '@src/lib/utils.ts'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { Backdrop } from './Backdrop.tsx'
import { PartLayers } from './PartLayers.tsx'
import './character.css'

type ScenePlaneProps = {
  id: string
  depth: number
  view: Box
  children: ReactNode
}

function ScenePlane({ id, depth, view, children }: ScenePlaneProps) {
  return (
    <svg
      data-plane={id}
      viewBox={viewBoxOf(view)}
      className="character-plane"
      style={{ '--depth': depth - pivotDepth }}
      aria-hidden
    >
      {children}
    </svg>
  )
}

type CharacterProps = {
  look: Look
  label: string
  view?: Box
  className?: string
}

export function Character({ look, label, view = FRAME, className }: CharacterProps) {
  const ref = useRef<HTMLDivElement>(null)
  useParallax(ref)
  const skin = skinOf(look)
  const planes = layersOf(look)
  const backdropDepth = planes[0]?.plane.depth ?? pivotDepth

  return (
    <div ref={ref} role="img" aria-label={label} className={cn('character-stage', className)}>
      <div className="character-scene">
        <ScenePlane id="backdrop" depth={backdropDepth} view={view}>
          <Backdrop paint={backgroundOf(look)} />
        </ScenePlane>
        {planes.map(({ plane, layers }) => (
          <ScenePlane key={plane.id} id={plane.id} depth={plane.depth} view={view}>
            <PartLayers layers={layers} skin={skin} />
          </ScenePlane>
        ))}
      </div>
    </div>
  )
}
