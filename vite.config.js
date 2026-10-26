import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: "/Canteen-Management/",
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/motion/') || id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/react-dom/')) {
            return 'vendor-react-dom';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/react-icons/')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
  server: {
    middlewares: [
      (req, res, next) => {
        if (!req.url.match(/\.\w+$/) && !req.url.startsWith('/api')) {
          req.url = '/index.html'
        }
        next()
      }
    ]
  }
})
