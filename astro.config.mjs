import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rebootyourcomputer.com.au',
  integrations: [],
  outDir: './dist',
  publicDir: './public',
  vite: {
    ssr: {
      external: ['tinacms']
    }
  }
});
