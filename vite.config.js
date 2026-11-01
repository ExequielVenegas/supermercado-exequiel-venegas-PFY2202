import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  build: { minify: 'esbuild', cssMinify: true },
  esbuild: { jsx: 'automatic', legalComments: 'none' },
});

