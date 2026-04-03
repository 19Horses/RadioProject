import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
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
