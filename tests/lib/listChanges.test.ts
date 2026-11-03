import type { ListEntry } from '@src/lib/listChanges.ts'
import { listChanges, withRemoved } from '@src/lib/listChanges.ts'
import { describe, expect, it } from 'vitest'

function items(...ids: string[]) {
  return ids.map((id) => ({ id }))
}

function shown(...ids: string[]) {
  return withRemoved(items(...ids), [])
}

function ids(entries: ListEntry<{ id: string }>[]) {
  return entries.map(({ item, index, removed }) => `${item.id}${index}${removed ? '-' : ''}`)
}

describe('listChanges', () => {
  it('reports nothing when the list did not change', () => {
    expect(listChanges(shown('a', 'b'), items('a', 'b'))).toEqual({ removed: [], added: null })
  })

  it('finds the added item, wherever it lands', () => {
    expect(listChanges(shown('a', 'b'), items('c', 'a', 'b')).added).toEqual({ id: 'c' })
  })

  it('keeps a removed item in the slot the next item slides into', () => {
    const { removed } = listChanges(shown('a', 'b', 'c'), items('a', 'c'))
    expect(ids(withRemoved(items('a', 'c'), removed))).toEqual(['a0', 'b1-', 'c1'])
    const last = listChanges(shown('a', 'b'), items('a')).removed
    expect(ids(withRemoved(items('a'), last))).toEqual(['a0', 'b1-'])
  })

  it('keeps an item still leaving when another one leaves', () => {
    const first = listChanges(shown('a', 'b', 'c'), items('a', 'c'))
    const second = listChanges(withRemoved(items('a', 'c'), first.removed), items('c'))
    expect(ids(withRemoved(items('c'), second.removed))).toEqual(['a0-', 'b0-', 'c0'])
  })

  it('brings back an item restored while it was leaving', () => {
    const { removed } = listChanges(shown('a', 'b'), items('b'))
    const restored = listChanges(withRemoved(items('b'), removed), items('a', 'b'))
    expect(restored).toEqual({ removed: [], added: { id: 'a' } })
  })
})
