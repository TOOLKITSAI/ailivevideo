import { expect, test } from '@playwright/test';

test('homepage exposes the primary navigation and landmarks', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'AI Live Video', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('site shell uses compact rows at the desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/');

  await expect(page.locator('.site-header__inner')).toHaveCSS('flex-direction', 'row');
  await expect(page.locator('.site-footer__inner')).toHaveCSS('flex-direction', 'row');
});