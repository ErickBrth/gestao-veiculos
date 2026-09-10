import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/dealer': 'http://localhost:8080',
      '/vehicles': 'http://localhost:8080',
      '/addresses': 'http://localhost:8080',
      '/actuator': 'http://localhost:8080',
    },
  },
  // @ts-expect-error vitest config field
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
