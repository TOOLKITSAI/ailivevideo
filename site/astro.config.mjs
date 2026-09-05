import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import responsiveTables from './src/lib/rehype-responsive-tables.mjs';

export const excludedSitemapPaths = new Set([
  '/404/',
  '/404.html',
]);

export default defineConfig({
  site: 'https://ailivevideo.net',
  output: 'static',
  markdown: { rehypePlugins: [responsiveTables] },
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !excludedSitemapPaths.has(new URL(page).pathname) }),
  ],
});