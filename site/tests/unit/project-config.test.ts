import { describe, expect, it } from 'vitest';
import config from '../../astro.config.mjs';

describe('Astro project configuration', () => {
  it('uses the production origin and trailing slashes', () => {
    expect(config.site).toBe('https://ailivevideo.net');
    expect(config.trailingSlash).toBe('always');
    expect(config.output).toBe('static');
  });
});