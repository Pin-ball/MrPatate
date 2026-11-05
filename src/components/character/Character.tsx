import { pivotDepth } from '@src/catalog/planes.ts'
import { useParallax } from '@src/hooks/useParallax.ts'
import { useRecentChange } from '@src/hooks/useRecentChange.ts'
import { FRAME, FRAME_RATIO, viewBoxOf } from '@src/lib/catalog/camera.ts'
import { layersOf, skinOf } from '@src/lib/catalog/layers.ts'
import { bouncingParts } from '@src/lib/catalog/look.ts'
import type { PartId } from '@src/lib/catalog/types.ts'
import { DURATIONS, seconds } from '@src/lib/motion.ts'
import { cn } from '@src/lib/utils.ts'
import { useEditor, useShownLook } from '@src/stores/editor.ts'
import type { TargetAndTransition } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { PartLayer } from './PartLayers.tsx'
import './character.css'

type CharacterPlaneProps = {
  id: string
  depth: number
  children: ReactNode
}

function CharacterPlane({ id, depth, children }: CharacterPlaneProps) {
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

const BOUNCE: TargetAndTransition = {
  scale: [1, 1.07, 0.985, 1],
  transition: { duration: seconds(DURATIONS.bounce), times: [0, 0.3, 0.7, 1], ease: 'easeInOut' },
}

type CharacterProps = {
  label: string
  className?: string
}

export function Character({ label, className }: CharacterProps) {
  const ref = useRef<HTMLDivElement>(null)
  useParallax(ref)
  const look = useShownLook()
  const chosenLook = useEditor((state) => state.look)
  const choice = useRecentChange(chosenLook, DURATIONS.bounce)
  const bouncing = choice ? bouncingParts(choice.previous, choice.value, look) : new Set<PartId>()
  const skin = skinOf(look)
  const planeLayers = layersOf(look)

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      style={{ aspectRatio: FRAME_RATIO }}
      className={cn('character-perspective', className)}
    >
      <div className="character-tilt">
        {planeLayers.map(({ plane, layers }) => (
          <CharacterPlane key={plane.id} id={plane.id} depth={plane.depth}>
            <AnimatePresence initial={false}>
              {layers.map((layer) => (
                <motion.g
                  key={`${layer.part}:${chosenLook[layer.part]}`}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  animate={bouncing.has(layer.part) ? BOUNCE : undefined}
                >
                  <PartLayer layer={layer} skin={skin} />
                </motion.g>
              ))}
            </AnimatePresence>
          </CharacterPlane>
        ))}
      </div>
    </div>
  )
}
