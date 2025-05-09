import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Portul pe care rulează frontend-ul
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // URL-ul backend-ului Flask
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});