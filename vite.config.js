import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Absolute so assets resolve correctly from nested prerendered routes
  // (e.g. /mix/<slug>/index.html). Requires serving from the domain root.
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      "/cdn-img": {
        target: "https://d21zv5r7rdb0xb.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn-img/, ""),
      },
    },
  },
})
