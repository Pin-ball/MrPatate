import { partById, parts } from '@src/catalog/index.ts'
import type { Part, PartId, Variant } from '@src/catalog/types.ts'
import { useCharacterStore } from '@src/stores/character.ts'
import { IconButton } from '@src/ui/IconButton.tsx'
import clsx from 'clsx'
import { RotateCcw, Shuffle } from 'lucide-react'
import { useState } from 'react'

export function VariantPicker() {
  const [selectedPartId, setSelectedPartId] = useState<PartId>('body')
  const activeVariantId = useCharacterStore((state) => state.look[selectedPartId])
  const selectVariant = useCharacterStore((state) => state.selectVariant)
  const resetPart = useCharacterStore((state) => state.resetPart)
  const randomizePart = useCharacterStore((state) => state.randomizePart)

  const selectedPart = partById[selectedPartId]
  const activeVariant = selectedPart.variants.find((variant) => variant.id === activeVariantId)

  return (
    <div className="flex h-full">
      <div className="border-border mr-4 shrink-0 overflow-auto border-r pr-4">
        {parts.map((part) => (
          <PartTab
            key={part.id}
            part={part}
            selected={part.id === selectedPartId}
            onClick={() => setSelectedPartId(part.id)}
          />
        ))}
      </div>

      <div className="flex grow flex-col">
        <div className="mb-4 flex justify-between">
          <div>
            <p className="text-muted text-sm font-extralight">{selectedPart.label}</p>
            <p>{activeVariant?.label ?? 'Inconnu'}</p>
          </div>

          <div className="my-auto flex shrink-0 gap-2">
            <IconButton
              icon={RotateCcw}
              label="Réinitialiser"
              onClick={() => resetPart(selectedPartId)}
            />
            <IconButton
              icon={Shuffle}
              label="Aléatoire"
              onClick={() => randomizePart(selectedPartId)}
            />
          </div>
        </div>

        <ul key={selectedPartId} className="flex grow flex-wrap content-start gap-2 overflow-auto">
          {selectedPart.variants.map((variant, index) => (
            <VariantOption
              key={variant.id}
              variant={variant}
              index={index}
              active={variant.id === activeVariantId}
              onClick={() => selectVariant(selectedPartId, variant.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

type PartTabProps = {
  part: Part
  selected: boolean
  onClick: () => void
}

function PartTab({ part, selected, onClick }: PartTabProps) {
  return (
    <button
      type="button"
      title={part.label}
      aria-pressed={selected}
      onClick={onClick}
      className={clsx(
        'mb-2 block cursor-pointer rounded-full p-2',
        selected ? 'bg-accent-soft' : 'bg-surface-raised',
      )}
    >
      <img src={part.icon} alt={part.label} className="size-6" />
    </button>
  )
}

type VariantOptionProps = {
  variant: Variant
  index: number
  active: boolean
  onClick: () => void
}

function VariantOption({ variant, index, active, onClick }: VariantOptionProps) {
  return (
    <li
      className="animate-option-stagger opacity-0"
      style={{ animationDelay: `${(index + 1) * 50}ms` }}
    >
      <button
        type="button"
        title={variant.label}
        aria-pressed={active}
        onClick={onClick}
        className={clsx(
          'cursor-pointer rounded p-2',
          active ? 'bg-accent-soft' : 'hover:bg-surface-raised',
        )}
      >
        <img
          className={clsx('size-12', active && 'animate-option-pop')}
          src={variant.icon}
          alt={variant.label}
        />
      </button>
    </li>
  )
}
