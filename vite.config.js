import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [react(), compression({ algorithm: "gzip" })],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          animations: ["framer-motion", "gsap"],
          ui: ["@mui/material", "bootstrap", "react-bootstrap"],
        },
      },
    },
  },

  server: {
    proxy: {
      "/api/recommendations": {
        target: "https://recsys.letstryfoods.com",
        changeOrigin: true,
        secure: true,
      },
      "/searchapi": {
        target: "https://recsys.letstryfoods.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/searchapi/, "/api"),
      },
    },
  },
  preview: {
    port: 5173,
  },
});
