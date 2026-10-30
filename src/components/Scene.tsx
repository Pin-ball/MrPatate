import { Character } from '@src/components/character/Character.tsx'
import { cameraTransform, FRAME_CAMERA } from '@src/lib/catalog/camera.ts'
import { partById } from '@src/lib/catalog/index.ts'
import { MOVE_DURATION } from '@src/lib/hand.ts'
import type { Hand } from '@src/stores/editor.ts'
import { useEditor, useShownLook } from '@src/stores/editor.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { Badge } from '@src/ui/Badge.tsx'
import { AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'

const CAMERA_WITHOUT_HAND = { ...FRAME_CAMERA, zoom: 1.3 }
const SHIFT_WITHOUT_HAND = -25
const SHIFT_WITH_HAND = -90

function handCamera(hand: Hand) {
  if (hand.kind === 'none') return cameraTransform(CAMERA_WITHOUT_HAND, SHIFT_WITHOUT_HAND)
  const partCamera = hand.kind === 'variants' ? partById[hand.part].camera : null
  return cameraTransform(partCamera ?? FRAME_CAMERA, SHIFT_WITH_HAND)
}

export function Scene() {
  const { t } = useTranslation()
  const look = useShownLook()
  const hand = useEditor((state) => state.hand)
  const previewing = useEditor((state) => state.preview !== null)

  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center">
      <div
        className="ease-out-strong transition-transform"
        style={{ ...handCamera(hand), transitionDuration: `${MOVE_DURATION}ms` }}
      >
        <Character look={look} label={t('app.character')} className="aspect-4/5 w-90" />
      </div>
      <AnimatePresence>
        {previewing && (
          <Appear className="absolute top-1.5 left-1/2 -translate-x-1/2">
            <Badge>{t('scene.preview')}</Badge>
          </Appear>
        )}
      </AnimatePresence>
    </div>
  )
}
