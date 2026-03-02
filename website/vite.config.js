import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/working-with-ai/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        de: 'de/index.html',
      },
    },
  },
});
