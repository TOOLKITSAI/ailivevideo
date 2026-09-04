import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const pageNames = ['about', 'editorial-policy', 'affiliate-disclosure', 'privacy', 'terms'];

describe('trust page source structure', () => {
  it.each(pageNames)('%s closes its layout and style block', (pageName) => {
    const source = readFileSync(resolve(process.cwd(), 'src', 'pages', `${pageName}.astro`), 'utf8').trim();

    expect(source).toContain('</BaseLayout>');
    expect(source).toMatch(/<style>[\s\S]*<\/style>$/);
  });
});
