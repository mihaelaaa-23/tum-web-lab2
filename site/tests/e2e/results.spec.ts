import { test, expect } from '@playwright/test';

test('featured case and three cases', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#rezultate')).toContainText('€20k+ vânzări lunare din TikTok');
  await expect(page.locator('#rezultate a[target="_blank"]')).toHaveCount(3);
  await expect(page.locator('#rezultate a[target="_blank"]').first()).toHaveAttribute('rel', /noopener/);
});

test('case links have accessible names', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Garduri.md: +60 comenzi, deschide pe TikTok (filă nouă)' })).toBeVisible();
});

test('case link names keep the note and category/active text is still in the card', async ({ page }) => {
  await page.goto('/');
  const l = page.locator('#rezultate a[target="_blank"]').nth(1);
  await expect(l).toContainText('Construcții');
  await expect(l).toContainText('activ');
});

test('active state has text, not just color', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#rezultate').getByText('activ').first()).toBeVisible();
});

test('no horizontal page scroll', async ({ page }) => {
  await page.goto('/');
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over).toBeLessThanOrEqual(0);
});
