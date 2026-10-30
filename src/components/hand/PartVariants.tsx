import { useHand } from '@src/hooks/useHand.ts'
import { useLabel } from '@src/hooks/useLocale.ts'
import { visibleVariants } from '@src/lib/catalog/index.ts'
import type { Part, VariantId } from '@src/lib/catalog/types.ts'
import {
  arcCardLayout,
  enterStyle,
  isInWindow,
  MOVE_DURATION,
  SHORT_MOVE_DURATION,
} from '@src/lib/hand.ts'
import { randomizeVariant, setPreview, setVariant, useEditor } from '@src/stores/editor.ts'
import { usePresence } from 'motion/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HiddenCards } from './HiddenCards.tsx'
import { RandomCard } from './RandomCard.tsx'
import { VariantCard } from './VariantCard.tsx'

export function PartVariants({ part }: { part: Part }) {
  const { t } = useTranslation()
  const label = useLabel()
  const look = useEditor((state) => state.look)
  const [present, safeToRemove] = usePresence()
  const variants = visibleVariants(part)
  const first = variants.length > 1 ? 1 : 0
  const count = variants.length + first
  const indexOf = (id: string) => variants.findIndex((variant) => variant.id === id) + first
  const { state, start, reveal, handlers } = useHand({
    count,
    open: present,
    resetKey: present,
    startIndex: indexOf(look[part.id]),
    unfoldDuration: MOVE_DURATION,
    foldDuration: SHORT_MOVE_DURATION,
  })
  const { offset, slots, unfolded, moving } = state

  useEffect(() => {
    if (!present && !moving) safeToRemove()
  }, [present, moving, safeToRemove])

  const layoutOf = (index: number) => {
    const layout = arcCardLayout(index, state)
    return unfolded && moving ? { ...layout, enter: enterStyle(index, start, slots) } : layout
  }

  return (
    <fieldset className="isolate" {...handlers}>
      <legend className="sr-only">{t('variants.label', { part: label(part) })}</legend>
      {first === 1 && isInWindow(0, state) && (
        <RandomCard
          layout={layoutOf(0)}
          onClick={() => randomizeVariant(part.id)}
          onPointerEnter={() => setPreview(null)}
          onFocus={() => {
            reveal(0)
            setPreview(null)
          }}
        />
      )}
      {variants.map((variant, variantIndex) => {
        const index = variantIndex + first
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
      <HiddenCards shown={unfolded} opening={moving} offset={offset} count={count} slots={slots} />
    </fieldset>
  )
}
