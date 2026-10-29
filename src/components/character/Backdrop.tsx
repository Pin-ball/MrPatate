import { useSvgId } from '@src/hooks/useSvgId.ts'
import type { BackgroundPaint } from '@src/lib/catalog/layers.ts'
import type { SVGProps } from 'react'
import { SvgNodes } from './SvgNodes.tsx'

type Area = Pick<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height'>

type BackdropProps = {
  paint: BackgroundPaint
  area: Area
}

export function Backdrop({ paint, area }: BackdropProps) {
  const patternId = useSvgId('pattern')
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
