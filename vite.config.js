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
