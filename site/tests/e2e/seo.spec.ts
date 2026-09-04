import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => { if (message.type() === 'error') throw new Error(message.text()); });
});

test('homepage has canonical and website structured data', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ailivevideo.net/');
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain('WebSite');
});

test('filter controls do not create crawlable query URLs', async ({ page }) => {
  await page.goto('/tools/');
  await page.getByRole('checkbox', { name: 'API available' }).check();
  await expect(page).toHaveURL('http://127.0.0.1:4321/tools/');
});
