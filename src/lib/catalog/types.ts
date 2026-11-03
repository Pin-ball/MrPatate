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

export type Plane<Id extends string = PartId> = {
  id: string
  depth: number
  parts: Id[]
}

export type Camera = {
  zoom: number
  focus: [x: number, y: number]
}

type Pattern = {
  width: number
  height: number
  transform: string | null
  nodes: SvgNode[]
}

export type Paint =
  | { kind: 'skin'; color: string; shadow: string }
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

export type Part<Id extends string = PartId> = {
  id: Id
  label: Label
  camera: Camera | null
  variants: Variant[]
}

type CodedIdsOf<P extends PartId> = P extends keyof CodedIds ? CodedIds[P] : never

type DrawingIdsOf<P extends PartId> = P extends keyof DrawingIds ? DrawingIds[P] : never

export type VariantId<P extends PartId = PartId> = CodedIdsOf<P> | DrawingIdsOf<P>

export type Look = { [P in PartId]: VariantId<P> }

export type Preset = {
  id: string
  look: Partial<Look>
}
