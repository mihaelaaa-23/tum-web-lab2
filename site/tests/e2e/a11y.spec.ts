import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('axe: no violations', async ({ page }) => {
  await page.goto('/');
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(r.violations).toEqual([]);
});

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('no gold left', async ({ page }) => {
  await page.goto('/');
  expect(await page.content()).not.toMatch(/cdb181/i);
});

test('section order', async ({ page }) => {
  await page.goto('/');
  const ids = await page.$$eval('main > section[id]', (els) => els.map((e) => e.id));
  const order = ['hero', 'trusted-clients', 'servicii', 'rezultate', 'proces', 'jurnal', 'recenzii', 'contact'];
  const present = ids.filter((i) => order.includes(i));
  expect(present).toEqual(order.filter((i) => present.includes(i)));
});

test('case images and review avatars actually load', async ({ page }) => {
  await page.goto('/');
  const imgs = page.locator('#rezultate img, #recenzii img');
  const n = await imgs.count();
  expect(n).toBeGreaterThan(3);
  for (let i = 0; i < n; i++) {
    const img = imgs.nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0), { timeout: 5000 }).toBe(true);
  }
});
