import { Character } from '@src/components/character/Character.tsx'
import { useHandTop, useSceneSettings } from '@src/hooks/useLayout.ts'
import { cameraStyle, characterWidth } from '@src/lib/scene.ts'
import { useEditor } from '@src/stores/editor.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { Badge } from '@src/ui/Badge.tsx'
import { AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'

export function Scene() {
  const { t } = useTranslation()
  const hand = useEditor((state) => state.hand)
  const previewing = useEditor((state) => state.preview !== null)
  const scene = useSceneSettings()
  const handTop = useHandTop()

  return (
    <div
      style={{ paddingBottom: scene.bottomPadding }}
      className="[container-type:size] relative flex min-h-0 flex-1 items-center justify-center"
    >
      <div
        className="transition-transform duration-(--duration-move) ease-(--ease-out-strong)"
        style={{ ...cameraStyle(hand, scene, handTop), width: characterWidth(scene, handTop) }}
      >
        <Character label={t('app.character')} className="w-full" />
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
