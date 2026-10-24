# Premium redesign of ciobanu-irina.online — design

Date: 2026-10-24
Repo: https://github.com/mihaelaaa-23/tum-web-lab2 (the Astro site lives in `site/`)
Status: complete, waiting for Mihaela's approval

## 1. Intent and the why

The site sells Irina Ciobanu's social media services (SMM and TikTok) in Chișinău. Today it reads like a generic services template: a grayscale portrait, cold teal blocks, flip cards, a glassmorphism ROI panel, and a mascot. Her actual brand doesn't look like that. On Instagram (@irinuc.c) she presents as a creator: GRWM videos, fashion-week looks, pink hoodies, cherry nails, leopard and brown leather, brand collabs, and caption chips in Moldovan slang. Her bio sums it up: **"SMM ziua, restul timpului creez ✨"**.

She is now growing her personal brand on TikTok. The site needs to do two things at once:

1. Make Irina, as a person and a creator, the reason to hire her. She knows what people watch because she makes it herself.
2. Convert two kinds of clients quickly:
   - **local businesses** (cafés, salons, shops, clinics) that want someone reliable to "handle everything", and
   - **growing brands** that want TikTok, UGC and campaigns that sell.

"Premium" here means it feels personal, current and expensive-but-approachable. It does not mean corporate luxury.

## 2. Goals, non-goals, anti-goals

**Goals**
- Within the first screen, a visitor knows who Irina is, sees proof (€20k+/month from TikTok, +3.3k followers, first sale in 7 days), and has one obvious next step.
- Two clear doors right under the hero: "Am o afacere locală" and "Sunt un brand în creștere". Each leads to the packages that fit it.
- Her TikTok and creator side is visible on the site, not only linked.
- Everything stays editable by Irina in TinaCMS.
- Lighthouse scores of 95+ on mobile for Performance, Accessibility and Best Practices, and WCAG 2.1 AA.

**Non-goals (for this redesign)**
- No backend, contact form service, booking system or payments. Contact stays as links to Telegram, email and Instagram.
- No blog and no multi-page site. It stays a single landing page.
- No prices. The current site shows none, so packages keep their "ask for an offer" model.
- No new languages. The site stays Romanian only.
- No change to hosting, the domain, the GitHub Pages deploy or Umami analytics.

**Anti-goals (patterns to reject)**
- Glassmorphism, glowing or "holographic" stats, decorative gradients, animated blobs.
- Flip cards, or any interaction that hides information behind hover.
- Emoji used as icons in UI labels (emoji are fine inside her own copy and caption chips).
- Uniform "stock card grid" sections with identical padding and headings.
- A cold, all-grayscale corporate look, and any purple/indigo "AI default" palette.

## 3. Constraints

- Stack stays as it is: Astro 5, Tailwind 4 (via `@tailwindcss/vite`), and TinaCMS with JSON/Markdown content in `site/content/`.
- Hosting is GitHub Pages via `.github/workflows/deploy.yml` on the custom domain `www.ciobanu-irina.online`. The site is static only.
- Teal `#026E82` is Irina's brand color and must stay the lead color. This came from her directly.
- Assets available today: a grayscale cut-out portrait, 3 case thumbnails, 12 client logos, and `mascot.svg`. See §9 for what we still need from her.
- The site must work well on mobile first, because most traffic comes from Instagram and TikTok bios.

## 4. Approaches considered

| | Approach | Trade-off |
|---|---|---|
| A | **Creator-first:** magazine cover with her face and name, TikToks right under it, services later | Strongest personal brand, but a shop owner has to scroll to find "what can you do for me" |
| B | **Results-first studio:** metrics bento grid and reels up top, Irina as the face behind them | Converts bigger brands, but impersonal and not TikTok-native |
| **C** | **Hybrid editorial (chosen):** portrait plus one sharp line, video proof beside her, two doors immediately, then services, cases, her TikTok and reviews | Covers both audiences and her TikTok push; needs care so the two paths stay simple |

**Visual mood.** We tested three rounds of hero mockups:
- Round 1 (Editorial Cream, Midnight Teal, Creator Bold) was rejected: none felt like Irina.
- Round 2 was rebuilt from her Instagram (Front Row, Cherry & Blush, GRWM Diary). She wanted teal kept as her color.
- Round 3 recolored those moods with teal leading. She chose **GRWM Diary**, then **teal level 1 (teal accents on a cream page)** out of three teal intensities.

The chosen mockup is saved as `docs/superpowers/specs/assets/grwm-teal.html` (level 1 is the first hero).

## 5. Design decisions

### 5.1 Concept: "GRWM Diary"

The page is Irina's scrapbook or creator journal. It uses a cream dotted-paper background, white polaroids held with washi tape, torn teal paper, short handwritten notes, a pink highlighter on key phrases, and one leopard detail per screen at most. The scrapbook elements frame real proof (case videos and numbers). They never replace it.

**Rules that keep it premium rather than childish:**
- Each screen gets at most 2 polaroids, 1 handwritten note and 1 leopard element.
- Handwriting (Caveat) is for short asides of 2–5 words. It is never used for body text, navigation or buttons.
- Rotations stay between −6° and +6°. Content blocks (text, package cards, forms) are never rotated.
- Generous whitespace, with a strict spacing scale (§5.4).

### 5.2 Color tokens

| Token | Value | Use |
|---|---|---|
| `teal` | `#026E82` | Brand lead: buttons, stats, handwriting, links, torn paper |
| `teal-deep` | `#014E5C` | Hover/pressed states, text on pale teal |
| `teal-mist` | `#E4F0EF` | Occasional section background, for rhythm |
| `cream` | `#FBF7F1` | Main page background |
| `paper-dot` | `#E9DFD3` | Dot grid, hairlines |
| `ink` | `#1E1715` | Headings and body text (espresso, not pure black) |
| `ink-muted` | `#5D514B` | Secondary text |
| `blush` | `#F2C9CF` | Highlighter, second door, tape, stickers |
| `leopard-tan` / `leopard-spot` | `#C9935C` / `#3B2418` | Leopard detail only |
| `white` | `#FFFFFF` | Polaroid frames, caption chips |

- Gold `#CDB181` is retired.
- Contrast: teal on cream and ink-muted on cream both pass AA for normal text. White text on teal passes AA. Blush is never used as a text color on cream, only as a background behind ink text.

### 5.3 Typography

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Gloock** (400) | Soft high-contrast serif, editorial but warm |
| Body / UI | **Hanken Grotesk** (variable, 400–800) | Clean, slightly characterful grotesk |
| Handwritten accents | **Caveat** (500/700) | Asides only (see §5.1) |

- Fonts are self-hosted with `@fontsource` so there is no Google Fonts request. This is my call.
- Scale: hero H1 `clamp(2.5rem, 6vw, 4rem)`, H2 `clamp(2rem, 4.5vw, 3rem)`, body 1rem/1.6, small 0.75rem. Headings use `letter-spacing: -0.02em`.
- The pink highlighter is a `<mark>`-style span with `box-decoration-break: clone`, so it wraps across lines correctly.

### 5.4 Spacing, radius, shadow

- Spacing uses Tailwind's 4px scale. Section vertical padding is 96px on desktop and 64px on mobile. Sections vary layout so the page has rhythm, instead of repeating centered H2 → subtext → grid.
- Radius: 4px for highlights and chips, 10px for buttons and cards, 999px for pills and stickers, 0 for polaroids.
- Shadow: a single `polaroid` shadow token. Nothing else casts a shadow.

### 5.5 Page structure (top to bottom)

1. **Header.** Sticky, cream, with a hairline border once the page scrolls. "Irina Ciobanu" in Gloock; links Servicii · Rezultate · Jurnal · Contact; a teal pill "Scrie-mi". On mobile it becomes an accessible disclosure menu (a button with `aria-expanded`, not `role="menu"`).

2. **Hero** (matches the mockup).
   - Left column: handwritten "hei, eu sunt Irina ♡", then H1 *"Fac brandul tău <highlight>să fie văzut.</highlight> Și cumpărat."*, then the line "SMM ziua, content creator restul timpului. Știu ce se uită oamenii pe TikTok pentru că îl fac și eu.", the teal CTA "Scrie-mi →", and three stats.
   - Right column: the portrait on torn teal paper, a leopard circle, and 2 polaroids of cases.
   - Mobile: the portrait goes first and is cropped tighter, with one polaroid. Text follows, and the stats sit in a row of 3.

3. **Two doors.** A full-width split bar: teal "Am o afacere locală", blush "Sunt un brand în creștere". Each one scrolls to Services and selects the matching tab, and also sets a URL hash (`#servicii-local`, `#servicii-brand`) so links can be shared.

4. **Client logos ("Au avut încredere").** Moved up from the bottom, as the first proof under the doors. It's a slow marquee that pauses on hover and focus and turns static under `prefers-reduced-motion`. Every logo gets its real brand name as alt text.

5. **Servicii.** Two tabs: Afacere locală / Brand în creștere (an accessible tablist).
   - *Local*: SMM Standard, SMM Pro (with a "cel mai ales" sticker).
   - *Brand*: TikTok Boost, Personalizat, plus a new **UGC & campanii** offer (see §8).
   - Cards look like notebook pages: name, a one-line promise, a feature list and a CTA. Everything is visible, with no flip.
   - Each package gets an `audience` field in the CMS.

6. **Rezultate** (on a teal-mist background for rhythm).
   - A featured case study: "€20k+ vânzări lunare din TikTok", with first sales in 7 days. It replaces the old gradient ROI section.
   - Below it: 3 case polaroids (Horay, Garduri.md, GMD), each with a handwritten stat and an "activ" label made of text plus a dot, not color alone.
   - Clicking a case opens the TikTok in a new tab. Inline playback is an optional enhancement (see §7).

7. **Cum lucrăm.** New. Four short steps: Discuție → Strategie → Creăm → Raportăm. It's a horizontal "tape timeline" on desktop and stacks on mobile. This removes the uncertainty a premium buyer has about the process.

8. **Jurnal (her creator side).** New. *"Mă găsești și pe TikTok"* plus her handle, with 4–6 vertical tiles from her own content (GRWM, trends, collabs) in a scroll-snap row. Each tile links out. It shows brands that she can make content, not just manage it.

9. **Recenzii.** Reviews become handwritten-note cards (cream, tape, slight rotation on the frame only) in a native CSS scroll-snap row with prev/next buttons. This replaces the custom JS transform carousel. The quotes come from the existing `content/reviews/*.md` files.

10. **Contact.** H2 *"Hai să vorbim despre brandul tău"*, with three large buttons: Telegram (primary, teal), Instagram DM and Email. The empty phone line is removed (today it renders "Telefon:" with nothing after it). There is no form.

11. **Footer.** Name, "SMM ziua, restul timpului creez ✨", social links and the year.

12. **Mobile sticky CTA.** A slim bottom bar with "Scrie-mi pe Telegram". It appears after the hero scrolls out of view. It replaces the old `MobileCTA` section.

**Removed:** the mascot and speech bubble (this is my call: it clashes with a premium personal brand; it can come back as a small sticker if Irina wants it), the flip cards, the ROI glass panel, and the old `MobileCTA` block.

### 5.6 Motion

- Use CSS only where possible: scroll-driven reveal (`animation-timeline: view()`) with a simple fade/rise, plus an IntersectionObserver fallback for browsers that need it.
- On load, the hero polaroids "settle" into place (a small rotate-and-drop, 400ms). The highlighter draws in once.
- Everything respects `prefers-reduced-motion: reduce`, which means no marquee, no settle and no reveal.
- The `setTimeout` stagger script and the custom smooth-scroll JS are removed. Use CSS `scroll-behavior: smooth` and `scroll-margin-top`.

### 5.7 Copy direction

- Use Irina's voice: first person, warm, a little cheeky, local. A touch of Moldovan colloquial ("oleacă") in asides is fine. Headings stay clear.
- Market framing for 2026: short-form video, TikTok as a sales and search channel, UGC, and content made by creators rather than agencies.
- Every claim is backed by a real number or case. No invented metrics.
- Final copy is drafted by the builder in Romanian, following this direction. Irina approves it before launch.

## 6. Accessibility contract

- `lang="ro"`, a skip link, landmark elements, and one H1.
- Visible focus rings (2px teal with an offset), and touch targets of at least 44px.
- Tabs, menu and carousel are keyboard operable and use the correct ARIA patterns.
- Decorative scrapbook elements are `aria-hidden`. Polaroids carry meaningful alt text.
- State is never shown by color alone ("activ" uses a text label).
- Checked with axe at 320, 768, 1024 and 1440px widths.

## 7. Performance contract

- Images go through `astro:assets` (`<Image>`/`<Picture>`) to AVIF/WebP with explicit sizes. The hero portrait is preloaded and everything else is lazy-loaded.
- No third-party embeds on load. If inline TikTok playback is added, it uses a click-to-load facade.
- Fonts are self-hosted and subset to Latin plus Romanian diacritics (ă â î ș ț).
- Target: LCP under 2.0s on a mid-range phone over 4G, CLS under 0.05.

## 8. CMS (TinaCMS) changes

Irina must still be able to edit everything. The schema changes, and the content JSON migrates to match:

- **hero:** add `handNote`, `headlineBefore`, `headlineHighlight`, `headlineAfter`, `subtext`, `ctaLabel`/`ctaHref`, `stats[]` (value and label), `polaroids[]` (image, note).
- **doors** (new): two items, each with label, sub-label and target tab.
- **services:** packages gain `audience: local | brand`, `promise`, `popular` (boolean). `badge`/`tagline` (the flip-card fields) are removed.
- **results:** add `featured` (headline, stats); cases gain `note` (the handwritten stat).
- **process** (new): `steps[]` (title, text).
- **journal** (new): `handle`, `profileUrl`, `tiles[]` (image, url, caption).
- **contact:** remove phone; add `instagramHref`.
- **clients:** `alt` becomes the real brand name.
- **reviews:** unchanged.

The new **UGC & campanii** package goes into the content as hidden (`hidden: true`) until Irina confirms she offers it.

## 9. What we need from Irina (blocking for the final look, not for the build)

1. **2–3 color photos** in high resolution: one for the hero (ideally a plain background so we can cut it out), plus 1–2 lifestyle shots. Until they arrive, the build uses the current portrait.
2. Her **TikTok handle** and 4–6 cover images for the Jurnal section.
3. The **real brand names** for the 12 client logos.
4. Confirmation of the **UGC & campanii** offer and of the current package contents.
5. Approval of the final Romanian copy.

## 9b. Calls made after the builder check (marked as mine, easy to reverse)

- **Images stay in `public/img`.** Irina's Tina upload flow doesn't change. To meet §7, a build step (a small `sharp` script run before `astro build`) generates AVIF/WebP variants and width sets next to each original, and an `<OptimizedImg>` component emits `<picture>` with `srcset` from the CMS path. Tina's media root is untouched.
- **Safe fallbacks if content is missing at launch.** Jurnal and its nav link are hidden while `journal.handle` is empty. Logos with no real name render with `alt=""` inside a list labeled "Clienți". When names arrive, they become real alt text.
- **The €20k+ case is credited to Irina's work without naming the client** ("un client din retail, TikTok"), unless she says the client can be named. The +3.3k stat is labeled as the Horay case.

## 9c. Release path (decided by Mihaela)

- All redesign work happens on a long-lived branch, `redesign`. `main` and the live site stay untouched until launch.
- **Preview link:** connect the GitHub repo to a free **Netlify** site (my call over Vercel or Cloudflare Pages; any of the three works the same way) that builds only the `redesign` branch from `site/`, using `npm ci && npm run build` and publishing `dist`. The Tina admin build is skipped on preview, so no Tina credentials go to Netlify. Every push updates a stable URL like `irina-redesign.netlify.app` that Irina can open on her phone.
  - Mihaela creates the Netlify account and connects the repo. It's a one-time, ~5-minute step done in the browser, and the plan will spell it out.
- The preview build sets `PUBLIC_PREVIEW=true`, which adds `<meta name="robots" content="noindex">` and disables Umami, so the preview isn't indexed and doesn't pollute analytics.
- **CMS cutover:** Irina is not editing content in Tina right now, so there's no content freeze or backward-compatible schema. The new Tina schema and the migrated content land on `redesign` together and go to `main` in the launch merge. After the merge, check that Tina Cloud re-indexes `main` and the admin opens with the new collections.
- **Launch** happens after Irina approves the preview. `redesign` is merged into `main`, the existing GitHub Pages workflow deploys to ciobanu-irina.online, and the Netlify preview is then deleted or kept for future changes.

## 10. Left to the builder

- Exact breakpoint behavior between the anchor widths, within the mobile-first rules above.
- The micro-interaction details (hover lift on polaroids, the button press state), kept subtle.
- Component split (one Astro component per section, plus small shared primitives: `Polaroid`, `Tape`, `Highlight`, `HandNote`, `Sticker`). No component over ~200 lines.
- Whether to delete the legacy root files (`style.css`, `reset.css`, `tailwind.config.js`, `src/input.css`) that the Astro build doesn't use. They're kept unless they're confirmed unused; README screenshots in `img/` are kept.

## 11. Done means

- All sections in §5.5 render from CMS content, and Irina can edit them in Tina.
- The verification checklist from the frontend-ui-engineering skill passes: no console errors, keyboard pass, screen reader pass, works at 320/768/1024/1440, axe clean, and the result matches this design.
- Lighthouse mobile scores of 95+ for Performance, Accessibility and Best Practices.
- The GitHub Pages deploy succeeds on the custom domain.
