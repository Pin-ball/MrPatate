import type { SkinPaint } from '@src/lib/catalog/layers.ts'
import type { Box, SvgNode } from '@src/lib/catalog/types.ts'
import type { ReactElement } from 'react'
import { createElement, Fragment } from 'react'

export function viewBoxOf([x0, y0, x1, y1]: Box): string {
  return `${x0} ${y0} ${x1 - x0} ${y1 - y0}`
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

export function renderNodes(nodes: SvgNode[], skin?: SkinPaint, shadowClip?: string): ReactElement {
  return createElement(Fragment, null, ...nodes.map((node) => renderNode(node, skin, shadowClip)))
}
