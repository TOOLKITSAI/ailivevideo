import { expect, test } from '@playwright/test';

test('directory controls are keyboard accessible', async ({ page }) => {
  await page.goto('/tools/');
  const search = page.getByRole('searchbox', { name: 'Search tools' });
  await search.focus();
  await expect(search).toBeFocused();
  await expect(page.getByRole('combobox', { name: 'Category' })).toBeVisible();
  await expect(page.getByText(/tools found/i)).toBeVisible();
});