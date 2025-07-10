import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
          // Removemos firebase de manualChunks
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'public',
  optimizeDeps: {
    include: ['firebase']
  }
}) 