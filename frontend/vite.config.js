import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Tailwind is handled by the Vite plugin above, so disable PostCSS config
  // file discovery to avoid loading any stray postcss.config.* files.
  css: {
    postcss: {},
  },
  server: {
    host: true,
  },
})
