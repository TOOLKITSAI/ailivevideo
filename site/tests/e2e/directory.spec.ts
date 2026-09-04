import { expect, test } from '@playwright/test';

test('directory controls are keyboard accessible', async ({ page }) => {
  await page.goto('/tools/');
  const search = page.getByRole('searchbox', { name: 'Search tools' });
  await search.focus();
  await expect(search).toBeFocused();
  await expect(page.getByRole('combobox', { name: 'Category' })).toBeVisible();
  await expect(page.getByText(/tools found/i)).toBeVisible();
});
test('shows the prescribed empty state when no published tools exist', async ({ page }) => {
  await page.goto('/tools/');
  await expect(page.getByRole('heading', { name: 'No tools match these filters yet' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible();
});