import { useHandGeometry } from '@src/hooks/useLayout.ts'
import type { HandState } from '@src/lib/hand/window.ts'
import { HiddenCounts } from './HiddenCounts.tsx'
import { ScrollHint } from './ScrollHint.tsx'

export function ScrollCues({ state }: { state: HandState }) {
  const { scrollCues } = useHandGeometry()
  if (!scrollCues) return null

  return (
    <>
      <HiddenCounts state={state} hiddenCountStyle={scrollCues.hiddenCountStyle} />
      <ScrollHint state={state} style={scrollCues.scrollHintStyle()} />
    </>
  )
}
