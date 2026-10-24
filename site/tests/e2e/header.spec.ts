import { expect, test } from '@playwright/test';

test('menu opens, closes on Escape, restores focus', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'mobile-only');
  await page.goto('/');
  const t = page.locator('#menu-toggle');
  await t.click();
  await expect(t).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(t).toHaveAttribute('aria-expanded', 'false');
  await expect(t).toBeFocused();
  await expect(page.locator('#mobile-nav')).toBeHidden();
});

test('menu link click closes the menu and restores focus', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'mobile-only');
  await page.goto('/');
  const t = page.locator('#menu-toggle');
  await t.click();
  await page.locator('#mobile-nav li:nth-child(4) a').click();
  await expect(t).toHaveAttribute('aria-expanded', 'false');
  await expect(t).toBeFocused();
});

test('sticky CTA appears after hero', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'mobile-only');
  await page.goto('/');
  const s = page.locator('[data-sticky-cta]');
  await expect(s).not.toHaveAttribute('data-visible', 'true');
  await page.evaluate(() => {
    const r = document.getElementById('hero')!.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + r.bottom + 1);
  });
  await expect(s).toHaveAttribute('data-visible', 'true');
});

test('no role=menu anywhere', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
});

test('desktop shows inline nav and footer content', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 768, 'desktop-only');
  await page.goto('/');
  await expect(page.locator('header a[href="#servicii"]').first()).toBeVisible();
  await expect(page.locator('#menu-toggle')).toBeHidden();
  await expect(page.locator('footer')).toContainText(String(new Date().getFullYear()));
});
