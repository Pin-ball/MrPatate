import { Character } from '@src/components/character/Character.tsx'
import { useWindowWidth } from '@src/hooks/useWindowWidth.ts'
import { cameraTransform, FRAME_CAMERA } from '@src/lib/catalog/camera.ts'
import { partById } from '@src/lib/catalog/index.ts'
import { fullHandTop } from '@src/lib/hand/geometry.ts'
import type { Hand } from '@src/stores/editor.ts'
import { useEditor } from '@src/stores/editor.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { Badge } from '@src/ui/Badge.tsx'
import { AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'

const CAMERA_WITHOUT_HAND = { ...FRAME_CAMERA, zoom: 1.3 }
const SHIFT_WITHOUT_HAND = -25
const SCENE_BOTTOM = 90

function handCamera(hand: Hand, width: number) {
  if (hand.kind === 'none') return cameraTransform(CAMERA_WITHOUT_HAND, SHIFT_WITHOUT_HAND)
  const partCamera = hand.kind === 'variants' ? partById[hand.part].camera : null
  return cameraTransform(partCamera ?? FRAME_CAMERA, (SCENE_BOTTOM - fullHandTop(width)) / 2)
}

export function Scene() {
  const { t } = useTranslation()
  const hand = useEditor((state) => state.hand)
  const previewing = useEditor((state) => state.preview !== null)
  const width = useWindowWidth()

  return (
    <div
      style={{ paddingBottom: SCENE_BOTTOM }}
      className="relative flex min-h-0 flex-1 items-center justify-center"
    >
      <div
        className="transition-transform duration-(--duration-move) ease-(--ease-out-strong)"
        style={handCamera(hand, width)}
      >
        <Character label={t('app.character')} className="aspect-4/5 w-90" />
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
