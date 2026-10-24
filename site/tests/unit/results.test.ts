import { beforeAll, expect, test } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Results from '../../src/components/sections/Results.astro';
import data from '../../content/results/index.json';

let c: Awaited<ReturnType<typeof AstroContainer.create>>;
beforeAll(async () => {
  c = await AstroContainer.create();
});

const count = (html: string) => (html.match(/target="_blank"/g) ?? []).length;

test('renders all three cases by default', async () => {
  expect(count(await c.renderToString(Results))).toBe(3);
});

test('hidden case is not rendered', async () => {
  const fixture = {
    ...data,
    cases: data.cases.map((x) => (x.name.startsWith('GMD') ? { ...x, hidden: true } : x)),
  };
  const html = await c.renderToString(Results, { props: { data: fixture } });
  expect(count(html)).toBe(2);
  expect(html).not.toContain('GMD Oils');
});
