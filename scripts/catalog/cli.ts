import { basename } from 'node:path'
import { OUTPUT_FILE, writeIds } from './ids.ts'

console.log(`${basename(OUTPUT_FILE)} ${writeIds() ? 'written' : 'up to date'}`)
