import { defaultLook } from '@src/lib/catalog/index.ts'
import { lookEquals, randomLook, readLook, withRandomVariant } from '@src/lib/catalog/look.ts'
import type { Look, PartId, VariantId } from '@src/lib/catalog/types.ts'
import { readField } from '@src/lib/utils.ts'
import { temporal } from 'zundo'
import { create, useStore } from 'zustand'
import { persist } from 'zustand/middleware'

export type Hand =
  | { kind: 'none' }
  | { kind: 'parts' }
  | { kind: 'variants'; part: PartId }
  | { kind: 'favorites' }

type EditorState = {
  look: Look
  preview: Partial<Look> | null
  hand: Hand
}

export const HISTORY_LIMIT = 50

export const LOOK_KEY = 'mr-patate:look'

export const useEditor = create<EditorState>()(
  persist(
    temporal(
      (): EditorState => ({
        look: defaultLook,
        preview: null,
        hand: { kind: 'none' },
      }),
      {
        partialize: ({ look }) => ({ look }),
        equality: (past, current) => lookEquals(past.look, current.look),
        limit: HISTORY_LIMIT,
      },
    ),
    {
      name: LOOK_KEY,
      version: 1,
      partialize: ({ look }) => ({ look }),
      merge: (persisted, current) => ({ ...current, look: readLook(readField(persisted, 'look')) }),
    },
  ),
)

const { getState, setState } = useEditor

export const setLook = (look: Look) => setState({ look, preview: null })

export const setVariant = <P extends PartId>(part: P, variant: VariantId<P>) =>
  setLook({ ...getState().look, [part]: variant })

export const randomizeLook = () => setLook(randomLook(getState().look))

export const randomizeVariant = (part: PartId) => setLook(withRandomVariant(getState().look, part))

export const undo = () => useEditor.temporal.getState().undo()

export const redo = () => useEditor.temporal.getState().redo()

export const setPreview = (preview: Partial<Look> | null) => setState({ preview })

export const setHand = (hand: Hand) => setState({ hand })

export function useShownLook(): Look {
  const look = useEditor((state) => state.look)
  const preview = useEditor((state) => state.preview)
  return preview ? { ...look, ...preview } : look
}

export function useHistory() {
  const canUndo = useStore(useEditor.temporal, (state) => state.pastStates.length > 0)
  const canRedo = useStore(useEditor.temporal, (state) => state.futureStates.length > 0)
  return { canUndo, canRedo }
}
