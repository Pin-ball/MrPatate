import { resolve } from 'node:path'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset({ panicThreshold: 'all_errors' })] }),
  ],
  resolve: {
    alias: { '@src': resolve(import.meta.dirname, 'src') },
  },
})
