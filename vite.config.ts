import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The production build is served by server/relay.mjs (Express) on port 8787,
// which also hosts the WebSocket relay. Base is relative so it works from any host.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true, // expose dev server on LAN for quick multi-machine testing
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
})
