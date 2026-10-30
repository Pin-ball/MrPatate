import { partById } from '@src/lib/catalog/index.ts'
import { useEditor } from '@src/stores/editor.ts'
import { AnimatePresence } from 'motion/react'
import { PartVariants } from './PartVariants.tsx'

export function VariantsHand() {
  const part = useEditor((state) =>
    state.hand.kind === 'variants' ? partById[state.hand.part] : null,
  )

  return <AnimatePresence>{part && <PartVariants key={part.id} part={part} />}</AnimatePresence>
}
