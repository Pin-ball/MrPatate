import { pivotDepth } from '@src/catalog/planes.ts'
import { useParallax } from '@src/hooks/useParallax.ts'
import { FRAME, viewBoxOf } from '@src/lib/catalog/camera.ts'
import { layersOf, skinOf } from '@src/lib/catalog/layers.ts'
import type { Look } from '@src/lib/catalog/types.ts'
import { cn } from '@src/lib/utils.ts'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { PartLayers } from './PartLayers.tsx'
import './character.css'

type ScenePlaneProps = {
  id: string
  depth: number
  children: ReactNode
}

function ScenePlane({ id, depth, children }: ScenePlaneProps) {
  return (
    <svg
      data-plane={id}
      viewBox={viewBoxOf(FRAME)}
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
  className?: string
}

export function Character({ look, label, className }: CharacterProps) {
  const ref = useRef<HTMLDivElement>(null)
  useParallax(ref)
  const skin = skinOf(look)
  const planes = layersOf(look)

  return (
    <div ref={ref} role="img" aria-label={label} className={cn('character-stage', className)}>
      <div className="character-scene">
        {planes.map(({ plane, layers }) => (
          <ScenePlane key={plane.id} id={plane.id} depth={plane.depth}>
            <PartLayers layers={layers} skin={skin} />
          </ScenePlane>
        ))}
      </div>
    </div>
  )
}
