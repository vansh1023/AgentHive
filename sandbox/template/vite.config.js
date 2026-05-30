import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    hmr: {
      clientPort: 80,  // <-- Ye line bohot important hai ingress/proxy ke liye
      overlay: false
    },
    watch: {
      usePolling: true,
      interval: 1000,
      binaryInterval: 3000, // Binary files ke liye aur slow polling
      ignored: ['**/node_modules/**', '**/.git/**'] // In directories ko strictly ignore karein
    }
  }
})
