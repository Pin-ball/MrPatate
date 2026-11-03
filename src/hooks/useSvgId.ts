import { useId } from 'react'

export function useSvgId(prefix: string): string {
  const id = useId()
  return `${prefix}-${id.replace(/[^a-zA-Z0-9]/g, '')}`
}
