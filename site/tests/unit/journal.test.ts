import { beforeAll, expect, test } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Journal from '../../src/components/sections/Journal.astro';

let c: Awaited<ReturnType<typeof AstroContainer.create>>;
beforeAll(async () => {
  c = await AstroContainer.create();
});

const render = (data: any) => c.renderToString(Journal, { props: { data } });

test('renders nothing without handle', async () => {
  expect((await render({ headline: 'x', handle: '', profileUrl: '', tiles: [] })).trim()).toBe('');
});

test('renders nothing for a whitespace-only handle', async () => {
  expect((await render({ headline: 'x', handle: '   ', profileUrl: '', tiles: [] })).trim()).toBe('');
});

test('renders handle link when set', async () => {
  const html = await render({ headline: 'x', handle: 'irina', profileUrl: 'https://www.tiktok.com/@irina', tiles: [] });
  expect(html).toContain('@irina');
  expect(html).toContain('id="jurnal"');
  expect(html).toContain('href="https://www.tiktok.com/@irina"');
});

test('renders tiles as external links named by caption', async () => {
  const html = await render({
    headline: 'x', handle: 'irina', profileUrl: 'https://www.tiktok.com/@irina',
    tiles: [{ img: '/img/a.jpg', url: 'https://www.tiktok.com/@irina/video/1', caption: 'Primul video' }],
  });
  expect(html).toContain('href="https://www.tiktok.com/@irina/video/1"');
  expect(html).toContain('target="_blank"');
  expect(html).toContain('rel="noopener"');
  expect(html).toContain('Primul video');
  expect(html).toContain('aspect-[9/16]');
});
