import { parts } from '@src/catalog/index.ts'
import type { ActiveLayer } from '@src/catalog/types.ts'
import { useCharacterStore } from '@src/stores/character.ts'

export function useActiveLayers(): ActiveLayer[] {
  const look = useCharacterStore((state) => state.look)

  return parts
    .flatMap((part) => {
      const variant = part.variants.find((v) => v.id === look[part.id])
      if (!variant) return []
      return variant.layers.map((layer, index) => ({
        ...layer,
        id: `${part.id}-${variant.id}-${index}`,
      }))
    })
    .sort((a, b) => a.z - b.z)
}
