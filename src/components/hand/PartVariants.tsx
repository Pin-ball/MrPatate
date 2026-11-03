import { useLabel } from '@src/hooks/useLocale.ts'
import { useVariantsHand } from '@src/hooks/useVariantsHand.ts'
import { withVariant } from '@src/lib/catalog/look.ts'
import type { Part } from '@src/lib/catalog/types.ts'
import { randomizeVariant, setPreview, setVariant, useEditor } from '@src/stores/editor.ts'
import { Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { HandBar } from './HandBar.tsx'
import { HandDragArea } from './HandDragArea.tsx'
import { RandomCard } from './RandomCard.tsx'
import { ScrollCues } from './ScrollCues.tsx'
import { VariantCard } from './VariantCard.tsx'

export function PartVariants({ part }: { part: Part }) {
  const { t } = useTranslation()
  const labelOf = useLabel()
  const look = useEditor((state) => state.look)
  const { state, cards, firstIndex, hasRandomCard, layoutOf, rendered, reveal, handlers } =
    useVariantsHand(part)
  const partLabel = labelOf(part)

  return (
    <>
      <fieldset className="isolate touch-pan-y" {...handlers}>
        <legend className="sr-only">{t('variants.label', { part: partLabel })}</legend>
        <HandDragArea state={state} />
        {hasRandomCard && rendered(0) && (
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
        {cards.map(({ item: variant, index }) => {
          if (!rendered(index)) return null
          const chosen = look[part.id] === variant.id
          const showPreview = () =>
            setPreview(chosen ? null : withVariant(look, part.id, variant.id))
          return (
            <VariantCard
              key={`${part.id}:${variant.id}`}
              look={look}
              part={part}
              variant={variant}
              chosen={chosen}
              layout={layoutOf(index, variant.id)}
              onPointerEnter={showPreview}
              onFocus={() => {
                reveal(index)
                showPreview()
              }}
              onClick={() => setVariant(part.id, variant.id)}
            />
          )
        })}
        <ScrollCues state={state} />
      </fieldset>
      <HandBar state={state} firstIndex={firstIndex} icon={Layers} name={partLabel} />
    </>
  )
}
