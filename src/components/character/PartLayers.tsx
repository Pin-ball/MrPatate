import { useSvgId } from '@src/hooks/useSvgId.ts'
import type { Layer, SkinPaint } from '@src/lib/catalog/layers.ts'
import { renderNodes } from './nodes.ts'

const hasRole = (layer: Layer, role: string) =>
  layer.nodes.some((node) => node.attrs['data-role'] === role)

function PartLayer({ layer, skin }: { layer: Layer; skin: SkinPaint }) {
  const clipId = useSvgId('skin')
  const shadowClip = hasRole(layer, 'skin') && hasRole(layer, 'shadow') ? clipId : undefined

  return (
    <g data-part={layer.part}>
      {shadowClip && (
        <clipPath id={shadowClip}>
          {renderNodes(
            layer.nodes.filter((node) => node.attrs['data-role'] === 'skin'),
            skin,
          )}
        </clipPath>
      )}
      {renderNodes(layer.nodes, skin, shadowClip)}
    </g>
  )
}

export function PartLayers({ layers, skin }: { layers: Layer[]; skin: SkinPaint }) {
  return layers.map((layer) => <PartLayer key={layer.part} layer={layer} skin={skin} />)
}
