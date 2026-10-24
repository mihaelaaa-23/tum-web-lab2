import { expect, test } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { srcsetFor } from '../../src/lib/images';
import OptimizedImg from '../../src/components/primitives/OptimizedImg.astro';

const m = { '/img/a.png': { width: 1114, height: 1140, variants: [480, 960, 1114] } };

test('srcset lists every variant', () => {
  expect(srcsetFor('/img/a.png', 'webp', m)).toBe(
    '/img/_opt/a-png-480.webp 480w, /img/_opt/a-png-960.webp 960w, /img/_opt/a-png-1114.webp 1114w',
  );
});

test('unknown image returns null', () => expect(srcsetFor('/img/x.svg', 'avif', m)).toBeNull());

test('OptimizedImg falls back to a plain img for unlisted sources', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(OptimizedImg, {
    props: { src: '/img/logo.svg', alt: 'Logo' },
  });
  expect(html).toContain('<img');
  expect(html).toContain('src="/img/logo.svg"');
  expect(html).not.toContain('<source');
});
