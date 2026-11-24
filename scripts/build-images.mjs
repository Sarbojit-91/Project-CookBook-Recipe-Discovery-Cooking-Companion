/**
 * Generates responsive AVIF + WebP versions of recipe photos.
 *
 *   npm run images          process new or changed photos
 *   npm run images:check    fail if any output is missing or out of date (used by `npm run check`)
 *
 * Source photos live in src/content/images/. Output goes to public/images/recipes/ and a manifest
 * (sizes, placeholder, source hash) to src/content/images.generated.json. Both are committed, so
 * builds and hosting never need to process images. EXIF metadata (including GPS) is stripped.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "src/content/images");
const OUT_DIR = path.join(ROOT, "public/images/recipes");
const MANIFEST = path.join(ROOT, "src/content/images.generated.json");

const WIDTHS = [480, 800, 1200, 1600];
const FORMATS = /** @type {const} */ ([
  ["avif", { quality: 55, effort: 6 }],
  ["webp", { quality: 74 }],
]);
const SOURCE_PATTERN = /^[a-z0-9-]+\.(jpe?g|png|webp)$/;

const checkOnly = process.argv.includes("--check");

const baseName = (file) => file.replace(/\.[^.]+$/, "");
const outputFiles = (file, widths) =>
  widths.flatMap((w) => FORMATS.map(([ext]) => `${baseName(file)}-${w}.${ext}`));

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

async function processImage(file, buffer, hash) {
  const image = sharp(buffer).rotate(); // apply EXIF orientation, then metadata is dropped
  const meta = await image.metadata();
  if (!meta.width || !meta.height) throw new Error(`${file}: could not read image size`);
  // EXIF orientations 5–8 are quarter turns, so the displayed width is the stored height.
  const turned = (meta.orientation ?? 1) >= 5;
  const width = turned ? meta.height : meta.width;
  const height = turned ? meta.width : meta.height;
  if (width < WIDTHS[0])
    throw new Error(`${file}: must be at least ${WIDTHS[0]}px wide (is ${width}px)`);

  const widths = WIDTHS.filter((w) => w <= width);
  await mkdir(OUT_DIR, { recursive: true });
  for (const w of widths) {
    for (const [ext, options] of FORMATS) {
      await image
        .clone()
        .resize({ width: w })
        [ext](options)
        .toFile(path.join(OUT_DIR, `${baseName(file)}-${w}.${ext}`));
    }
  }

  const tiny = await image.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  return {
    width,
    height,
    widths,
    placeholder: `data:image/webp;base64,${tiny.toString("base64")}`,
    hash,
  };
}

async function main() {
  const manifest = await readManifest();
  const sources = existsSync(SRC_DIR)
    ? (await readdir(SRC_DIR)).filter((f) => !f.startsWith(".") && f !== "README.md")
    : [];

  const problems = [];
  const next = {};

  for (const file of sources.sort()) {
    if (!SOURCE_PATTERN.test(file)) {
      problems.push(`${file}: rename to lowercase-with-hyphens and use .jpg, .png or .webp`);
      continue;
    }
    const buffer = await readFile(path.join(SRC_DIR, file));
    const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 16);
    const existing = manifest[file];
    const upToDate =
      existing?.hash === hash &&
      outputFiles(file, existing.widths).every((f) => existsSync(path.join(OUT_DIR, f)));

    if (upToDate) {
      next[file] = existing;
    } else if (checkOnly) {
      problems.push(`${file}: output missing or out of date`);
    } else {
      console.log(`Processing ${file}…`);
      next[file] = await processImage(file, buffer, hash);
    }
  }

  const removed = Object.keys(manifest).filter((file) => !sources.includes(file));
  if (checkOnly && removed.length > 0) {
    problems.push(...removed.map((f) => `${f}: listed in the manifest but the source is gone`));
  }

  if (problems.length > 0) {
    console.error(`Image problems:\n${problems.map((p) => `  • ${p}`).join("\n")}`);
    if (checkOnly) console.error("Run `npm run images` to fix.");
    process.exit(1);
  }
  if (checkOnly) {
    console.log(`Images up to date (${sources.length}).`);
    return;
  }

  for (const file of removed) {
    for (const out of outputFiles(file, manifest[file].widths ?? WIDTHS)) {
      await rm(path.join(OUT_DIR, out), { force: true });
    }
    console.log(`Removed output for deleted ${file}`);
  }

  await writeFile(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Done: ${Object.keys(next).length} image(s) in the manifest.`);
}

await main();
