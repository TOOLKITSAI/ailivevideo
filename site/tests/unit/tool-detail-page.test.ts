import { readFile } from 'node:fs/promises';
import { expect, it } from 'vitest';

it('renders the authored tool Markdown in an editorial body section', async () => {
  const page = await readFile(new URL('../../src/pages/tools/[slug].astro', import.meta.url), 'utf8');

  expect(page).toContain('const { Content } = await tool.render();');
  expect(page).toMatch(/<section[^>]*class="tool-detail__editorial-body"[^>]*>[\s\S]*<Content\s*\/>[\s\S]*<\/section>/);
});