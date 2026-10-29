import type { partConfigs } from '../../catalog/parts.ts'
import type { Locale } from '../../i18n/locales.ts'
import type { CodedIds, DrawingIds } from './ids.gen.ts'

export type PartId = keyof typeof partConfigs

export type Label = Record<Locale, string>

export type Box = [x0: number, y0: number, x1: number, y1: number]

export type SvgNode = {
  tag: string
  attrs: Record<string, string>
  children: SvgNode[]
}

export type Plane = {
  id: string
  depth: number
  parts: PartId[]
}

export type Camera = {
  zoom: number
  focus: [x: number, y: number]
}

export type Pattern = {
  width: number
  height: number
  transform: string | null
  nodes: SvgNode[]
}

export type Paint =
  | { kind: 'skin'; skin: string; shadow: string }
  | { kind: 'background'; fill: string; pattern: Pattern | null; dark: boolean }

export type VariantConfig = {
  id: string
  label: Label
  hidden?: boolean
  aliases?: readonly string[]
} & (
  | { skin: string; shadow: string }
  | {
      fill: string
      dark?: boolean
      pattern?: { width: number; height: number; transform?: string; svg: string }
    }
)

export type PartConfig = {
  label: Label
  default: string
  order?: readonly string[]
  camera?: Camera
}

export type Variant = {
  id: string
  label: Label
  hidden: boolean
  aliases: string[]
  box: Box | null
  layers: Record<string, SvgNode[]>
  paint: Paint | null
}

export type Part = {
  id: PartId
  label: Label
  camera: Camera
  variants: Variant[]
}

type CodedVariantIds<P extends PartId> = P extends keyof CodedIds ? CodedIds[P] : never

type DrawnIds<P extends PartId> = P extends keyof DrawingIds ? DrawingIds[P] : never

export type VariantId<P extends PartId = PartId> = CodedVariantIds<P> | DrawnIds<P>

export type Look = { [P in PartId]: VariantId<P> }

export type Preset = {
  id: string
  look: Partial<Look>
}
