import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => { if (message.type() === 'error') throw new Error(message.text()); });
});

test('all six category routes render unique headings', async ({ page }) => {
  const paths = [
    '/categories/ai-avatars/',
    '/categories/real-time-generative-video/',
    '/categories/ai-video-agents/',
    '/categories/live-translation-dubbing/',
    '/categories/streaming-production-automation/',
    '/categories/ai-live-shopping/',
  ];

  const headings: string[] = [];
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    headings.push((await heading.textContent())?.trim() ?? '');
  }

  expect(new Set(headings).size).toBe(6);
});
test('trust and legal pages are available', async ({ page }) => {
  for (const path of ['/about/', '/editorial-policy/', '/affiliate-disclosure/', '/privacy/', '/terms/']) {
    expect((await page.goto(path))?.status()).toBe(200);
  }
  await page.goto('/editorial-policy/');
  await expect(page.getByRole('main')).toContainText(/official sources/i);
  await expect(page.getByRole('main')).toContainText(/last verified/i);
  await expect(page.getByRole('main')).toContainText(/corrections/i);
  await page.goto('/affiliate-disclosure/');
  await expect(page.getByRole('main')).toContainText(/do not determine our editorial conclusions/i);
});

test('representative tool, category, comparison, and guide routes render', async ({ page }) => {
  for (const route of ['/tools/heygen/', '/categories/ai-avatars/', '/compare/heygen-vs-synthesia/', '/guides/what-is-ai-live-video/']) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  }
});