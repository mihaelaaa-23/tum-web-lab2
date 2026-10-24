import { test, expect } from '@playwright/test';

test('logos: no "Client N" alt text, names where known', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('img[alt^="Client "]')).toHaveCount(0);
  await expect(page.locator('ul[aria-label="Clienți"] img[alt="BiDent"]').first()).toBeAttached();
});

test('heading and hidden duplicate list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 2, name: 'Au avut încredere' })).toBeVisible();
  const dup = page.locator('[data-marquee-track] ul[aria-hidden="true"]');
  await expect(dup).toHaveCount(1);
  await expect(dup.locator('img')).not.toHaveCount(0);
  // duplicate is not announced: accessible tree exposes only one list
  await expect(page.getByRole('list', { name: 'Clienți' })).toHaveCount(1);
});

test('marquee runs at 40s linear and pauses on hover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const track = page.locator('[data-marquee-track]');
  const s = await track.evaluate(e => { const c = getComputedStyle(e); return [c.animationName, c.animationDuration, c.animationTimingFunction]; });
  expect(s[0]).not.toBe('none');
  expect(s[1]).toBe('40s');
  expect(s[2]).toBe('linear');
  const wrap = page.locator('.clients-marquee');
  await wrap.scrollIntoViewIfNeeded();
  await wrap.hover();
  expect(await track.evaluate(e => getComputedStyle(e).animationPlayState)).toBe('paused');
});

test('marquee pauses on keyboard focus and via the toggle button', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const track = page.locator('[data-marquee-track]');
  const state = () => track.evaluate(e => getComputedStyle(e).animationPlayState);
  expect(await state()).toBe('running');
  await page.locator('.clients-marquee').focus();
  expect(await state()).toBe('paused');
  await page.locator('h1').focus().catch(() => {});
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  expect(await state()).toBe('running');
  const btn = page.locator('[data-marquee-toggle]');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await page.mouse.move(0, 0);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  expect(await state()).toBe('paused');
  await btn.click();
  await page.mouse.move(0, 0);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  expect(await state()).toBe('running');
});

test('marquee toggle is hidden under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-marquee-toggle]')).toBeHidden();
});

test('marquee stops under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const anim = await page.locator('[data-marquee-track]').evaluate(e => getComputedStyle(e).animationName);
  expect(anim).toBe('none');
  // static grid: all visible logos stay inside the viewport and wrap onto several rows
  const list = page.locator('ul[aria-label="Clienți"]');
  const dims = await list.evaluate(e => ({ sw: e.scrollWidth, cw: e.clientWidth }));
  expect(dims.sw).toBeLessThanOrEqual(dims.cw);
  const vw = page.viewportSize()!.width;
  const boxes = await list.locator('img').evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: Math.round(r.top) }; }));
  for (const b of boxes) { expect(b.l).toBeGreaterThanOrEqual(0); expect(b.r).toBeLessThanOrEqual(vw); }
  if (vw <= 400) expect(new Set(boxes.map(b => b.t)).size).toBeGreaterThan(1);
});

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`logos are sized (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    const sizes = await page.$$eval('ul[aria-label="Clienți"] img', (els) =>
      els.map((e) => { const r = e.getBoundingClientRect(); return { w: r.width, h: r.height }; }));
    expect(sizes.length).toBeGreaterThan(0);
    for (const s of sizes) {
      expect(s.h).toBeLessThanOrEqual(56);
      expect(s.w).toBeLessThanOrEqual(160);
    }
  });
}
