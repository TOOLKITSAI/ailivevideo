import { describe, expect, it } from 'vitest';
import config, { excludedSitemapPaths } from '../../astro.config.mjs';

describe('Astro project configuration', () => {
  it('uses the production origin and trailing slashes', () => {
    expect(config.site).toBe('https://ailivevideo.net');
    expect(config.trailingSlash).toBe('always');
    expect(config.output).toBe('static');
  });
  it('excludes only the non-indexable error page from the sitemap', () => {
    expect([...excludedSitemapPaths]).toEqual([
      '/404/',
      '/404.html',
    ]);
  });
});