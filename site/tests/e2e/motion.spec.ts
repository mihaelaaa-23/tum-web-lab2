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

test('forced IO fallback: reveal hidden until scrolled to, then visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const orig = CSS.supports.bind(CSS);
    CSS.supports = ((...a: any[]) => (String(a[0]).includes('animation-timeline') ? false : (orig as any)(...a))) as any;
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/reveal-io/);
  const last = page.locator('.reveal').last();
  await expect(last).toHaveCSS('opacity', '0');
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveCSS('opacity', '1');
  const total = await page.locator('.reveal').count();
  for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(30);
  }
  await expect.poll(() => page.$$eval('.reveal', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length)).toBe(0);
  expect(total).toBeGreaterThan(3);
});

test('JS disabled: reveal content is visible', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/');
  await expect(page.locator('html')).not.toHaveClass(/reveal-io/);
  const reveals = page.locator('.reveal');
  const n = await reveals.count();
  expect(n).toBeGreaterThan(3);
  // Scroll-driven reveal needs no JS: each heading is fully visible once scrolled to.
  for (let i = 0; i < n; i++) {
    await reveals.nth(i).scrollIntoViewIfNeeded();
    await expect(reveals.nth(i)).toHaveCSS('opacity', '1');
  }
  await ctx.close();
});
