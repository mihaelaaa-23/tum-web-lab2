import { afterAll, beforeAll, expect, test } from 'vitest';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error plain ESM script without types
import { optimizeImages } from '../../scripts/optimize-images.mjs';

const fixtures = fileURLToPath(new URL('../fixtures/img', import.meta.url));
let tmp: string;
beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), 'opt-'));
});
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

test('handles case, spaces and svg', async () => {
  const man = await optimizeImages(fixtures, tmp);
  expect(man['/img/wide.PNG'].variants).toEqual([480, 600]);
  expect(man['/img/small.jpeg'].variants).toEqual([300]);
  expect(man['/img/with space.png'].variants).toEqual([200]);
  expect(existsSync(join(tmp, 'with-space-200.webp'))).toBe(true);
  expect(existsSync(join(tmp, 'wide-600.avif'))).toBe(true);
  expect(man['/img/logo.svg']).toBeUndefined();
});

test('is idempotent', async () => {
  const again = await optimizeImages(fixtures, tmp);
  expect(again['/img/wide.PNG'].variants).toEqual([480, 600]);
});
