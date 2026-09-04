import { expect, test } from '@playwright/test';

const trustPages = [
  { path: '/about/', finalHeading: 'How to read the site', finalText: 'Read our editorial policy' },
  { path: '/editorial-policy/', finalHeading: 'Corrections', finalText: 'We correct material factual errors' },
  { path: '/affiliate-disclosure/', finalHeading: 'Reader choice', finalText: 'External links are provided for convenience' },
  { path: '/privacy/', finalHeading: 'External sites', finalText: 'Links to other sites are governed' },
  { path: '/terms/', finalHeading: 'Changes', finalText: 'We may revise these terms' },
];

test('trust pages include complete final content and one BreadcrumbList', async ({ page }) => {
  for (const trustPage of trustPages) {
    expect((await page.goto(trustPage.path))?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 2 }).last()).toHaveText(trustPage.finalHeading);
    await expect(page.getByRole('main')).toContainText(trustPage.finalText);

    const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
    const breadcrumbLists = structuredData.map((value) => JSON.parse(value)).filter((value) => value['@type'] === 'BreadcrumbList');
    expect(breadcrumbLists).toHaveLength(1);
  }
});
