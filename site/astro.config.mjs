import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ciobanu-irina.online',
  vite: {
    plugins: [tailwindcss()]
  }
});