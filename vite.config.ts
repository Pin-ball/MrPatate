import { resolve } from 'node:path'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { catalog } from './scripts/catalog/plugin.ts'

export default defineConfig({
  plugins: [
    catalog(),
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset({ panicThreshold: 'all_errors' })] }),
  ],
  resolve: {
    alias: { '@src': resolve(import.meta.dirname, 'src') },
  },
})
