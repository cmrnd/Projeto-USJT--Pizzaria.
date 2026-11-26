import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Caminhos relativos: o site funciona em qualquer endereço (ex.: GitHub Pages)
  base: './',
  build: {
    // A cena 3D (three.js) é carregada sob demanda pelo Hero, num arquivo próprio
    chunkSizeWarningLimit: 1200,
  },
})
