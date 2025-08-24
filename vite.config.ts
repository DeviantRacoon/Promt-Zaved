// vite.config.ts
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: './',
  plugins: [preact()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
