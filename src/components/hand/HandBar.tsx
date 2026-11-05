import { useHandGeometry } from '@src/hooks/useLayout.ts'
import type { HandState } from '@src/lib/hand/window.ts'
import { handPosition } from '@src/lib/hand/window.ts'
import { closeHand, useEditor } from '@src/stores/editor.ts'
import { Appear } from '@src/ui/Appear.tsx'
import type { LucideIcon } from 'lucide-react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

type HandBarProps = {
  state: HandState
  firstIndex: number
  icon: LucideIcon
  name: string
}

const ICON_SIZE = 18

export function HandBar({ state, firstIndex, icon: Icon, name }: HandBarProps) {
  const { t } = useTranslation()
  const { lowerPiles } = useHandGeometry()
  const handWasOpen = useEditor((editor) => editor.previousHand.kind !== 'none')
  if (!lowerPiles) return null

  const { position, total } = handPosition(state.offset, state.count, state.shape, firstIndex)

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--safe-bottom)+24px)] z-25 flex justify-center">
      <AnimatePresence>
        {state.unfolded && (handWasOpen || !state.moving) && (
          <Appear
            layoutId="hand-bar"
            initial={handWasOpen ? false : undefined}
            style={{ borderRadius: 999 }}
            className="border-stroke bg-card pressable pointer-events-auto"
          >
            <button
              type="button"
              aria-label={t('hand.close', { name })}
              onClick={closeHand}
              className="flex h-11 cursor-pointer items-center px-4 text-sm font-bold whitespace-nowrap"
            >
              <motion.span layout="position" className="flex items-center gap-2">
                <Icon size={ICON_SIZE} />
                {name}
                <span className="text-muted-foreground font-medium">·</span>
                <span className="text-muted-foreground font-medium tabular-nums">
                  {position}/{total}
                </span>
                <X size={ICON_SIZE} className="ms-2" />
              </motion.span>
            </button>
          </Appear>
        )}
      </AnimatePresence>
    </div>
  )
}
