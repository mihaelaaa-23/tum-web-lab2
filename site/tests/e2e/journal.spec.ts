import { expect, test } from '@playwright/test';

test('no Jurnal section or nav link yet', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#jurnal')).toHaveCount(0);
  await expect(page.locator('header a[href="#jurnal"]')).toHaveCount(0);
  await expect(page.locator('#mobile-nav a[href="#jurnal"]')).toHaveCount(0);
});
