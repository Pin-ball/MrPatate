import { useActiveLayers } from '@src/hooks/useActiveLayers.ts'
import { useCharacterStore } from '@src/stores/character.ts'
import type { PointerEvent } from 'react'

function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
  const svg = event.currentTarget
  const bounds = svg.getBoundingClientRect()
  svg.style.setProperty('--pointer-x', String(1 - (event.clientX - bounds.x) / (bounds.width / 2)))
  svg.style.setProperty('--pointer-y', String(1 - (event.clientY - bounds.y) / (bounds.height / 2)))
}

function handlePointerLeave(event: PointerEvent<SVGSVGElement>) {
  event.currentTarget.style.removeProperty('--pointer-x')
  event.currentTarget.style.removeProperty('--pointer-y')
}

export function CharacterView() {
  const setSvgElement = useCharacterStore((state) => state.setSvgElement)
  const layers = useActiveLayers()

  return (
    <svg
      ref={setSvgElement}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="100"
      viewBox="0 0 800 1000"
      fill="#000"
      className="w-auto grow text-black"
    >
      <title>Pierre</title>
      {layers.map(({ id, Component, parallax }) => (
        <Component
          key={id}
          className="character-layer animate-layer-swap"
          style={{ '--parallax-x': parallax?.x ?? 0, '--parallax-y': parallax?.y ?? 0 }}
        />
      ))}
    </svg>
  )
}
