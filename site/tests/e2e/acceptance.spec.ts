import { test, expect } from '@playwright/test';
for (const route of ['/compare/restream-vs-streamyard/', '/compare/tavus-vs-d-id/']) {
  test(`comparison stays within 360px and tables support keyboard scrolling: ${route}`, async ({page}) => {
    await page.setViewportSize({width:360,height:800}); await page.goto(route);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    const region=page.getByRole('region',{name:'Scrollable comparison table'}); await expect(region).toBeVisible();
    await region.focus(); await expect(region).toBeFocused();
    await page.keyboard.press('ArrowRight'); await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  });
}
test('tool detail accessible names include their visible text',async({page})=>{
 await page.goto('/tools/');
 const links=page.locator('[data-tool-card] a[aria-label]');
 for(const link of await links.all()) expect(await link.getAttribute('aria-label')).toContain(await link.innerText());
});
test('unknown routes have a branded recovery page with real 404 status',async({page})=>{
 const response=await page.goto('/__missing_audit_page__/');expect(response?.status()).toBe(404);
 await expect(page.getByRole('heading',{level:1,name:'Page not found'})).toBeVisible();
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,follow');
 await page.getByRole('link',{name:'Browse tools',exact:true}).click();await expect(page).toHaveURL(/\/tools\/$/);
});

test('clearing a search invalidates delayed results', async ({ page }) => {
  let release!: () => void;
  let started!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const requested = new Promise<void>(resolve => { started = resolve; });
  await page.route('**/pagefind/fragment/**', async route => { started(); await gate; await route.continue(); });
  await page.goto('/');
  const input = page.getByRole('searchbox');
  await input.fill('HeyGen');
  await requested;
  await input.fill('');
  // Let the 150ms empty-query debounce run while the response remains blocked.
  await page.waitForTimeout(250);
  const returned = page.waitForResponse(response => response.url().includes('/pagefind/fragment/'));
  release();
  await returned;
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-search-results]')).toBeEmpty();
});

