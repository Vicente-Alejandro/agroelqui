import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@assets": resolve(__dirname, "src/assets"),
      "@utils": resolve(__dirname, "src/utils"),
      "@stores": resolve(__dirname, "src/stores"),
    },
  },
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue"],
          charts: ["chart.js"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})

