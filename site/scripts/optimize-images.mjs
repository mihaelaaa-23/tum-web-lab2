import sharp from 'sharp';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join, parse, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugOf } from '../src/lib/image-slug.mjs';

const RASTER = new Set(['.png', '.jpg', '.jpeg']);
const FORMATS = {
  avif: (img) => img.avif({ quality: 55 }),
  webp: (img) => img.webp({ quality: 75 }),
};

async function isFresh(out, srcMtime) {
  try {
    return (await stat(out)).mtimeMs >= srcMtime;
  } catch {
    return false;
  }
}

async function listRasters(dir) {
  const found = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name !== '_opt') found.push(...(await listRasters(join(dir, e.name))));
    } else if (e.isFile() && RASTER.has(parse(e.name).ext.toLowerCase())) {
      found.push(join(dir, e.name));
    }
  }
  return found;
}

async function processOne(file, rel, outDir, widths) {
  const { mtimeMs } = await stat(file);
  const meta = await sharp(file).metadata();
  const swap = meta.orientation >= 5 && meta.orientation <= 8;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;
  if (!width || !height) throw new Error('no dimensions');
  const variants = widths.filter((w) => w < width).concat(width);
  const slug = slugOf(rel);

  for (const w of variants) {
    for (const [format, encode] of Object.entries(FORMATS)) {
      const out = join(outDir, `${slug}-${w}.${format}`);
      if (await isFresh(out, mtimeMs)) continue;
      await encode(sharp(file).rotate().resize({ width: w, withoutEnlargement: true })).toFile(out);
    }
  }
  return { width, height, variants };
}

/**
 * Generates AVIF/WebP width variants for raster images under srcDir (recursive, skips _opt).
 * Returns a manifest keyed by public path, e.g. "/img/sub/portrait.png".
 * Unreadable images are warned about and left out of the manifest; this never throws for them.
 */
export async function optimizeImages(srcDir, outDir, widths = [480, 960, 1440]) {
  await mkdir(outDir, { recursive: true });
  const manifest = {};
  const files = (await listRasters(srcDir)).sort();

  for (const file of files) {
    const rel = relative(srcDir, file).split(sep).join('/');
    try {
      manifest[`/img/${rel}`] = await processOne(file, rel, outDir, widths);
    } catch (err) {
      console.warn(`optimize-images: skipping ${rel}: ${err.message}`);
    }
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
