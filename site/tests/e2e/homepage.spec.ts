import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => { if (message.type() === 'error') throw new Error(message.text()); });
});

test('homepage exposes the primary navigation and landmarks', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'AI Live Video', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('homepage follows the approved search-led hierarchy', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Find the right AI live video tool' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search AI live video tools' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Featured tools' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Learn about AI live video' })).toBeVisible();
});

test('site shell uses compact rows at the desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/');

  await expect(page.locator('.site-header__inner')).toHaveCSS('flex-direction', 'row');
  await expect(page.locator('.site-footer__inner')).toHaveCSS('flex-direction', 'row');
});
test('homepage has no horizontal overflow at the iPhone 13 width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

test('homepage search exposes a polite results region', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('[aria-live="polite"][data-search-results]')).toHaveCount(1);
});

test('homepage search returns a known tool route', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search AI live video tools' }).fill('HeyGen');
  await expect(page.locator('a[href="/tools/heygen/"]')).toHaveAttribute('href', /\/tools\/heygen\//);
});