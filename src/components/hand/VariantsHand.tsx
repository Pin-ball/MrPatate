import { useHand } from '@src/hooks/useHand.ts'
import { useLabel } from '@src/hooks/useLocale.ts'
import { partById, visibleVariants } from '@src/lib/catalog/index.ts'
import type { VariantId } from '@src/lib/catalog/types.ts'
import {
  arcCardLayout,
  enterStyle,
  isInWindow,
  MOVE_DURATION,
  SHORT_MOVE_DURATION,
} from '@src/lib/hand.ts'
import { setPreview, setVariant, useEditor } from '@src/stores/editor.ts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiddenCards } from './HiddenCards.tsx'
import { VariantCard } from './VariantCard.tsx'

export function VariantsHand() {
  const { t } = useTranslation()
  const label = useLabel()
  const hand = useEditor((state) => state.hand)
  const look = useEditor((state) => state.look)
  const openPart = hand.kind === 'variants' ? partById[hand.part] : null
  const [lastPart, setLastPart] = useState(openPart)
  if (openPart && openPart !== lastPart) setLastPart(openPart)
  const part = openPart ?? lastPart
  const variants = part ? visibleVariants(part) : []
  const selectedIndex = part ? variants.findIndex((variant) => variant.id === look[part.id]) : 0
  const { state, start, reveal, handlers } = useHand({
    count: variants.length,
    open: openPart !== null,
    resetKey: openPart?.id,
    startIndex: selectedIndex,
    unfoldDuration: MOVE_DURATION,
    foldDuration: SHORT_MOVE_DURATION,
  })
  const { offset, slots, unfolded, moving } = state
  if (!part || !(unfolded || moving)) return null

  const layoutOf = (index: number) => {
    const layout = arcCardLayout(index, state)
    return unfolded && moving ? { ...layout, enter: enterStyle(index, start, slots) } : layout
  }

  return (
    <fieldset className="isolate" {...handlers}>
      <legend className="sr-only">{t('variants.label', { part: label(part) })}</legend>
      {variants.map((variant, index) => {
        if (!isInWindow(index, state)) return null
        const selected = look[part.id] === variant.id
        const preview = () => setPreview(selected ? null : { [part.id]: variant.id })
        return (
          <VariantCard
            key={`${part.id}:${variant.id}`}
            look={look}
            part={part}
            variant={variant}
            selected={selected}
            layout={layoutOf(index)}
            onPointerEnter={preview}
            onFocus={() => {
              reveal(index)
              preview()
            }}
            onClick={() => setVariant(part.id, variant.id as VariantId)}
          />
        )
      })}
      {unfolded && <HiddenCards offset={offset} count={variants.length} slots={slots} />}
    </fieldset>
  )
}
