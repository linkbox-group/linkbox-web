import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
// https://vite.dev/config/

const __filename = fileURLToPath(import.meta.url)
const _dirname = dirname(__filename)

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(_dirname, './src')
    }
  },
  server: {
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://linkbox.xyq777.com',
        changeOrigin: true,
        rewrite: (path) => path
      }
    } : undefined
  }
}))
