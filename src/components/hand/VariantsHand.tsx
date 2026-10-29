import { useHand } from '@src/hooks/useHand.ts'
import { useLabel } from '@src/hooks/useLocale.ts'
import { partById, visibleVariants } from '@src/lib/catalog/index.ts'
import type { VariantId } from '@src/lib/catalog/types.ts'
import {
  arcCardLayout,
  ENTER_DURATION,
  enterStyle,
  isRendered,
  VARIANTS_ARC,
} from '@src/lib/hand.ts'
import { setPreview, setVariant, useEditor } from '@src/stores/editor.ts'
import { useTranslation } from 'react-i18next'
import { HiddenCards } from './HiddenCards.tsx'
import { VariantCard } from './VariantCard.tsx'

export function VariantsHand() {
  const { t } = useTranslation()
  const label = useLabel()
  const hand = useEditor((state) => state.hand)
  const look = useEditor((state) => state.look)
  const part = hand.kind === 'variants' ? partById[hand.part] : null
  const variants = part ? visibleVariants(part) : []
  const selectedIndex = part ? variants.findIndex((variant) => variant.id === look[part.id]) : 0
  const { state, start, reveal, handlers } = useHand({
    count: variants.length,
    arc: VARIANTS_ARC,
    open: part !== null,
    resetKey: part?.id,
    startIndex: selectedIndex,
    duration: ENTER_DURATION,
  })
  if (!part) return null

  const { offset, slots } = state

  return (
    <fieldset className="isolate" {...handlers}>
      <legend className="sr-only">{t('variants.label', { part: label(part) })}</legend>
      {variants.map((variant, index) => {
        if (!isRendered(index, { ...state, moving: false })) return null
        const selected = look[part.id] === variant.id
        const layout = arcCardLayout(index, VARIANTS_ARC, state)
        const preview = () => setPreview(selected ? null : { [part.id]: variant.id })
        return (
          <VariantCard
            key={`${part.id}:${variant.id}`}
            look={look}
            part={part}
            variant={variant}
            selected={selected}
            layout={{
              ...layout,
              place: { ...layout.place, ...enterStyle(index, start, slots, VARIANTS_ARC) },
            }}
            onPointerEnter={preview}
            onFocus={() => {
              reveal(index)
              preview()
            }}
            onClick={() => setVariant(part.id, variant.id as VariantId)}
          />
        )
      })}
      <HiddenCards offset={offset} count={variants.length} slots={slots} arc={VARIANTS_ARC} />
    </fieldset>
  )
}
