import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { readIds, writeIds } from '../../scripts/catalog/ids.ts'

let root: string

function folder(name: string, files: string[]) {
  mkdirSync(join(root, name))
  for (const file of files) writeFileSync(join(root, name, file), '<svg/>')
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'catalog-'))
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
})

describe('readIds', () => {
  it('lists drawing ids and coded variants per folder', () => {
    folder('eyes', ['top.svg', 'basic.svg'])
    folder('skin', ['variants.ts'])
    folder('background', ['variants.ts', 'mountain.svg'])
    folder('lib', ['load.ts'])
    expect(readIds(root)).toEqual({
      drawings: { background: ['mountain'], eyes: ['basic', 'top'] },
      coded: ['background', 'skin'],
    })
  })
})

describe('writeIds', () => {
  it('writes typed drawing ids and skips unchanged output', () => {
    folder('eyes', ['basic.svg', 'top.svg'])
    folder('back', ['none.svg'])
    folder('skin', ['variants.ts'])
    const file = join(root, 'out', 'ids.gen.ts')
    expect(writeIds(root, file)).toBe(true)
    const output = readFileSync(file, 'utf8')
    expect(output).toContain("'back': 'none'")
    expect(output).toContain("'eyes': 'basic' | 'top'")
    expect(output).toContain(
      "'skin': (typeof import('../skin/variants.ts'))['default'][number]['id']",
    )
    expect(writeIds(root, file)).toBe(false)
  })
})
