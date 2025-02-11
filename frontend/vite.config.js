import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',  // Damit der Server auf allen Schnittstellen lauscht
    port: 5173       // Optional: explizite Portangabe, entspricht der docker-compose-Konfiguration
  }
})
