import { DURATIONS, EASES, MOTION_VARIABLES } from '@src/lib/motion.ts'
import { describe, expect, it } from 'vitest'

describe('MOTION_VARIABLES', () => {
  it('exposes every duration and ease to the CSS', () => {
    expect(MOTION_VARIABLES['--duration-bounce']).toBe(`${DURATIONS.bounce}ms`)
    expect(MOTION_VARIABLES['--duration-appear-fade']).toBe(`${DURATIONS.appearFade}ms`)
    expect(MOTION_VARIABLES['--ease-out-strong']).toBe('cubic-bezier(0.2, 0.8, 0.2, 1)')
    expect(Object.keys(MOTION_VARIABLES)).toHaveLength(
      Object.keys(DURATIONS).length + Object.keys(EASES).length,
    )
  })
})
