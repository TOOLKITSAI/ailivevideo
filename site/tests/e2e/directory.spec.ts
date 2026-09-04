import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => { if (message.type() === 'error') throw new Error(message.text()); });
});

const visibleCards = (page: import('@playwright/test').Page) => page.locator('[data-tool-card]:not([hidden])');

test('directory controls are keyboard accessible', async ({ page }) => {
  await page.goto('/tools/');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();

  await page.reload();
  const headerLink = page.getByRole('link', { name: 'Tools', exact: true });
  const search = page.getByRole('searchbox', { name: 'Search tools' });
  const category = page.getByRole('combobox', { name: 'Category' });
  const free = page.getByRole('checkbox', { name: 'Free or trial access' });
  const api = page.getByRole('checkbox', { name: 'API available' });
  const firstCardLink = visibleCards(page).first().getByRole('link', { name: /View .* details/ });
  for (let tab = 0; tab < 8; tab += 1) {
    await page.keyboard.press('Tab');
    if (await headerLink.evaluate((element) => element === document.activeElement)) break;
  }
  await expect(headerLink).toBeFocused();
  await expect(headerLink).toBeVisible();
  await expect(headerLink).toHaveCSS('outline-style', 'solid');
  for (const control of [search, category, free, api]) {
    for (let tab = 0; tab < 8; tab += 1) {
      await page.keyboard.press('Tab');
      if (await control.evaluate((element) => element === document.activeElement)) break;
    }
    await expect(control).toBeFocused();
    await expect(control).toBeVisible();
    await expect(control).toHaveCSS('outline-style', 'solid');
  }
  for (let tab = 0; tab < 8; tab += 1) {
    await page.keyboard.press('Tab');
    if (await firstCardLink.evaluate((element) => element === document.activeElement)) break;
  }
  await expect(firstCardLink).toBeFocused();
  await expect(firstCardLink).toBeVisible();
  await expect(firstCardLink).toHaveCSS('outline-style', 'solid');
});
test('directory filters each capability and combines matching results', async ({ page }) => {
  await page.goto('/tools/');
  const data = await page.locator('#directory-tools').textContent();
  const tools = JSON.parse(data ?? '[]') as Array<{ categorySlugs: string[]; freeAccessStatus: string; apiAvailable: string; realTimeCapability: string }>;
  const search = page.getByRole('searchbox', { name: 'Search tools' });
  const category = page.getByRole('combobox', { name: 'Category' });
  const free = page.getByRole('checkbox', { name: 'Free or trial access' });
  const api = page.getByRole('checkbox', { name: 'API available' });
  const realTime = page.getByRole('checkbox', { name: 'Real-time capable' });
  const expectCount = async (predicate: (tool: typeof tools[number]) => boolean) => {
    await expect(page.locator('[data-result-count]')).toHaveText(String(tools.filter(predicate).length));
    await expect(visibleCards(page)).toHaveCount(tools.filter(predicate).length);
  };

  await category.selectOption('ai-avatars');
  await expectCount((tool) => tool.categorySlugs.includes('ai-avatars'));
  await category.selectOption('all');

  await free.check();
  await expectCount((tool) => tool.freeAccessStatus === 'free' || tool.freeAccessStatus === 'trial');
  await free.uncheck();

  await api.check();
  await expectCount((tool) => tool.apiAvailable === 'yes');
  await api.uncheck();

  await realTime.check();
  await expectCount((tool) => tool.realTimeCapability === 'native' || tool.realTimeCapability === 'near-real-time');
  await realTime.uncheck();

  await category.selectOption('ai-avatars');
  await free.check();
  await api.check();
  await realTime.check();
  const combined = (tool: typeof tools[number]) => tool.categorySlugs.includes('ai-avatars') && (tool.freeAccessStatus === 'free' || tool.freeAccessStatus === 'trial') && tool.apiAvailable === 'yes' && (tool.realTimeCapability === 'native' || tool.realTimeCapability === 'near-real-time');
  expect(tools.filter(combined)).not.toHaveLength(0);
  await expectCount(combined);

  await search.fill('zzzz-not-a-tool');
  await expect(page.getByRole('heading', { name: 'No tools match these filters yet' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('[data-result-count]')).toHaveText('30');
  await expect(category).toHaveValue('all');
  await expect(free).not.toBeChecked();
  await expect(api).not.toBeChecked();
  await expect(realTime).not.toBeChecked();
  await expect(search).toHaveValue('');
});

test('directory presents the no-results state separately', async ({ page }) => {
  await page.goto('/tools/');
  await page.getByRole('searchbox', { name: 'Search tools' }).fill('zzzz-not-a-tool');
  await expect(page.getByRole('heading', { name: 'No tools match these filters yet' })).toBeVisible();
  await expect(visibleCards(page)).toHaveCount(0);
});

test('tool cards render the text-mark fallback when no logo asset is supplied', async ({ page }) => {
  await page.goto('/tools/');
  const heygen = page.locator('[data-tool-slug="heygen"]');
  await expect(heygen.locator('.tool-card__mark')).toHaveText('H');
  await expect(heygen.locator('img')).toHaveCount(0);
});