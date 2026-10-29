import { defaultLook, findVariant, partById, partIds, visibleVariants } from './index.ts'
import type { Look, Part, PartId } from './types.ts'

type Random = () => number

const pick = <T>(items: T[], random: Random): T | undefined =>
  items[Math.floor(random() * items.length)]

export function lookEquals(a: Look, b: Look): boolean {
  return partIds.every((id) => a[id] === b[id])
}

export function randomVariant(part: Part, current: string, random: Random = Math.random): string {
  const others = visibleVariants(part).filter((variant) => variant.id !== current)
  return pick(others, random)?.id ?? current
}

export function randomLook(current: Look, random: Random = Math.random): Look {
  const look = Object.fromEntries(
    partIds.map((id) => [id, pick(visibleVariants(partById[id]), random)?.id ?? current[id]]),
  ) as Look
  if (!lookEquals(look, current)) return look

  const changeable = partIds.find((id) => visibleVariants(partById[id]).length > 1)
  return changeable ? withRandomVariant(look, changeable, random) : look
}

export function withRandomVariant(look: Look, id: PartId, random: Random = Math.random): Look {
  return { ...look, [id]: randomVariant(partById[id], look[id], random) }
}

export function readLook(source: unknown): Look {
  const values = typeof source === 'object' && source !== null ? source : {}
  return Object.fromEntries(
    partIds.map((id) => {
      const value: unknown = Reflect.get(values, id)
      const variant = typeof value === 'string' ? findVariant(partById[id], value) : undefined
      return [id, variant?.id ?? defaultLook[id]]
    }),
  ) as Look
}
