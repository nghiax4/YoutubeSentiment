import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Credit: ChatGPT
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true, // Ensure the origin of the request matches the target
      },
    },
  },
})
