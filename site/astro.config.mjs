import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const excludedPaths = new Set([
  '/affiliate-disclosure/',
  '/privacy/',
  '/terms/',
]);

export default defineConfig({
  site: 'https://ailivevideo.net',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !excludedPaths.has(new URL(page).pathname) }),
  ],
});