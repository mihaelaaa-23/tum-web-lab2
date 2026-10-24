import { expect, test } from '@playwright/test';

test('hero has the approved H1 with highlight', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Fac brandul tău să fie văzut. Și cumpărat.');
  await expect(page.locator('h1 mark')).toHaveText('să fie văzut.');
});

test('doors link to the service tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Am o afacere locală/ })).toHaveAttribute('href', '#servicii-local');
  await expect(page.getByRole('link', { name: /Sunt un brand în creștere/ })).toHaveAttribute('href', '#servicii-brand');
});

test('portrait is eager + high priority', async ({ page }) => {
  await page.goto('/');
  const img = page.locator('#hero img[src*="irina-portrait"]').first();
  await expect(img).toHaveAttribute('fetchpriority', 'high');
  await expect(img).toHaveAttribute('loading', 'eager');
});

test('mobile shows one polaroid and three stats in one row', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'mobile-only');
  await page.goto('/');
  await expect(page.locator('#hero figure:visible')).toHaveCount(1);
  const tops = await page.locator('#hero [data-stat]').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  expect(tops).toHaveLength(3);
  expect(new Set(tops).size).toBe(1);
});

test('desktop shows both polaroids', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 768, 'desktop-only');
  await page.goto('/');
  await expect(page.locator('#hero figure:visible')).toHaveCount(2);
});
