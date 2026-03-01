import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mihaelaaa-23.github.io',
  base: 'tum-web-lab2',
  vite: {
    plugins: [tailwindcss()]
  }
});