// Travel photo pipeline. Run once whenever the photo folder changes:
//
//   node scripts/photos.mjs "/path/to/folder of photos"
//
// Each source image must be named after its country: "Italy.png", or
// "Italy-1.png", "Italy-2.png" for a gallery. For every image this:
//   - applies the camera rotation, then drops ALL metadata (including GPS location)
//   - resizes to at most 1000px wide and converts to WebP
//   - writes public/travel/<slug>-<n>.webp
// and finally rewrites src/data/photos.json, which the Traveler page reads.
// The originals are never copied into the repo.

import { readdir, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = process.argv[2];
if (!srcDir) {
  console.error('Usage: node scripts/photos.mjs "/path/to/photo folder"');
  process.exit(1);
}

// Read slugs + names straight out of the data file so there is one source of truth.
const dataFile = await readFile(path.join(root, 'src/data/countries.ts'), 'utf8');
const countries = [...dataFile.matchAll(/slug: '([^']+)', iso2: '([^']+)', name: '([^']+)'/g)].map(
  ([, slug, iso2, name]) => ({ slug, iso2, name }),
);

const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
const aliases = {
  usa: 'united-states',
  us: 'united-states',
  america: 'united-states',
  uk: 'united-kingdom',
  england: 'united-kingdom',
  scotland: 'united-kingdom',
  greatbritain: 'united-kingdom',
  czechia: 'czech-republic',
  czech: 'czech-republic',
  vatican: 'vatican-city',
};
const lookup = new Map(Object.entries(aliases));
for (const c of countries) {
  lookup.set(norm(c.name), c.slug);
  lookup.set(norm(c.slug), c.slug);
}

const outDir = path.join(root, 'public/travel');
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const files = (await readdir(srcDir))
  .filter((f) => /\.(png|jpe?g|webp|tiff?|avif)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const manifest = {};
const unmatched = [];

for (const file of files) {
  const base = path.parse(file).name.replace(/[\s_-]*\(?\d+\)?$/, ''); // strip "-2", " 2", "(2)"
  const slug = lookup.get(norm(base));
  if (!slug) {
    unmatched.push(file);
    continue;
  }
  const list = (manifest[slug] ??= []);
  const name = `${slug}-${list.length + 1}.webp`;
  await sharp(path.join(srcDir, file))
    .rotate() // bake in orientation, since the metadata that records it is about to be dropped
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(outDir, name)); // sharp writes no EXIF/GPS/XMP unless asked to
  list.push(`travel/${name}`);
  console.log(`  ${file}  ->  public/travel/${name}`);
}

await writeFile(path.join(root, 'src/data/photos.json'), JSON.stringify(manifest, null, 2) + '\n');

const missing = countries.filter((c) => !manifest[c.slug]).map((c) => c.name);
console.log(`\n${Object.values(manifest).flat().length} photo(s) written for ${Object.keys(manifest).length} countries.`);
if (unmatched.length) console.log(`Not matched to a country (skipped): ${unmatched.join(', ')}`);
if (missing.length) console.log(`No photo yet: ${missing.join(', ')}`);
