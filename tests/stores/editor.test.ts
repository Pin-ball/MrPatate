// @vitest-environment happy-dom
import { defaultLook } from '@src/lib/catalog/index.ts'
import {
  HISTORY_LIMIT,
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
})
