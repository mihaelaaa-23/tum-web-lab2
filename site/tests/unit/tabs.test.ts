import { expect, test } from 'vitest';
import { audienceFromHash } from '../../src/lib/tabs';

test('hash mapping', () => {
  expect(audienceFromHash('#servicii-local')).toBe('local');
  expect(audienceFromHash('#servicii-brand')).toBe('brand');
  expect(audienceFromHash('#ceva')).toBeNull();
  expect(audienceFromHash('')).toBeNull();
});
