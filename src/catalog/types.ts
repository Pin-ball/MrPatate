import type { ComponentType, SVGProps } from 'react'

export type PartId = 'body' | 'mouth' | 'eyes' | 'arms' | 'legs' | 'back' | 'background'

export type VariantId = string

export type Look = Record<PartId, VariantId>

export type Part = {
  id: PartId
  label: string
  variants: Variant[]
}

export type Variant = {
  id: VariantId
  label: string
  layers: Layer[]
}

export type Layer = {
  z: number
  Component: ComponentType<SVGProps<SVGGElement>>
  parallax?: { x: number; y: number }
}

export type ActiveLayer = Layer & {
  id: string
}

export type Preset = {
  id: string
  label: string
  look: Partial<Look>
}
