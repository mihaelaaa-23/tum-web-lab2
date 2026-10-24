import { expect, test } from 'vitest';
import { isPreview } from '../../src/lib/env';

test('preview only when PUBLIC_PREVIEW is "true"', () => {
  expect(isPreview({ PUBLIC_PREVIEW: 'true' })).toBe(true);
  expect(isPreview({ PUBLIC_PREVIEW: 'false' })).toBe(false);
  expect(isPreview({})).toBe(false);
});
