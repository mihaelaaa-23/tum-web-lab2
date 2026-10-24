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

test('no horizontal overflow in services', async ({ page }) => {
  await page.goto('/#servicii-local');
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over).toBe(false);
});
