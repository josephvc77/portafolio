import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { pages } from './build/pages-plugin';

export default defineConfig({
  plugins: [pages()],
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      input: {
        es: resolve(__dirname, 'index.html'),
        en: resolve(__dirname, 'en/index.html'),
      },
      output: {
        // Keep heavy, lazily-loaded libraries in their own cacheable chunks.
        manualChunks: (id) => {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
          return undefined;
        },
      },
    },
  },
});
