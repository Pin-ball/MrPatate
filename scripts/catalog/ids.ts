import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'

export const CATALOG_DIR = resolve(import.meta.dirname, '../../src/catalog')
export const OUTPUT_FILE = resolve(import.meta.dirname, '../../src/lib/catalog/ids.gen.ts')
export const CODED_FILE = 'variants.ts'

export type CatalogFiles = {
  drawings: Record<string, string[]>
  coded: string[]
}

export function readIds(root = CATALOG_DIR): CatalogFiles {
  const files: CatalogFiles = { drawings: {}, coded: [] }
  const folders = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
  for (const folder of folders) {
    const names = readdirSync(join(root, folder))
    const drawings = names
      .filter((name) => name.endsWith('.svg'))
      .map((name) => basename(name, '.svg'))
      .sort()
    if (drawings.length) files.drawings[folder] = drawings
    if (names.includes(CODED_FILE)) files.coded.push(folder)
  }
  return files
}

export function renderIds({ drawings, coded }: CatalogFiles, root: string, output: string): string {
  const quote = (value: string) => `'${value}'`
  const drawingLines = Object.entries(drawings).map(
    ([folder, ids]) => `  ${quote(folder)}: ${ids.map(quote).join(' | ')}`,
  )
  const codedLines = coded.map((folder) => {
    const path = relative(dirname(output), join(root, folder, CODED_FILE))
    return `  ${quote(folder)}: (typeof import(${quote(path)}))['default'][number]['id']`
  })
  return [
    `export type DrawingIds = {\n${drawingLines.join('\n')}\n}`,
    '',
    `export type CodedIds = {\n${codedLines.join('\n')}\n}`,
    '',
  ].join('\n')
}

export function writeIds(root = CATALOG_DIR, output = OUTPUT_FILE): boolean {
  const content = renderIds(readIds(root), root, output)
  if (existsSync(output) && readFileSync(output, 'utf8') === content) return false
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, content)
  return true
}
