import { beforeAll, expect, test } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Polaroid from '../../src/components/primitives/Polaroid.astro';
import Tape from '../../src/components/primitives/Tape.astro';
import Highlight from '../../src/components/primitives/Highlight.astro';
import HandNote from '../../src/components/primitives/HandNote.astro';
import Sticker from '../../src/components/primitives/Sticker.astro';
import Leopard from '../../src/components/primitives/Leopard.astro';
import TornPaper from '../../src/components/primitives/TornPaper.astro';

let c: Awaited<ReturnType<typeof AstroContainer.create>>;
beforeAll(async () => {
  c = await AstroContainer.create();
});

const base = { src: '/img/thumb-horay.png', alt: 'Horay', width: 120, height: 150 };

test('Polaroid clamps rotation above 6', async () => {
  expect(await c.renderToString(Polaroid, { props: { ...base, rotate: 12 } })).toContain('rotate(6deg)');
});

test('Polaroid clamps rotation below -6', async () => {
  expect(await c.renderToString(Polaroid, { props: { ...base, rotate: -20 } })).toContain('rotate(-6deg)');
});

test('Polaroid renders image, caption and decorative tape', async () => {
  const html = await c.renderToString(Polaroid, { props: { ...base, note: 'Horay' } });
  expect(html).toContain('alt="Horay"');
  expect(html).toContain('shadow-polaroid');
  expect(html).toContain('Horay</span>');
  expect(html).toContain('aria-hidden="true"');
});

test('decorations are hidden from AT', async () => {
  for (const C of [Tape, Leopard, TornPaper]) expect(await c.renderToString(C)).toContain('aria-hidden="true"');
});

test('Tape teal uses the pinned rgba', async () => {
  expect(await c.renderToString(Tape)).toContain('rgb(2 110 130 / .35)');
});

test('Highlight renders mark', async () => {
  expect(await c.renderToString(Highlight, { slots: { default: 'să fie văzut.' } })).toMatch(
    /<mark[^>]*>să fie văzut\.<\/mark>/,
  );
});

test('HandNote renders font-hand text with chosen element', async () => {
  const html = await c.renderToString(HandNote, { props: { as: 'p' }, slots: { default: 'hei' } });
  expect(html).toMatch(/<p[^>]*font-hand[^>]*>hei<\/p>/);
});

test('Sticker renders a pill with clamped rotation', async () => {
  const html = await c.renderToString(Sticker, { props: { rotate: 30 }, slots: { default: 'SMM' } });
  expect(html).toContain('rounded-full');
  expect(html).toContain('rotate(6deg)');
});

test('Leopard honours size', async () => {
  expect(await c.renderToString(Leopard, { props: { size: 110 } })).toContain('110px');
});
