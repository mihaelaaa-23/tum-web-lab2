import { expect, test } from '@playwright/test';

test('reviews scroll with buttons', async ({ page }) => {
  await page.goto('/');
  const t = page.locator('[data-reviews-track]');
  await expect(page.locator('#recenzii h2')).toHaveText('Ce spun clienții');
  const before = await t.evaluate((e) => e.scrollLeft);
  await page.getByRole('button', { name: 'Recenzia următoare' }).click();
  await expect.poll(() => t.evaluate((e) => e.scrollLeft)).toBeGreaterThan(before);
  await page.getByRole('button', { name: 'Recenzia anterioară' }).click();
  await expect.poll(() => t.evaluate((e) => e.scrollLeft)).toBeLessThanOrEqual(before + 1);
});

test('contact: three channels, no phone, no mascot', async ({ page }) => {
  await page.goto('/');
  const c = page.locator('#contact');
  await expect(c.locator('h2')).toHaveText('Hai să vorbim despre brandul tău');
  await expect(c.locator('a[href^="https://t.me/"]')).toHaveCount(1);
  await expect(c.locator('a[href*="instagram.com/irinuc.c"]')).toHaveCount(1);
  await expect(c.locator('a[href^="mailto:"]')).toHaveCount(1);
  await expect(c.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.getByText('Telefon')).toHaveCount(0);
  await expect(page.locator('img[src*="mascot"]')).toHaveCount(0);
});

test('review frames are rotated but text is not', async ({ page }) => {
  await page.goto('/');
  const frame = page.locator('[data-review-frame]').first();
  const quote = page.locator('[data-reviews-track] blockquote').first();
  expect(await frame.evaluate((e) => { const c = getComputedStyle(e); return c.rotate !== 'none' || c.transform !== 'none'; })).toBe(true);
  expect(await quote.evaluate((e) => getComputedStyle(e).transform)).toBe('none');
  expect(await quote.evaluate((e) => getComputedStyle(e.closest('figure')!).transform)).toBe('none');
});
