import { readField } from '@src/lib/utils.ts'
import { defaultLook, findVariant, partById, partIds, toLook, visibleVariants } from './index.ts'
import type { Look, Part, PartId } from './types.ts'

type Random = () => number

function pick<T>(items: T[], random: Random): T | undefined {
  return items[Math.floor(random() * items.length)]
}

export function lookEquals(a: Look, b: Look): boolean {
  return partIds.every((id) => a[id] === b[id])
}

export function randomVariantId(part: Part, current: string, random: Random = Math.random): string {
  const others = visibleVariants(part).filter((variant) => variant.id !== current)
  return pick(others, random)?.id ?? current
}

export function randomLook(current: Look, random: Random = Math.random): Look {
  const look = toLook(
    Object.fromEntries(
      partIds.map((id) => [id, pick(visibleVariants(partById[id]), random)?.id ?? current[id]]),
    ),
  )
  if (!lookEquals(look, current)) return look

  const changeable = partIds.find((id) => visibleVariants(partById[id]).length > 1)
  return changeable ? withRandomVariant(look, changeable, random) : look
}

export function withVariant(look: Look, part: PartId, variantId: string): Look {
  return toLook({ ...look, [part]: variantId })
}

export function withRandomVariant(look: Look, part: PartId, random: Random = Math.random): Look {
  return withVariant(look, part, randomVariantId(partById[part], look[part], random))
}

export function readLook(source: unknown): Look {
  return toLook(
    Object.fromEntries(
      partIds.map((id) => {
        const value = readField(source, id)
        const variant = typeof value === 'string' ? findVariant(partById[id], value) : undefined
        return [id, variant?.id ?? defaultLook[id]]
      }),
    ),
  )
}
