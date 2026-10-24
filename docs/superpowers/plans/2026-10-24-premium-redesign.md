# Premium Redesign (GRWM Diary) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the ciobanu-irina.online landing page in the approved "GRWM Diary" look, with teal accents on cream. The page serves two audiences: local businesses and growing brands. Every section stays editable in TinaCMS, and the result ships through a Netlify preview before going live.

**Architecture:** Astro 5 static page. Each section is one Astro component that reads its own JSON in `site/content/`. A handful of shared scrapbook primitives (`Polaroid`, `Tape`, `Highlight`, `HandNote`, `Sticker`, `Leopard`, `TornPaper`, `OptimizedImg`) build the look. Design tokens live in one Tailwind 4 `@theme` file. A prebuild script turns `public/img/**` into AVIF/WebP variants plus a manifest that `OptimizedImg` reads. The few interactive behaviors (menu, tabs, sticky CTA, reviews scroller) are small vanilla scripts inside their components.

**Tech Stack:** Astro 5, Tailwind 4 (`@tailwindcss/vite`), TinaCMS 2, `sharp`, `@fontsource/gloock`, `@fontsource-variable/hanken-grotesk`, `@fontsource/caveat`, Vitest (with the Astro Container API), Playwright, and `@axe-core/playwright`.

**Spec:** `docs/superpowers/specs/2026-10-24-premium-redesign-design.md` (the mockup is in `docs/superpowers/specs/assets/grwm-teal.html`; the first hero, "Level 1", is the approved one).

## Global Constraints

- All work happens on branch `redesign`, cut from `main` in a local clone of `mihaelaaa-23/tum-web-lab2`. Nothing is pushed to `main` before Task 14.
- All paths below are relative to `site/` unless they start with `/` or `.github`/`netlify.toml`.
- Colors (exact): teal `#026E82`, teal-deep `#014E5C`, teal-mist `#E4F0EF`, cream `#FBF7F1`, paper-dot `#E9DFD3`, ink `#1E1715`, ink-muted `#5D514B`, blush `#F2C9CF`, leopard-tan `#C9935C`, leopard-spot `#3B2418`, white `#FFFFFF`. Gold `#CDB181` must not appear anywhere.
- Fonts: Gloock 400 (display), Hanken Grotesk variable 400–800 (body/UI), Caveat 500/700 (asides of 2–5 words only). Fonts are self-hosted. No request to `fonts.googleapis.com` or `fonts.gstatic.com`.
- Type scale: H1 `clamp(2.5rem, 6vw, 4rem)`, H2 `clamp(2rem, 4.5vw, 3rem)`, body `1rem/1.6`, small `0.75rem`, heading letter-spacing `-0.02em`.
- Radius: 4px for highlights and chips, 10px for buttons and cards, 999px for pills and stickers, 0 for polaroids. One shadow token, `--shadow-polaroid: 0 10px 30px rgb(30 23 21 / .18)`, and nothing else casts a shadow.
- Section padding: 96px desktop and 64px mobile. Spacing stays on Tailwind's 4px scale.
- Scrapbook limits per screen: at most 2 polaroids, 1 hand note and 1 leopard. Rotations are between −6° and +6°, applied only to decorative frames.
- No flip cards, glassmorphism, glow, decorative gradients, blobs, the mascot, emoji used as UI icons, or the old `MobileCTA` section.
- Romanian only, `lang="ro"`. Diacritics ă â î ș ț must render in every font.
- Static only: no forms, no backend, no third-party embeds on load. Umami stays in production.
- Accessibility: WCAG 2.1 AA, one H1, a skip link, visible 2px teal focus ring with offset, targets of at least 44px, and state never shown by color alone.
- Performance: Lighthouse mobile ≥ 95 for Performance, Accessibility and Best Practices; LCP < 2.0s; CLS < 0.05.

## Review Focus

1. **Production must never ship `noindex`.** A preview flag that leaks into the GitHub Pages build would delist her site. Expected: `noindex` and no Umami only when `PUBLIC_PREVIEW=true`. → tests in Task 1.
2. **320px screens with long Romanian strings from the CMS** ("Sunt un brand în creștere", long package features). Expected: no horizontal page scroll, and text wraps. → test in Task 13.
3. **Deep links and unknown hashes.** A visitor opens `/#servicii-brand` from a bio link, or `/#ceva`. Expected: the brand tab is selected on load, and an unknown hash leaves the default `local` tab with no error. → tests in Tasks 3 and 8.
4. **CMS uploads the pipeline didn't expect:** `.PNG`/`.jpeg` extensions, SVG, spaces in file names, or an image missing from the manifest. Expected: the variants are generated or the original is served, and the build never fails. → tests in Task 3.
5. **Hidden or empty content:** a package or case with `hidden: true`, a package with no `features` (uses `featuresText`), or an empty journal handle. Expected: hidden items don't render, `featuresText` shows instead, and Jurnal plus its nav link disappear. → tests in Tasks 8, 9 and 11.

---

### Task 1: Branch, test harness, and preview flag

**Files:**
- Modify: `package.json` (scripts, devDeps), `src/layouts/BaseLayout.astro`
- Create: `vitest.config.ts`, `playwright.config.ts`, `src/lib/env.ts`, `tests/unit/env.test.ts`, `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Produces: `isPreview(env: Record<string, string | boolean | undefined>): boolean` in `src/lib/env.ts`. Scripts `test:unit` (`vitest run`), `test:e2e` (`playwright test`), and `test` (both).
- Playwright `webServer`: `npm run build && npm run preview -- --port 4321`, with `baseURL` `http://localhost:4321`. Projects run at viewports 320×740, 768×1024, 1024×768 and 1440×900.
- Vitest uses `getViteConfig()` from `astro/config` so the Astro Container API works.

- [ ] **Step 1:** In the clone, run `git switch -c redesign`. Install the dev deps: `vitest @playwright/test @axe-core/playwright`. Run `npx playwright install chromium`.
- [ ] **Step 2: Write the failing tests**

```ts
// tests/unit/env.test.ts
import { isPreview } from '../../src/lib/env';
test('preview only when PUBLIC_PREVIEW is "true"', () => {
  expect(isPreview({ PUBLIC_PREVIEW: 'true' })).toBe(true);
  expect(isPreview({ PUBLIC_PREVIEW: 'false' })).toBe(false);
  expect(isPreview({})).toBe(false);
});
// tests/e2e/smoke.spec.ts  (production build, no PUBLIC_PREVIEW)
test('production build is indexable and has analytics', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await expect(page.locator('script[src*="cloud.umami.is"]')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
});
```

- [ ] **Step 3:** Run `npm run test:unit`. Expected: FAIL, because `isPreview` is not defined.
- [ ] **Step 4:** Implement `isPreview` (true only when the value is exactly the string `"true"` or boolean `true`). In `BaseLayout.astro`, when `isPreview(import.meta.env)` is true, emit `<meta name="robots" content="noindex, nofollow">` and skip the Umami script.
- [ ] **Step 5:** Run `npm test`. Expected: all tests PASS (the e2e smoke test runs against the current, old page).
- [ ] **Step 6:** Commit: `chore: add vitest/playwright harness and preview flag`.

### Task 2: Design tokens, fonts, base layout

**Files:**
- Create: `src/styles/tokens.css` (the `@theme` block plus base styles), `tests/e2e/base.spec.ts`
- Modify: `src/layouts/BaseLayout.astro`, `src/styles/global.css` (reduce it to `@import "tailwindcss"; @import "./tokens.css";`, and move nothing else over)

**Interfaces:**
- Produces Tailwind theme names that every later task uses: `bg-cream`, `bg-teal`, `bg-teal-deep`, `bg-teal-mist`, `bg-blush`, `text-ink`, `text-ink-muted`, `text-teal`, `font-display` (Gloock), `font-sans` (Hanken Grotesk), `font-hand` (Caveat), `shadow-polaroid`, plus utilities `.paper-dots` (the cream dot grid, 18px) and `.section` (96px/64px vertical padding).
- `BaseLayout` props: `{ title?: string; description?: string }`. It renders a skip link `<a href="#main" class="skip-link">Sari la conținut</a>`, `<main id="main">` wrapping the slot, and named slots `header`, `footer` and `after` (for the sticky CTA).

- [ ] **Step 1: Write the failing test**

```ts
// tests/e2e/base.spec.ts
test('no Google Fonts requests', async ({ page }) => {
  const hits: string[] = [];
  page.on('request', r => /fonts\.(googleapis|gstatic)\.com/.test(r.url()) && hits.push(r.url()));
  await page.goto('/'); await page.waitForLoadState('networkidle');
  expect(hits).toEqual([]);
});
test('skip link is first focusable and targets main', async ({ page }) => {
  await page.goto('/'); await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '#main');
});
test('body uses cream background and Hanken Grotesk', async ({ page }) => {
  await page.goto('/');
  const s = await page.evaluate(() => { const c = getComputedStyle(document.body); return [c.backgroundColor, c.fontFamily]; });
  expect(s[0]).toBe('rgb(251, 247, 241)'); expect(s[1]).toContain('Hanken Grotesk');
});
```

- [ ] **Step 2:** Run `npm run test:e2e -- base`. Expected: FAIL.
- [ ] **Step 3:** Install the `@fontsource` packages and import them in `BaseLayout` (`latin` and `latin-ext` subsets, so ș/ț render). Remove the Google Fonts `<link>` tags. Write `tokens.css` with the Global Constraints values. The focus style is `:focus-visible { outline: 2px solid var(--color-teal); outline-offset: 3px }`, and `html { scroll-behavior: smooth }` applies only inside `@media (prefers-reduced-motion: no-preference)`. Delete the smooth-scroll and `setTimeout` stagger scripts from `BaseLayout`.
- [ ] **Step 4:** Run `npm run test:e2e -- base`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: design tokens, self-hosted fonts, base layout`.

### Task 3: Image pipeline and `OptimizedImg`

**Files:**
- Create: `scripts/optimize-images.mjs`, `src/lib/images.ts`, `src/components/primitives/OptimizedImg.astro`, `tests/unit/images.test.ts`, `tests/unit/optimize-images.test.ts`, `tests/fixtures/img/` (a 600×400 `wide.PNG`, a 300×300 `small.jpeg`, `logo.svg`, a 200×200 `with space.png`)
- Modify: `package.json` (`"prebuild": "node scripts/optimize-images.mjs"`, `"pretest": "node scripts/optimize-images.mjs"`), `.gitignore` (add `public/img/_opt/` and `src/generated/`)

**Interfaces:**
- `optimizeImages(srcDir: string, outDir: string, widths: number[] = [480, 960, 1440]): Promise<Manifest>` is exported from the script. The CLI defaults are `public/img` → `public/img/_opt`, and it writes `src/generated/image-manifest.json`.
- `type Manifest = Record<string, { width: number; height: number; variants: number[] }>`. Keys are public paths like `/img/irina-portrait.png`.
- Variant rule: `variants = widths.filter(w => w < original).concat(original)`. Files are named `<slug>-<w>.avif|webp`, where slug is the base name lowercased with spaces replaced by `-`. SVG and other formats are skipped (not in the manifest). Files under `_opt/` are ignored.
- `srcsetFor(src: string, format: 'avif' | 'webp', manifest: Manifest): string | null` in `src/lib/images.ts`.
- `<OptimizedImg src alt sizes? loading? fetchpriority? class? />` renders `<picture>` with avif and webp `<source>`s, plus an `<img>` with `width`/`height` from the manifest. When `src` isn't in the manifest, it renders a plain `<img src={src}>`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/unit/images.test.ts
const m = { '/img/a.png': { width: 1114, height: 1140, variants: [480, 960, 1114] } };
test('srcset lists every variant', () => {
  expect(srcsetFor('/img/a.png', 'webp', m)).toBe('/img/_opt/a-480.webp 480w, /img/_opt/a-960.webp 960w, /img/_opt/a-1114.webp 1114w');
});
test('unknown image returns null', () => expect(srcsetFor('/img/x.svg', 'avif', m)).toBeNull());
// tests/unit/optimize-images.test.ts  (runs against tests/fixtures/img into a temp dir)
test('handles case, spaces and svg', async () => {
  const man = await optimizeImages(fixtures, tmp);
  expect(man['/img/wide.PNG'].variants).toEqual([480, 600]);
  expect(man['/img/small.jpeg'].variants).toEqual([300]);
  expect(man['/img/with space.png'].variants).toEqual([200]);
  expect(existsSync(join(tmp, 'with-space-200.webp'))).toBe(true);
  expect(man['/img/logo.svg']).toBeUndefined();
});
```

Add a container test: rendering `OptimizedImg` with `src="/img/logo.svg"` outputs `<img` with `src="/img/logo.svg"` and no `<source`.

- [ ] **Step 2:** Run `npm run test:unit`. Expected: FAIL.
- [ ] **Step 3:** Implement the script with `sharp` (AVIF quality 55, WebP quality 75, resizing by width) and the helper and component as specified. The script is idempotent: it skips outputs newer than their source.
- [ ] **Step 4:** Run `npm run test:unit`, then `npm run build`. Expected: PASS, and `public/img/_opt/irina-portrait-480.avif` exists.
- [ ] **Step 5:** Commit: `feat: build-time image variants and OptimizedImg`.

### Task 4: Scrapbook primitives

**Files:**
- Create: `src/components/primitives/{Polaroid,Tape,Highlight,HandNote,Sticker,Leopard,TornPaper}.astro`, `tests/unit/primitives.test.ts`

**Interfaces (props):**
- `Polaroid { src: string; alt: string; note?: string; rotate?: number /* clamped to [-6,6] */; width: number; height: number; class?: string }`. It uses `OptimizedImg` and renders a white frame with 10px padding, 34px bottom, `shadow-polaroid`, radius 0, and an optional `HandNote` caption.
- `Tape { color?: 'teal' | 'blush'; class?: string }`. Teal tape is `rgb(2 110 130 / .35)`. It is `aria-hidden="true"`.
- `Highlight` is a slot wrapped in `<mark class="hl">` with a blush background, 4px radius and `box-decoration-break: clone`.
- `HandNote { as?: 'span' | 'p'; class?: string }` is Caveat in teal, rotated −3°.
- `Sticker { tone?: 'blush' | 'teal'; rotate?: number }` is a pill.
- `Leopard { size?: number }` is a decorative CSS-pattern circle, `aria-hidden`.
- `TornPaper { class?: string }` is a teal shape using the clip-path polygon from the mockup, `aria-hidden`.

- [ ] **Step 1: Write the failing tests** (Astro Container `renderToString`)

```ts
test('Polaroid clamps rotation', async () => {
  const html = await c.renderToString(Polaroid, { props: { src: '/img/thumb-horay.png', alt: 'Horay', rotate: 12, width: 120, height: 150 } });
  expect(html).toContain('rotate(6deg)');
});
test('decorations are hidden from AT', async () => {
  for (const C of [Tape, Leopard, TornPaper]) expect(await c.renderToString(C)).toContain('aria-hidden="true"');
});
test('Highlight renders mark', async () => {
  expect(await c.renderToString(Highlight, { slots: { default: 'să fie văzut.' } })).toMatch(/<mark[^>]*>să fie văzut\.<\/mark>/);
});
```

- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement the primitives, reproducing the mockup's visuals with token classes.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: scrapbook primitives`.

### Task 5: Header, mobile menu, footer, sticky CTA

**Files:**
- Create: `src/components/sections/{Header,Footer,StickyCta}.astro`, `tests/e2e/header.spec.ts`
- Modify: `src/layouts/BaseLayout.astro` (use the slots), `content/contact/index.json` (add `instagramHref: "https://www.instagram.com/irinuc.c/"`; remove `phone` and `phoneDisplay`)
- Delete: `src/components/MobileCTA.astro`

**Interfaces:**
- `Header { links: { label: string; href: string }[] }`. Default links are Servicii `#servicii`, Rezultate `#rezultate`, Jurnal `#jurnal`, Contact `#contact`. `index.astro` removes the Jurnal link when the journal handle is empty (Task 11). The CTA pill "Scrie-mi" points to `#contact`.
- Mobile menu: `button#menu-toggle[aria-controls="mobile-nav"][aria-expanded]` and `nav#mobile-nav` (no `role="menu"`). Escape and link clicks close it and return focus to the toggle.
- `StickyCta { href: string }` shows "Scrie-mi pe Telegram", only below 768px. It gets `data-visible="true"` once `#hero` leaves the viewport (IntersectionObserver).
- `Footer` shows the name, "SMM ziua, restul timpului creez ✨", Instagram and Telegram links, and the current year.

- [ ] **Step 1: Write the failing tests** (mobile project, 320×740)

```ts
test('menu opens, closes on Escape, restores focus', async ({ page }) => {
  await page.goto('/'); const t = page.locator('#menu-toggle');
  await t.click(); await expect(t).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(t).toHaveAttribute('aria-expanded', 'false'); await expect(t).toBeFocused();
});
test('sticky CTA appears after hero', async ({ page }) => {
  await page.goto('/'); const s = page.locator('[data-sticky-cta]');
  await expect(s).not.toHaveAttribute('data-visible', 'true');
  await page.locator('#servicii').scrollIntoViewIfNeeded();
  await expect(s).toHaveAttribute('data-visible', 'true');
});
test('no role=menu anywhere', async ({ page }) => { await page.goto('/'); await expect(page.locator('[role="menu"]')).toHaveCount(0); });
```

- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement the components. The header is `position: sticky` and gets a hairline `paper-dot` bottom border once `scrollY > 8`.
- [ ] **Step 4:** Run. Expected: PASS (the sticky test needs `#hero`/`#servicii`, so for now add temporary ids to the old sections; Tasks 6 and 8 replace them).
- [ ] **Step 5:** Commit: `feat: header, mobile menu, footer, sticky CTA`.

### Task 6: Hero and two doors

**Files:**
- Create: `src/components/sections/{Hero,Doors}.astro`, `content/doors/index.json`, `tests/e2e/hero.spec.ts`
- Modify: `content/hero/index.json`, `tina/config.ts` (hero collection; add a `doors` collection)
- Delete: `src/components/Hero.astro`

**Interfaces:**
- `content/hero/index.json` has the shape `{ handNote, headlineBefore, headlineHighlight, headlineAfter, subtext, ctaLabel, ctaHref, portrait, stats: {value,label}[], polaroids: {img, note, alt}[] }`, with these exact values:
  - handNote: `"hei, eu sunt Irina ♡"`
  - headline: `"Fac brandul tău "` + `"să fie văzut."` + `" Și cumpărat."`
  - subtext: `"SMM ziua, content creator restul timpului. Știu ce se uită oamenii pe TikTok pentru că îl fac și eu."`
  - ctaLabel: `"Scrie-mi →"`, ctaHref: `"#contact"`, portrait: `"/img/irina-portrait.png"`
  - stats: `€20k+` "vânzări / lună din TikTok", `+3.3k` "urmăritori pentru Horay", `7 zile` "până la prima vânzare"
  - polaroids: `/img/thumb-horay.png` with note "Horay ⚡" and alt "Video TikTok pentru Horay"; `/img/thumb-garduri.png` with note "+60 comenzi!" and alt "Video TikTok pentru Garduri.md"
- `content/doors/index.json` is `{ doors: [{ label: "Am o afacere locală", sub: "Cafenea, salon, magazin: mă ocup eu de tot", tab: "local" }, { label: "Sunt un brand în creștere", sub: "TikTok, UGC și campanii care vând", tab: "brand" }] }`. Each door renders as `<a href="#servicii-{tab}">`. The first door is `bg-teal` with cream text; the second is `bg-blush` with ink text.
- `Hero` is a `section#hero` with an `<h1>` (the only one on the page). The portrait uses `OptimizedImg` with `loading="eager"` and `fetchpriority="high"`, sits on `TornPaper`, with `Leopard` and two `Polaroid`s (−6° and +5°). Desktop is a 1.1fr/0.9fr grid. Below 768px the portrait goes first, with only the first polaroid, and the stats stay in one row of three.

- [ ] **Step 1: Write the failing tests**

```ts
test('hero has the approved H1 with highlight', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Fac brandul tău să fie văzut. Și cumpărat.');
  await expect(page.locator('h1 mark')).toHaveText('să fie văzut.');
});
test('doors link to the service tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Am o afacere locală/ })).toHaveAttribute('href', '#servicii-local');
  await expect(page.getByRole('link', { name: /Sunt un brand în creștere/ })).toHaveAttribute('href', '#servicii-brand');
});
test('portrait is eager + high priority', async ({ page }) => {
  await page.goto('/');
  const img = page.locator('#hero img[src*="irina-portrait"]').first();
  await expect(img).toHaveAttribute('fetchpriority', 'high');
});
```

- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Update the Tina `hero` collection fields to match the JSON shape (the `portrait` and polaroid `img` fields are `type: "image"`), and add the `doors` collection with create/delete disabled.
- [ ] **Step 4:** Run the tests, then `npx tinacms build --local --skip-cloud-checks`. Expected: PASS, and Tina exits 0.
- [ ] **Step 5:** Commit: `feat: GRWM hero and audience doors`.

### Task 7: Client logos marquee

**Files:**
- Modify: `src/components/Clients.astro` → move it to `src/components/sections/Clients.astro`, `content/clients/index.json`
- Create: `tests/e2e/clients.spec.ts`

**Interfaces:**
- The heading is H2 "Au avut încredere". The layout is a `<ul aria-label="Clienți">` with the list duplicated for the loop. The duplicate copy is `aria-hidden="true"`.
- Prefill `alt` with the real names known from the reviews: client-11 "BiDent", client-6 "GarduriMD", client-5 "Moldpack", client-7 "Proimobil", client-8 "russrent", client-2 "XTD.md". Every other logo gets `alt: ""` (spec §9b).
- The marquee runs at 40s linear, pauses on `:hover` and `:focus-within`, and has `animation: none` plus a wrapping static grid under reduced motion.

- [ ] **Step 1: Write the failing tests**

```ts
test('logos: no "Client N" alt text, names where known', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('img[alt^="Client "]')).toHaveCount(0);
  await expect(page.locator('ul[aria-label="Clienți"] img[alt="BiDent"]').first()).toBeAttached();
});
test('marquee stops under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  const anim = await page.locator('[data-marquee-track]').evaluate(e => getComputedStyle(e).animationName);
  expect(anim).toBe('none');
});
```

- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement. **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: client logos marquee with real names`.

### Task 8: Services with audience tabs

**Files:**
- Create: `src/lib/tabs.ts`, `tests/unit/tabs.test.ts`, `tests/e2e/services.spec.ts`
- Modify: `src/components/Services.astro` → move it to `src/components/sections/Services.astro`, `content/services/index.json`, `tina/config.ts` (services collection)

**Interfaces:**
- `type Audience = 'local' | 'brand'`. `audienceFromHash(hash: string): Audience | null` maps `#servicii-local` → `local` and `#servicii-brand` → `brand`; anything else returns `null`.
- The package shape is `{ name, audience: Audience, promise, features: string[], featuresText, ctaLabel, popular: boolean, hidden: boolean }`. The `badge` and `tagline` fields are removed from the JSON and from Tina.
  - Content: SMM Standard (local), SMM Pro (local, `popular: true`), TikTok Boost (brand), Personalizat (brand), and a new "UGC & campanii" (brand, `hidden: true`, features "Video UGC pentru reclame", "Concept & scenariu", "Drepturi de utilizare incluse").
  - The builder writes one `promise` line per package in Irina's voice.
- The markup is `section#servicii` containing H2 "Servicii", then a `role="tablist"` with `button#tab-local` / `button#tab-brand` (`role="tab"`, `aria-controls`, `aria-selected`, roving `tabindex`) and `div#panel-local` / `div#panel-brand` (`role="tabpanel"`). Arrow Left/Right/Home/End move between tabs.
- On load and on `hashchange`: `audienceFromHash(location.hash)`. If that returns non-null, select the tab and scroll `#servicii` into view; otherwise default to `local`.
- `popular` renders `Sticker` "cel mai ales". When `features` is empty, render the `featuresText` paragraph instead.

- [ ] **Step 1: Write the failing tests**

```ts
// unit
test('hash mapping', () => {
  expect(audienceFromHash('#servicii-local')).toBe('local');
  expect(audienceFromHash('#servicii-brand')).toBe('brand');
  expect(audienceFromHash('#ceva')).toBeNull(); expect(audienceFromHash('')).toBeNull();
});
// e2e
test('brand door selects brand tab', async ({ page }) => {
  await page.goto('/'); await page.getByRole('link', { name: /Sunt un brand în creștere/ }).click();
  await expect(page.locator('#tab-brand')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-brand')).toContainText('TikTok Boost');
});
test('deep link and unknown hash', async ({ page }) => {
  await page.goto('/#servicii-brand'); await expect(page.locator('#tab-brand')).toHaveAttribute('aria-selected', 'true');
  await page.goto('/#ceva'); await expect(page.locator('#tab-local')).toHaveAttribute('aria-selected', 'true');
});
test('keyboard arrows switch tabs', async ({ page }) => {
  await page.goto('/'); await page.locator('#tab-local').focus(); await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-brand')).toBeFocused(); await expect(page.locator('#tab-brand')).toHaveAttribute('aria-selected', 'true');
});
test('hidden package not rendered; featuresText fallback', async ({ page }) => {
  await page.goto('/#servicii-brand');
  await expect(page.getByText('UGC & campanii')).toHaveCount(0);
  await expect(page.locator('#panel-brand')).toContainText('Strategie unică');
});
```

- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement. Cards are notebook pages: cream with a paper-dot top margin line, 10px radius, no rotation. **Step 4:** Run the tests plus the Tina local build. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: services with audience tabs`.

### Task 9: Results (featured case and case polaroids)

**Files:**
- Modify: `src/components/Results.astro` → move it to `src/components/sections/Results.astro`, `content/results/index.json`, `tina/config.ts` (results; delete the `roi` collection)
- Delete: `src/components/ROI.astro`, `content/roi/`
- Create: `tests/e2e/results.spec.ts`

**Interfaces:**
- JSON: `{ headline: "Rezultate", subtext, featured: { label: "Studiu de caz · un client din retail, TikTok", headline: "€20k+ vânzări lunare din TikTok", stats: {value,label}[] }, cases: { name, href, thumb, category, note, hidden }[] }`.
  - The featured stats are `€20k+` "vânzări / lună", `7 zile` "până la prima vânzare", `TikTok` "canal principal".
  - Case notes: Horay "+3.313 urmăritori", Garduri.md "+60 comenzi", GMD "creștere organică".
  - Remove the emoji from `category` ("Energie regenerabilă", "Construcții", "B2B Industrial").
- `section#rezultate` uses a `bg-teal-mist` background. Each case is a `Polaroid` inside `<a href target="_blank" rel="noopener">` with the accessible name "{name}, deschide pe TikTok". The status reads "● activ", with the text always present.

- [ ] **Step 1: Write the failing tests**

```ts
test('featured case and three cases', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#rezultate')).toContainText('€20k+ vânzări lunare din TikTok');
  await expect(page.locator('#rezultate a[target="_blank"]')).toHaveCount(3);
  await expect(page.locator('#rezultate a[target="_blank"]').first()).toHaveAttribute('rel', /noopener/);
});
test('active state has text, not just color', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('#rezultate').getByText('activ').first()).toBeVisible();
});
```

Add one more test: set `hidden: true` on GMD in a temporary fixture copy and assert the count is 2. Do this as a Container test of `Results` with props overriding the content. To allow that, `Results` accepts an optional `data` prop that defaults to the imported JSON.

- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement. **Step 4:** Run. Expected: PASS. **Step 5:** Commit: `feat: results with featured TikTok case`.

### Task 10: Process ("Cum lucrăm")

**Files:**
- Create: `src/components/sections/Process.astro`, `content/process/index.json`, `tests/e2e/process.spec.ts`
- Modify: `tina/config.ts` (add a `process` collection)

**Interfaces:**
- JSON: `{ headline: "Cum lucrăm", steps: [...] }`, with these steps:
  1. "Discuție": "Îmi povestești despre business și ce vrei să obții."
  2. "Strategie": "Analizez publicul și concurența și fac planul de conținut."
  3. "Creăm": "Filmez, editez, scriu și postez. Tu te ocupi de business."
  4. "Raportăm": "Lunar primești cifre clare: ce a mers și ce schimbăm."
- `section#proces` holds an `<ol>`. From 1024px up it is a horizontal timeline joined by `Tape` pieces; below that it stacks vertically.

- [ ] **Step 1: Write the failing test:** `#proces ol > li` has count 4, and the first item contains "Discuție". **Step 2:** Run. Expected: FAIL. **Step 3:** Implement. **Step 4:** Run. Expected: PASS. **Step 5:** Commit: `feat: process timeline`.

### Task 11: Jurnal (her TikTok)

**Files:**
- Create: `src/components/sections/Journal.astro`, `content/journal/index.json`, `tests/unit/journal.test.ts`, `tests/e2e/journal.spec.ts`
- Modify: `tina/config.ts` (add a `journal` collection), `src/pages/index.astro` (pass the filtered links to `Header`)

**Interfaces:**
- JSON: `{ headline: "Mă găsești și pe TikTok", handle: "", profileUrl: "", tiles: { img, url, caption }[] }`. The handle stays empty until Irina sends it (spec §9).
- `Journal` accepts an optional `data` prop. When `handle` is empty it renders nothing. Otherwise it renders `section#jurnal` with a scroll-snap row of 9:16 tiles (each one an `OptimizedImg` inside an external link) and a "@{handle}" link.
- `index.astro`: `const showJournal = journal.handle.trim() !== ''`. It removes `#jurnal` from the header links when that is false.

- [ ] **Step 1: Write the failing tests**

```ts
// unit (Container)
test('renders nothing without handle', async () => {
  expect((await c.renderToString(Journal, { props: { data: { headline: 'x', handle: '', profileUrl: '', tiles: [] } } })).trim()).toBe('');
});
test('renders handle link when set', async () => {
  const html = await c.renderToString(Journal, { props: { data: { headline: 'x', handle: 'irina', profileUrl: 'https://www.tiktok.com/@irina', tiles: [] } } });
  expect(html).toContain('@irina'); expect(html).toContain('id="jurnal"');
});
// e2e (current content has empty handle)
test('no Jurnal section or nav link yet', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('#jurnal')).toHaveCount(0);
  await expect(page.locator('header a[href="#jurnal"]')).toHaveCount(0);
});
```

- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement. **Step 4:** Run. Expected: PASS. **Step 5:** Commit: `feat: journal section, hidden until handle set`.

### Task 12: Reviews and Contact

**Files:**
- Modify: `src/components/Reviews.astro` → move it to `src/components/sections/Reviews.astro` (replace the JS transform carousel), `src/components/Contact.astro` → move it to `src/components/sections/Contact.astro`, `content/contact/index.json`, `tina/config.ts` (contact: remove phone fields, add `instagramHref`)
- Delete: `public/img/mascot.svg` and the mascot markup/script
- Create: `tests/e2e/reviews-contact.spec.ts`

**Interfaces:**
- Reviews: `section#recenzii`, H2 "Ce spun clienții". The track is a `ul[data-reviews-track]` with `scroll-snap-type: x mandatory` and `overflow-x: auto`. Each `li` is a note card (cream, `Tape` on top, the frame rotated by ±2° in an alternating pattern, the text never rotated). The prev/next buttons call `track.scrollBy({ left: ±cardWidth })` and are labeled "Recenzia anterioară" / "Recenzia următoare". The reviews still come from `content/reviews/*.md`.
- Contact: `section#contact`, H2 "Hai să vorbim despre brandul tău", subtext from JSON. It has three buttons in this order: Telegram (primary, `bg-teal`, label from `telegramLabel`), Instagram ("Scrie-mi pe Instagram", `instagramHref`) and Email (`mailto:`).

- [ ] **Step 1: Write the failing tests**

```ts
test('reviews scroll with buttons', async ({ page }) => {
  await page.goto('/'); const t = page.locator('[data-reviews-track]');
  const before = await t.evaluate(e => e.scrollLeft);
  await page.getByRole('button', { name: 'Recenzia următoare' }).click();
  await expect.poll(() => t.evaluate(e => e.scrollLeft)).toBeGreaterThan(before);
});
test('contact: three channels, no phone, no mascot', async ({ page }) => {
  await page.goto('/'); const c = page.locator('#contact');
  await expect(c.locator('a[href^="https://t.me/"]')).toHaveCount(1);
  await expect(c.locator('a[href*="instagram.com/irinuc.c"]')).toHaveCount(1);
  await expect(c.locator('a[href^="mailto:"]')).toHaveCount(1);
  await expect(page.getByText('Telefon')).toHaveCount(0);
  await expect(page.locator('img[src*="mascot"]')).toHaveCount(0);
});
```

- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement. **Step 4:** Run. Expected: PASS. **Step 5:** Commit: `feat: note-card reviews and contact channels`.

### Task 13: Page assembly, motion, cleanup, and full verification

**Files:**
- Modify: `src/pages/index.astro` (order: Header, Hero, Doors, Clients, Services, Results, Process, Journal, Reviews, Contact, Footer, StickyCta), `src/styles/tokens.css` (motion), `README.md` (stack, colors, fonts, scripts, preview flow)
- Delete: any old component no longer imported, the unused CSS left in `global.css`, and `content/reviews-section/` if it was folded into Reviews. Legacy root files (`/style.css`, `/reset.css`, `/tailwind.config.js`, `/src/input.css`) are deleted only after `grep -r` shows no references from `site/` or the workflow.
- Create: `tests/e2e/a11y.spec.ts`, `tests/e2e/motion.spec.ts`

**Interfaces:**
- Motion: `.reveal` uses `animation: rise .5s ease-out both; animation-timeline: view(); animation-range: entry 0% entry 40%`, inside `@supports (animation-timeline: view())`. The fallback is a 10-line IntersectionObserver in `BaseLayout` that adds `.is-visible`. The hero polaroids get a one-time `.settle` animation (400ms), and the highlight draws in once (`background-size` 0→100%, 600ms). All of it sits inside `@media (prefers-reduced-motion: no-preference)`.

- [ ] **Step 1: Write the failing tests**

```ts
// a11y.spec.ts — runs in all 4 viewport projects
test('axe: no violations', async ({ page }) => {
  await page.goto('/'); const r = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(r.violations).toEqual([]);
});
test('no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
test('no gold left', async ({ page }) => {
  await page.goto('/'); expect(await page.content()).not.toMatch(/cdb181/i);
});
// motion.spec.ts
test('reduced motion: nothing animates', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  const names = await page.$$eval('.reveal, .settle, mark.hl', els => els.map(e => getComputedStyle(e).animationName));
  expect(names.every(n => n === 'none')).toBe(true);
});
```

- [ ] **Step 2:** Run `npm test`. Expected: the new tests FAIL.
- [ ] **Step 3:** Assemble the page, add motion, delete dead code, and fix any axe or overflow failures.
- [ ] **Step 4:** Run `npm test`. Expected: all PASS in all 4 viewport projects.
- [ ] **Step 5:** Run Lighthouse on mobile: `npx lighthouse http://localhost:4321 --preset=perf --form-factor=mobile --only-categories=performance,accessibility,best-practices`. Expected: each score ≥ 95, LCP < 2.0s, CLS < 0.05. Record the scores in the commit message.
- [ ] **Step 6:** Do a manual pass. Tab through the whole page: the order is logical and focus is always visible. Run VoiceOver over the hero, tabs and reviews. Compare the hero against `grwm-teal.html` Level 1 at 1440px.
- [ ] **Step 7:** Commit: `feat: assemble redesign, motion, cleanup`.

### Task 14: Netlify preview, then launch

**Files:**
- Create: `/netlify.toml`

**Interfaces:**
- `netlify.toml`:

```toml
[build]
  base = "site"
  command = "npm run build"
  publish = "dist"
[build.environment]
  NODE_VERSION = "22"
  PUBLIC_PREVIEW = "true"
```

- [ ] **Step 1:** Commit `netlify.toml` and push `redesign` (`git push -u origin redesign`).
- [ ] **Step 2 (Mihaela, in the browser, one time):**
  1. Sign up at netlify.com with GitHub.
  2. Choose "Add new site → Import from Git" and pick `tum-web-lab2`.
  3. Set the branch to deploy to `redesign`.
  4. Rename the site to `irina-redesign`.

  Expected: the deploy succeeds and https://irina-redesign.netlify.app loads.
- [ ] **Step 3:** Verify the preview: `curl -s https://irina-redesign.netlify.app | grep -c 'noindex'` returns `1`, and `grep -c umami` returns `0`.
- [ ] **Step 4:** Send Irina the link plus the §9 asset checklist. Apply her copy feedback as content-only commits on `redesign`, so every push updates the preview.
- [ ] **Step 5 (after Irina approves):** Open a PR from `redesign` to `main`. Before merging, run `npm test` locally once more.
- [ ] **Step 6:** Merge. The GitHub Pages workflow deploys. Verify the live site: `curl -s https://www.ciobanu-irina.online | grep -c noindex` returns `0`, the Umami script is present, and `/admin` opens Tina with the new collections (hero, doors, services, results, process, journal, contact, clients, reviews).
- [ ] **Step 7:** Either delete the Netlify site or change its branch, so the preview doesn't keep serving outdated content.
