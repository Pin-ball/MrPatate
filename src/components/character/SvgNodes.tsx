import type { SkinPaint } from '@src/lib/catalog/layers.ts'
import type { SvgNode } from '@src/lib/catalog/types.ts'
import type { ReactElement } from 'react'
import { createElement, Fragment } from 'react'

type SvgNodesProps = {
  nodes: SvgNode[]
  skin?: SkinPaint | undefined
  shadowClip?: string | undefined
}

function fillOf({ attrs }: SvgNode, skin?: SkinPaint): string | undefined {
  if (skin && attrs['data-role'] === 'skin') return skin.skin
  if (skin && attrs['data-role'] === 'shadow') return skin.shadow
  return attrs['fill']
}

function renderNode(node: SvgNode, skin?: SkinPaint, shadowClip?: string): ReactElement {
  const element = createElement(
    node.tag,
    { ...node.attrs, fill: fillOf(node, skin) },
    ...node.children.map((child) => renderNode(child, skin, shadowClip)),
  )
  if (!shadowClip || node.attrs['data-role'] !== 'shadow') return element
  return createElement('g', { clipPath: `url(#${shadowClip})` }, element)
}

export function SvgNodes({ nodes, skin, shadowClip }: SvgNodesProps) {
  return createElement(Fragment, null, ...nodes.map((node) => renderNode(node, skin, shadowClip)))
}
