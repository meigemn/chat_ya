import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    // Solución para resolver dependencias anidadas como react-icons
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react-icons',
        'react-icons/fa' // Incluye el subpaquete específico de Font Awesome
      ],
    }
  }
});