import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => { if (message.type() === 'error') throw new Error(message.text()); });
});

test('directory controls are keyboard accessible', async ({ page }) => {
  await page.goto('/tools/');
  const search = page.getByRole('searchbox', { name: 'Search tools' });
  await search.focus();
  await expect(search).toBeFocused();
  await expect(page.getByRole('combobox', { name: 'Category' })).toBeVisible();
  await expect(page.getByText(/tools found/i)).toBeVisible();
});
test('shows the prescribed empty state after filters exclude published tools', async ({ page }) => {
  await page.goto('/tools/');
  await page.getByRole('searchbox', { name: 'Search tools' }).fill('zzzz-not-a-tool');
  await expect(page.getByRole('heading', { name: 'No tools match these filters yet' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible();
});
test('directory filters, clears, and shows the no-results state', async ({ page }) => {
  await page.goto('/tools/');
  const count = page.locator('[data-result-count]');
  await page.getByRole('combobox', { name: 'Category' }).selectOption('ai-avatars');
  await expect(count).not.toHaveText('30');
  await page.getByRole('checkbox', { name: 'Free or trial access' }).check();
  await page.getByRole('checkbox', { name: 'API available' }).check();
  await page.getByRole('searchbox', { name: 'Search tools' }).fill('zzzz-not-a-tool');
  await expect(page.getByRole('heading', { name: 'No tools match these filters yet' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(count).toHaveText('30');
});