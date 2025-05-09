import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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