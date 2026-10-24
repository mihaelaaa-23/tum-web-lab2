export type Audience = 'local' | 'brand';

const BY_HASH: Record<string, Audience> = {
  '#servicii-local': 'local',
  '#servicii-brand': 'brand',
};

export function audienceFromHash(hash: string): Audience | null {
  return Object.hasOwn(BY_HASH, hash) ? BY_HASH[hash] : null;
}
