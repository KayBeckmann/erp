// frontend/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Lade die .env-Datei aus dem übergeordneten Verzeichnis (Root)
  envDir: '../',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    hmr: {
      host: process.env.VITE_HMR_HOST || 'localhost'
    }
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  }
})
