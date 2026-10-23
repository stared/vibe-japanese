import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fixed port: progress lives in localStorage, which is per origin (port included).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vibe-japanese/' : '/',
  plugins: [react()],
  server: { port: 5200, strictPort: true },
}))
