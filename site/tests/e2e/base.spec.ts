import { expect, test } from '@playwright/test';

test('no Google Fonts requests', async ({ page }) => {
  const hits: string[] = [];
  page.on('request', (r) => /fonts\.(googleapis|gstatic)\.com/.test(r.url()) && hits.push(r.url()));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(hits).toEqual([]);
});

test('skip link is first focusable and targets main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '#main');
});

test('body uses cream background and Hanken Grotesk', async ({ page }) => {
  await page.goto('/');
  const s = await page.evaluate(() => {
    const c = getComputedStyle(document.body);
    return [c.backgroundColor, c.fontFamily];
  });
  expect(s[0]).toBe('rgb(251, 247, 241)');
  expect(s[1]).toContain('Hanken Grotesk');
});
