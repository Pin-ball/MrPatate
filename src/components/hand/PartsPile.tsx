import { usePile } from '@src/hooks/usePile.ts'
import { partsPile } from '@src/lib/catalog/index.ts'
import type { PartId } from '@src/lib/catalog/types.ts'
import { setHand, useEditor } from '@src/stores/editor.ts'
import { Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PartCard } from './PartCard.tsx'
import { Pile } from './Pile.tsx'

const COUNT = partsPile.length

export function PartsPile() {
  const { t } = useTranslation()
  const hand = useEditor((state) => state.hand)
  const look = useEditor((state) => state.look)
  const openPart = hand.kind === 'variants' ? hand.part : null
  const pile = usePile('parts', { count: COUNT, openingIndex: (COUNT - 1) / 2 })
  const { unfolded, held, layoutOf, rendered, reveal, spreadPile } = pile

  const isOnTop = (index: number, id: PartId) => (openPart ? id === openPart : index === held.last)

  const partLayout = (index: number, id: PartId) => {
    const isOpen = id === openPart
    return layoutOf(index, {
      zIndex: isOpen ? COUNT + 1 : index + 1,
      onTop: isOnTop(index, id),
      tilted: isOpen,
    })
  }

  const pickPart = (id: PartId) => {
    setHand(unfolded ? { kind: 'variants', part: id } : { kind: 'parts' })
  }

  return (
    <Pile
      pile={pile}
      icon={Layers}
      label={t('parts.label')}
      pileSlotLabel={t(unfolded ? 'parts.fold' : 'parts.unfold')}
      pileLabel={t('parts.label')}
    >
      {partsPile.map(
        (part, index) =>
          (part.id === openPart || rendered(index)) && (
            <PartCard
              key={part.id}
              part={part}
              look={look}
              layout={partLayout(index, part.id)}
              open={part.id === openPart}
              showCount={unfolded || isOnTop(index, part.id)}
              onClick={() => pickPart(part.id)}
              onPointerEnter={unfolded ? undefined : spreadPile}
              onFocus={() => reveal(index)}
            />
          ),
      )}
    </Pile>
  )
}
