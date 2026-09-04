import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export const excludedSitemapPaths = new Set([
  '/about/',
  '/affiliate-disclosure/',
  '/editorial-policy/',
  '/privacy/',
  '/terms/',
]);

export default defineConfig({
  site: 'https://ailivevideo.net',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !excludedSitemapPaths.has(new URL(page).pathname) }),
  ],
});