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
