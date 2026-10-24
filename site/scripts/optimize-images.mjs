import sharp from 'sharp';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const RASTER = new Set(['.png', '.jpg', '.jpeg']);
const FORMATS = {
  avif: (img) => img.avif({ quality: 55 }),
  webp: (img) => img.webp({ quality: 75 }),
};

const slugOf = (name) => name.toLowerCase().replace(/ /g, '-');

async function isFresh(out, srcMtime) {
  try {
    return (await stat(out)).mtimeMs >= srcMtime;
  } catch {
    return false;
  }
}

/**
 * Generates AVIF/WebP width variants for raster images in srcDir (non-recursive).
 * Returns a manifest keyed by public path, e.g. "/img/portrait.png".
 */
export async function optimizeImages(srcDir, outDir, widths = [480, 960, 1440]) {
  await mkdir(outDir, { recursive: true });
  const manifest = {};
  const entries = (await readdir(srcDir, { withFileTypes: true }))
    .filter((e) => e.isFile() && RASTER.has(parse(e.name).ext.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const file = join(srcDir, entry.name);
    const { mtimeMs } = await stat(file);
    const { width, height } = await sharp(file).metadata();
    const variants = widths.filter((w) => w < width).concat(width);
    const slug = slugOf(parse(entry.name).name);

    for (const w of variants) {
      for (const [format, encode] of Object.entries(FORMATS)) {
        const out = join(outDir, `${slug}-${w}.${format}`);
        if (await isFresh(out, mtimeMs)) continue;
        await encode(sharp(file).resize({ width: w, withoutEnlargement: true })).toFile(out);
      }
    }
    manifest[`/img/${entry.name}`] = { width, height, variants };
  }
  return manifest;
}

async function main() {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const manifest = await optimizeImages(join(root, 'public/img'), join(root, 'public/img/_opt'));
  const manifestPath = join(root, 'src/generated/image-manifest.json');
  await mkdir(join(root, 'src/generated'), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`optimize-images: ${Object.keys(manifest).length} images`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
