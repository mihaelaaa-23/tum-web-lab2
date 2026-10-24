import { expect, test } from '@playwright/test';

test('production build is indexable and has analytics', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await expect(page.locator('script[src*="cloud.umami.is"]')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
});
