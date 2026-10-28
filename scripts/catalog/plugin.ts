import { basename, relative } from 'node:path'
import type { Plugin } from 'vite'
import { CATALOG_DIR, OUTPUT_FILE, writeIds } from './ids.ts'

function isDrawing(file: string): boolean {
  return /^[^/]+\/([^/]+\.svg|variants\.ts)$/.test(relative(CATALOG_DIR, file))
}

export function catalog(): Plugin {
  return {
    name: 'mr-patate:catalog',
    buildStart() {
      writeIds()
    },
    configureServer(server) {
      server.watcher.on('all', (event, file) => {
        if ((event !== 'add' && event !== 'unlink') || !isDrawing(file)) return
        if (writeIds()) server.config.logger.info(`${basename(OUTPUT_FILE)} regenerated`)
      })
    },
  }
}
