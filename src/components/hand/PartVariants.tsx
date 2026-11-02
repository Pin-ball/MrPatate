import { useLabel } from '@src/hooks/useLocale.ts'
import { useVariantsHand } from '@src/hooks/useVariantsHand.ts'
import type { Part, VariantId } from '@src/lib/catalog/types.ts'
import { randomizeVariant, setPreview, setVariant, useEditor } from '@src/stores/editor.ts'
import { useTranslation } from 'react-i18next'
import { HiddenCards } from './HiddenCards.tsx'
import { RandomCard } from './RandomCard.tsx'
import { ScrollHint } from './ScrollHint.tsx'
import { VariantCard } from './VariantCard.tsx'

export function PartVariants({ part }: { part: Part }) {
  const { t } = useTranslation()
  const label = useLabel()
  const look = useEditor((state) => state.look)
  const { state, count, cards, hasRandomCard, layoutOf, rendered, reveal, handlers } =
    useVariantsHand(part)

  return (
    <fieldset className="isolate" {...handlers}>
      <legend className="sr-only">{t('variants.label', { part: label(part) })}</legend>
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
        const selected = look[part.id] === variant.id
        const preview = () => setPreview(selected ? null : { [part.id]: variant.id })
        return (
          <VariantCard
            key={`${part.id}:${variant.id}`}
            look={look}
            part={part}
            variant={variant}
            selected={selected}
            layout={layoutOf(index, variant.id)}
            onPointerEnter={preview}
            onFocus={() => {
              reveal(index)
              preview()
            }}
            onClick={() => setVariant(part.id, variant.id as VariantId)}
          />
        )
      })}
      <HiddenCards state={state} count={count} />
      <ScrollHint state={state} count={count} />
    </fieldset>
  )
}
