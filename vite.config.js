import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  css: {
    transformer: 'postcss'
  },
  build: {
    cssMinify: false,
    rollupOptions: {
      input: {
        main: r('./index.html'),
        game: r('./game.html'),
        classify: r('./classify.html'),
        gamedet: r('./gamedet.html'),
        search: r('./search.html')
      }
    }
  }
})
