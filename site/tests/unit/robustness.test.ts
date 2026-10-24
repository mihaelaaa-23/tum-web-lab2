import { beforeAll, expect, test } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Hero from '../../src/components/sections/Hero.astro';
import Journal from '../../src/components/sections/Journal.astro';
import Results from '../../src/components/sections/Results.astro';
import Doors from '../../src/components/sections/Doors.astro';
import heroData from '../../content/hero/index.json';
import resultsData from '../../content/results/index.json';

let c: Awaited<ReturnType<typeof AstroContainer.create>>;
beforeAll(async () => {
  c = await AstroContainer.create();
});
const journal = (data: any) => c.renderToString(Journal, { props: { data } });

test('Hero renders with a single polaroid', async () => {
  const html = await c.renderToString(Hero, { props: { data: { ...heroData, polaroids: heroData.polaroids.slice(0, 1) } } });
  expect(html).toContain('id="hero"');
  expect((html.match(/data-polaroid|<figure/g) ?? []).length).toBe(1);
});

test('Hero renders with no polaroids field', async () => {
  const html = await c.renderToString(Hero, { props: { data: { ...heroData, polaroids: undefined } } });
  expect(html).toContain('<h1');
});

for (const handle of [undefined, null]) {
  test(`Journal renders nothing for handle ${handle}`, async () => {
    expect((await journal({ headline: 'x', handle, profileUrl: '', tiles: [] })).trim()).toBe('');
  });
}

test('Journal strips a leading @ from the handle', async () => {
  const html = await journal({ headline: 'x', handle: '@irina', profileUrl: 'https://www.tiktok.com/@irina', tiles: [] });
  expect(html).toContain('>@irina<');
  expect(html).not.toContain('@@');
});

test('Journal derives the profile URL when empty', async () => {
  const html = await journal({ headline: 'x', handle: '@irina', profileUrl: '', tiles: [] });
  expect(html).toContain('href="https://www.tiktok.com/@irina"');
});

test('Journal tile with empty caption gets a fallback label', async () => {
  const html = await journal({ headline: 'x', handle: 'irina', profileUrl: '', tiles: [{ img: '/img/a.jpg', url: 'https://www.tiktok.com/@irina/video/1', caption: '' }] });
  expect(html).toContain('aria-label="Video TikTok"');
});

test('Results renders cases without a featured block', async () => {
  const { featured, ...rest } = resultsData;
  const html = await c.renderToString(Results, { props: { data: rest } });
  expect((html.match(/target="_blank"/g) ?? []).length).toBe(3);
  expect(html).not.toContain('<dl');
});

test('Results featured stats put the label in dt and value in dd', async () => {
  const html = await c.renderToString(Results, { props: { data: resultsData } });
  expect(html).toMatch(/<dt[^>]*>vânzări \/ lună<\/dt>/);
  expect(html).toMatch(/<dd[^>]*>€20k\+<\/dd>/);
});

test('Doors cycles tones when there are more than two doors', async () => {
  const d = { doors: [0, 1, 2].map((n) => ({ label: `L${n}`, sub: 's', tab: n === 1 ? 'brand' : 'local' })) };
  const html = await c.renderToString(Doors, { props: { data: d } });
  const classes = [...html.matchAll(/<a [^>]*class="([^"]*)"/g)].map((m) => m[1]);
  expect(classes).toHaveLength(3);
  expect(classes[2]).toContain('bg-teal');
  expect(classes[2]).not.toContain('undefined');
});
