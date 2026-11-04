import { useHandGeometry, useHandTop } from '@src/hooks/useLayout.ts'
import { dragAreaStyle } from '@src/lib/hand/geometry.ts'
import type { HandState } from '@src/lib/hand/window.ts'

export function HandDragArea({ state }: { state: HandState }) {
  const { dragAreaAbove } = useHandGeometry()
  const handTop = useHandTop()

  if (dragAreaAbove === null || !state.unfolded) return null

  return <div style={dragAreaStyle(handTop, dragAreaAbove)} className="absolute inset-x-0" />
}
