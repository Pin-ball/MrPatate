import { Character } from '@src/components/character/Character.tsx'
import { cameraTransform, FRAME_CAMERA } from '@src/lib/catalog/camera.ts'
import { partById } from '@src/lib/catalog/index.ts'
import type { Hand } from '@src/stores/editor.ts'
import { useEditor, useShownLook } from '@src/stores/editor.ts'
import { Badge } from '@src/ui/Badge.tsx'
import { useTranslation } from 'react-i18next'

function handCamera(hand: Hand) {
  switch (hand.kind) {
    case 'none':
      return cameraTransform({ ...FRAME_CAMERA, zoom: 1.3 }, -25)
    case 'variants':
      return cameraTransform(partById[hand.part].camera, -125)
    default:
      return cameraTransform(FRAME_CAMERA, -90)
  }
}

export function Scene() {
  const { t } = useTranslation()
  const look = useShownLook()
  const hand = useEditor((state) => state.hand)
  const previewing = useEditor((state) => state.preview !== null)

  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center">
      <div className="ease-soft transition-transform duration-550" style={handCamera(hand)}>
        <Character look={look} label={t('character')} className="aspect-4/5 w-90" />
      </div>
      {previewing && (
        <Badge className="animate-fade-in absolute top-1.5 left-1/2 -translate-x-1/2">
          {t('preview')}
        </Badge>
      )}
    </div>
  )
}
