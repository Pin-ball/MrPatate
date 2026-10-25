import { presets } from '@src/catalog/presets.ts'
import { useCharacterStore } from '@src/stores/character.ts'

export function PresetPicker() {
  const applyPreset = useCharacterStore((state) => state.applyPreset)

  return (
    <ul className="flex flex-wrap items-start gap-2 overflow-auto">
      {presets.map(({ id, label, icon }) => (
        <li key={id}>
          <button
            type="button"
            title={label}
            onClick={() => applyPreset(id)}
            className="hover:bg-surface-raised cursor-pointer rounded p-2"
          >
            <img className="size-12" src={icon} alt={label} />
          </button>
        </li>
      ))}
    </ul>
  )
}
