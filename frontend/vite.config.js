import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'leaflet', 'react-leaflet', 'lucide-react']
  },
  server: {
    hmr: {
      overlay: true
    }
  }
});