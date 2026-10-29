import { usePile } from '@src/hooks/usePile.ts'
import { partsPile } from '@src/lib/catalog/index.ts'
import type { PartId } from '@src/lib/catalog/types.ts'
import { setHand, useEditor } from '@src/stores/editor.ts'
import { Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PartCard } from './PartCard.tsx'
import { Pile } from './Pile.tsx'

const COUNT = partsPile.length

export function PartsHand() {
  const { t } = useTranslation()
  const hand = useEditor((state) => state.hand)
  const look = useEditor((state) => state.look)
  const openPart = hand.kind === 'variants' ? hand.part : null
  const pile = usePile('parts', COUNT, (COUNT - 1) / 2)
  const { unfolded, state, layoutOf, rendered, reveal, spreadPile } = pile

  const layoutAt = (index: number, id: PartId) => {
    const isOpen = id === openPart
    const top = openPart ? isOpen : index === Math.min(COUNT, state.slots) - 1
    return layoutOf(index, { zIndex: isOpen ? COUNT + 1 : index + 1, top, tilted: isOpen })
  }

  const open = (id: PartId) => {
    setHand(unfolded ? { kind: 'variants', part: id } : { kind: 'parts' })
  }

  return (
    <Pile
      pile={pile}
      icon={Layers}
      label={t('parts.label')}
      slotLabel={t(unfolded ? 'parts.fold' : 'parts.unfold')}
      pileLabel={t('parts.label')}
    >
      {partsPile.map(
        (part, index) =>
          (part.id === openPart || rendered(index)) && (
            <PartCard
              key={part.id}
              part={part}
              look={look}
              layout={layoutAt(index, part.id)}
              open={part.id === openPart}
              onClick={() => open(part.id)}
              onPointerEnter={unfolded ? undefined : spreadPile}
              onFocus={() => reveal(index)}
            />
          ),
      )}
    </Pile>
  )
}
