import { defaultLook, partById, parts } from '@src/catalog/index.ts'
import { presets } from '@src/catalog/presets.ts'
import type { Look, Part, PartId, VariantId } from '@src/catalog/types.ts'
import { randomItem } from '@src/lib/random.ts'
import { create } from 'zustand'

type CharacterFields = {
  svgElement: SVGSVGElement | null
  look: Look
}

type CharacterActions = {
  setSvgElement: (svgElement: SVGSVGElement | null) => void
  selectVariant: (partId: PartId, variantId: VariantId) => void
  resetPart: (partId: PartId) => void
  randomizePart: (partId: PartId) => void
  applyPreset: (presetId: string) => void
  resetLook: () => void
  randomizeLook: () => void
}

function pickRandomVariantId(part: Part, excludedId?: VariantId): VariantId | undefined {
  return randomItem(part.variants.filter((variant) => variant.id !== excludedId))?.id
}

export const useCharacterStore = create<CharacterFields & CharacterActions>()((set) => ({
  svgElement: null,
  look: defaultLook,

  setSvgElement: (svgElement) => set({ svgElement }),

  selectVariant: (partId, variantId) =>
    set((state) => ({ look: { ...state.look, [partId]: variantId } })),

  resetPart: (partId) =>
    set((state) => ({ look: { ...state.look, [partId]: defaultLook[partId] } })),

  randomizePart: (partId) =>
    set((state) => {
      const variantId = pickRandomVariantId(partById[partId], state.look[partId])
      return variantId === undefined ? state : { look: { ...state.look, [partId]: variantId } }
    }),

  applyPreset: (presetId) => {
    const preset = presets.find((p) => p.id === presetId)
    if (preset) set({ look: { ...defaultLook, ...preset.look } })
  },

  resetLook: () => set({ look: defaultLook }),

  randomizeLook: () =>
    set((state) => {
      const look = { ...state.look }
      for (const part of parts) look[part.id] = pickRandomVariantId(part) ?? look[part.id]
      return { look }
    }),
}))
