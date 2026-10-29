// @vitest-environment happy-dom
import { defaultLook } from '@src/lib/catalog/index.ts'
import {
  closeHand,
  HISTORY_LIMIT,
  LOOK_KEY,
  randomizeLook,
  randomizeVariant,
  redo,
  setHand,
  setLook,
  setPreview,
  setVariant,
  undo,
  useEditor,
} from '@src/stores/editor.ts'
import { beforeEach, describe, expect, it } from 'vitest'

const state = () => useEditor.getState()
const history = () => useEditor.temporal.getState()

beforeEach(() => {
  localStorage.clear()
  useEditor.setState({ look: defaultLook, preview: null, hand: { kind: 'none' } })
  history().clear()
})

describe('editor', () => {
  it('undoes and redoes variant changes', () => {
    setVariant('eyes', 'six')
    setVariant('mouth', 'sad')
    undo()
    expect(state().look).toEqual({ ...defaultLook, eyes: 'six' })
    undo()
    expect(state().look).toEqual(defaultLook)
    redo()
    expect(state().look.eyes).toBe('six')
  })

  it('records nothing when the look does not change', () => {
    setVariant('eyes', defaultLook.eyes)
    setLook({ ...defaultLook })
    setHand({ kind: 'parts' })
    expect(history().pastStates).toHaveLength(0)
  })

  it('keeps the preview and the open hand out of the history', () => {
    setPreview({ eyes: 'six' })
    setHand({ kind: 'variants', part: 'eyes' })
    expect(history().pastStates).toHaveLength(0)
    expect(state().look).toEqual(defaultLook)
  })

  it('drops the preview once a look is chosen', () => {
    setPreview({ eyes: 'six' })
    setVariant('mouth', 'sad')
    expect(state().preview).toBeNull()
  })

  it('limits the history', () => {
    for (let i = 0; i < HISTORY_LIMIT + 10; i++) setVariant('eyes', i % 2 ? 'six' : 'mono')
    expect(history().pastStates).toHaveLength(HISTORY_LIMIT)
  })

  it('randomizes the whole look, kept in the history', () => {
    randomizeLook()
    expect(state().look).not.toEqual(defaultLook)
    undo()
    expect(state().look).toEqual(defaultLook)
  })

  it('randomizes one part only', () => {
    randomizeVariant('arms')
    expect(state().look).toEqual({ ...defaultLook, arms: 'club' })
  })

  it('keeps only the look in the browser', () => {
    setVariant('eyes', 'six')
    setHand({ kind: 'parts' })
    setPreview({ mouth: 'sad' })
    const saved = JSON.parse(localStorage.getItem(LOOK_KEY) ?? '{}')
    expect(saved).toEqual({ state: { look: { ...defaultLook, eyes: 'six' } }, version: 1 })
  })

  it('reads the saved look tolerantly, outside the history', async () => {
    localStorage.setItem(
      LOOK_KEY,
      JSON.stringify({ state: { look: { eyes: 'six', mouth: 'gone' } }, version: 1 }),
    )
    await useEditor.persist.rehydrate()
    expect(state().look).toEqual({ ...defaultLook, eyes: 'six' })
    expect(history().pastStates).toHaveLength(0)
  })

  it('drops the preview when the hand changes', () => {
    setHand({ kind: 'variants', part: 'eyes' })
    setPreview({ eyes: 'six' })
    closeHand()
    expect(state().preview).toBeNull()
  })

  it('closes a hand of variants back to the parts, any other hand entirely', () => {
    setHand({ kind: 'variants', part: 'eyes' })
    closeHand()
    expect(state().hand).toEqual({ kind: 'parts' })
    closeHand()
    expect(state().hand).toEqual({ kind: 'none' })
    setHand({ kind: 'favorites' })
    closeHand()
    expect(state().hand).toEqual({ kind: 'none' })
  })
})
