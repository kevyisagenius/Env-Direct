import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
// import cesium from 'vite-plugin-cesium' // Removed
// import tailwindcss from '@tailwindcss/vite' // Removed Tailwind CSS v4 Vite plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // cesium(), // Removed
    // tailwindcss(), // Removed Tailwind CSS v4 Vite plugin
  ],
  // Add this section to explicitly optimize Cesium
  /* // Removed optimizeDeps for Cesium
  optimizeDeps: {
    include: ['cesium'],
  },
  */
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        './node_modules/leaflet/dist/images'
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
