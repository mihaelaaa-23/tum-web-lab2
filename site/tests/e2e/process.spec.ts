import { test, expect } from '@playwright/test';

test('process timeline has four steps', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('#proces ol > li');
  await expect(items).toHaveCount(4);
  await expect(items.first()).toContainText('Discuție');
});

test('no horizontal page scroll', async ({ page }) => {
  await page.goto('/');
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over).toBeLessThanOrEqual(0);
});
