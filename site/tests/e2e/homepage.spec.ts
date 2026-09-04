import { expect, test } from '@playwright/test';

test('homepage exposes the primary navigation and landmarks', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'AI Live Video', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});