// vite.config.ts
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: './',
  plugins: [preact()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          preact: ['preact', 'preact/hooks'],
          router: ['preact-router'],
          firebase: ['firebase/app', 'firebase/auth'],
        },
      },
    },
  },
  define: {
    __DEV__: false,
  }
});
