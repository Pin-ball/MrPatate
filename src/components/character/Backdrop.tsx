import { useSvgId } from '@src/hooks/useSvgId.ts'
import type { BackgroundPaint } from '@src/lib/catalog/layers.ts'
import type { Box } from '@src/lib/catalog/types.ts'
import { SvgNodes } from './SvgNodes.tsx'

const AREA: Box = [-400, -500, 1200, 1500]

export function Backdrop({ paint }: { paint: BackgroundPaint }) {
  const patternId = useSvgId('pattern')
  const [x0, y0, x1, y1] = AREA
  const area = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }
  const { pattern } = paint

  return (
    <>
      <rect {...area} fill={paint.fill} />
      {pattern && (
        <>
          <defs>
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width={pattern.width}
              height={pattern.height}
              patternTransform={pattern.transform ?? undefined}
            >
              <SvgNodes nodes={pattern.nodes} />
            </pattern>
          </defs>
          <rect {...area} fill={`url(#${patternId})`} />
        </>
      )}
    </>
  )
}
