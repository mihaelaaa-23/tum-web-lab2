import { test, expect } from '@playwright/test';

test('reduced motion: nothing animates', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const names = await page.$$eval('.reveal, .settle, mark.hl', (els) => els.map((e) => getComputedStyle(e).animationName));
  expect(names.length).toBeGreaterThan(0);
  expect(names.every((n) => n === 'none')).toBe(true);
});

test('motion allowed: reveal content is never left invisible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  const hidden = await page.$$eval('.reveal', (els) => els.filter((e) => getComputedStyle(e).opacity === '0' && e.getBoundingClientRect().top < innerHeight).length);
  expect(hidden).toBe(0);
});

test('hero polaroids settle and highlight draws when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const hl = await page.$eval('mark.hl', (e) => getComputedStyle(e).animationName);
  expect(hl).not.toBe('none');
  const settle = await page.$$eval('.settle', (els) => els.length);
  expect(settle).toBeGreaterThan(0);
});
