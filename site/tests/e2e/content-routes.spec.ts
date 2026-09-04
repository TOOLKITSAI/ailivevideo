import { expect, test } from '@playwright/test';

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
