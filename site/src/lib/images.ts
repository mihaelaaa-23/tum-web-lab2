import { slugOf } from './image-slug.mjs';

export type Manifest = Record<string, { width: number; height: number; variants: number[] }>;
export type ImageFormat = 'avif' | 'webp';

const files = import.meta.glob<Manifest>('../generated/image-manifest.json', {
  eager: true,
  import: 'default',
});

/** Build-time manifest; empty when the generator has not run yet. */
export const manifest: Manifest = Object.values(files)[0] ?? {};

export function srcsetFor(src: string, format: ImageFormat, m: Manifest = manifest): string | null {
  const entry = m[src];
  if (!entry) return null;
  const slug = slugOf(src.replace(/^\/img\//, ''));
  return entry.variants.map((w) => `/img/_opt/${slug}-${w}.${format} ${w}w`).join(', ');
}
