import type { PlaceStyle } from '@src/lib/hand/geometry.ts'
import type { HandState } from '@src/lib/hand/window.ts'
import { isScrollable } from '@src/lib/hand/window.ts'
import { seconds } from '@src/lib/motion.ts'
import { Appear } from '@src/ui/Appear.tsx'
import { Mouse } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'

const SCROLL_HINT_DELAY = 5000

export function ScrollHint({ state, style }: { state: HandState; style: PlaceStyle }) {
  const { t } = useTranslation()
  const { count, shape, unfolded, moving, scrolled } = state
  const shown = unfolded && !moving && isScrollable(count, shape) && !scrolled

  return (
    <AnimatePresence>
      {shown && (
        <Appear
          aria-hidden
          delay={seconds(SCROLL_HINT_DELAY)}
          style={{ ...style, zIndex: count + 1 }}
          className="border-foreground bg-card pointer-events-none absolute flex -translate-x-1/2 items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-xs font-bold whitespace-nowrap"
        >
          <Mouse className="wheel-motion size-4" />
          {t('hand.scroll_hint')}
        </Appear>
      )}
    </AnimatePresence>
  )
}
