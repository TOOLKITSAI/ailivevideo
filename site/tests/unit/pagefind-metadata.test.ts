import { readFile } from 'node:fs/promises';
import { expect, it } from 'vitest';

const source = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

it('renders one Pagefind filter meta tag per supplied category', async () => {
  const layout = await source('../../src/layouts/BaseLayout.astro');

  expect(layout).toContain('pagefindContentType?: string');
  expect(layout).toContain('pagefindCategories?: string[]');
  expect(layout).toContain('data-pagefind-filter="content_type"');
  expect(layout).toContain('pagefindCategories.map((category) => <meta data-pagefind-filter="category" content={category} />)');
});

it('passes tool and category metadata to BaseLayout', async () => {
  const [toolPage, categoryPage] = await Promise.all([
    source('../../src/pages/tools/[slug].astro'),
    source('../../src/pages/categories/[slug].astro'),
  ]);

  expect(toolPage).toContain('pagefindContentType="tool"');
  expect(toolPage).toContain('pagefindCategories={tool.data.categories}');
  expect(categoryPage).toContain('pagefindContentType="category"');
  expect(categoryPage).toContain('pagefindCategories={[category]}');
});

it('passes article content types through ArticleLayout without requiring content entries', async () => {
  const [articleLayout, comparisonPage, guidePage] = await Promise.all([
    source('../../src/layouts/ArticleLayout.astro'),
    source('../../src/pages/compare/[slug].astro'),
    source('../../src/pages/guides/[slug].astro'),
  ]);

  expect(articleLayout).toContain('pagefindContentType?: string');
  expect(articleLayout).toContain('pagefindCategories?: string[]');
  expect(articleLayout).toContain('pagefindContentType={pagefindContentType}');
  expect(articleLayout).toContain('pagefindCategories={pagefindCategories}');
  expect(comparisonPage).toContain('pagefindContentType="comparison"');
  expect(comparisonPage).toContain('pagefindCategories={pagefindCategories}');
  expect(guidePage).toContain('pagefindContentType="guide"');
  expect(guidePage).toContain('pagefindCategories={pagefindCategories}');
});
