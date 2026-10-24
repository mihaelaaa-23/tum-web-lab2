import { test, expect } from '@playwright/test';

test('brand door selects brand tab', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Sunt un brand în creștere/ }).click();
  await expect(page.locator('#tab-brand')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-brand')).toContainText('TikTok Boost');
  await expect(page.locator('#panel-brand')).toBeVisible();
  await expect(page.locator('#panel-local')).toBeHidden();
});

test('local door selects local tab after brand', async ({ page }) => {
  await page.goto('/#servicii-brand');
  await page.evaluate(() => { location.hash = '#servicii-local'; });
  await expect(page.locator('#tab-local')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-local')).toContainText('SMM Pro');
});

test('deep link and unknown hash', async ({ page }) => {
  await page.goto('/#servicii-brand');
  await expect(page.locator('#tab-brand')).toHaveAttribute('aria-selected', 'true');
  // leave the document first: a same-document hash change would (rightly) keep the current tab
  await page.goto('about:blank');
  await page.goto('/#ceva');
  await expect(page.locator('#tab-local')).toHaveAttribute('aria-selected', 'true');
});

test('keyboard arrows switch tabs', async ({ page }) => {
  await page.goto('/');
  await page.locator('#tab-local').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-brand')).toBeFocused();
  await expect(page.locator('#tab-brand')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tab-local')).toHaveAttribute('tabindex', '-1');
  await page.keyboard.press('Home');
  await expect(page.locator('#tab-local')).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.locator('#tab-brand')).toBeFocused();
});

test('hidden package not rendered; featuresText fallback; popular sticker', async ({ page }) => {
  await page.goto('/#servicii-brand');
  await expect(page.getByText('UGC & campanii')).toHaveCount(0);
  await expect(page.locator('#panel-brand')).toContainText('Strategie unică');
  await expect(page.locator('#panel-local')).toContainText('cel mai ales');
});

test('re-clicking the same door after switching tabs reselects and scrolls', async ({ page }) => {
  await page.goto('/');
  const brandDoor = page.getByRole('link', { name: /Sunt un brand în creștere/ });
  await brandDoor.click();
  await expect(page.locator('#tab-brand')).toHaveAttribute('aria-selected', 'true');
  await page.locator('#tab-local').click();
  await expect(page.locator('#tab-local')).toHaveAttribute('aria-selected', 'true');
  // let the smooth scroll from the first door click settle before jumping back up
  let prev = -1;
  await expect.poll(async () => { const y = await page.evaluate(() => window.scrollY); const done = y === prev; prev = y; return done; }).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await brandDoor.click();
  await expect(page.locator('#tab-brand')).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('no horizontal overflow at 320px on either tab', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  for (const id of ['local', 'brand']) {
    await page.locator(`#tab-${id}`).click();
    await expect(page.locator(`#panel-${id}`)).toBeVisible();
    const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(over, `overflow on ${id} tab`).toBe(false);
  }
});
