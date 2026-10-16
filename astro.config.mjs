// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Public URL of the site (custom domain declared in wrangler.jsonc).
  site: 'https://honeye.me',
  output: 'static',
});
