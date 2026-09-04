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