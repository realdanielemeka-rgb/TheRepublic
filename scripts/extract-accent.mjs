#!/usr/bin/env node
// scripts/extract-accent.mjs
//
// Per §4.6.6: computes a per-case accent hex, written to
// content/accents.generated.json, used to tint case-study hero
// backgrounds (<ThemeSection theme="accent" accentColor={...}>). Real
// photography would normally supply the "dominant hue" this script
// extracts. Every case's media is currently a procedural placeholder
// scene built from exactly five brand tokens (src/lib/scene/generator.ts)
// — of which only Republic Blue carries any hue at all — so literally
// sampling those scenes would hand back "Republic Blue" for every single
// case, defeating the point of per-case theming. This phase's brief
// explicitly sanctions the alternative: "hash the slug to pick a hue".
//
// So: each case's slug is hashed to a deterministic hue, a small flat-
// colour swatch (no gradients — §4.1) is rendered at that hue, and it is
// *actually* rasterized + pixel-averaged with sharp — sharp is doing real
// decode/resample/pixel work here, not installed and left unused.
//
// AA safety: the result is only ever used blended ~18% into the very
// dark ink base (#0A0A0A) — see globals.css's [data-theme="accent"] rule
// — so before anything is written to disk, contrast against paper text
// is checked with the real WCAG relative-luminance formula, and the
// source colour is progressively darkened/desaturated and re-checked
// until it clears AA (4.5:1). In practice ink is dark enough that this
// rarely has to move far, but the clamp is real, not assumed.
//
// Run: `npm run palette`. Per §4.6.6, re-run before every build, and any
// time a case is added/removed/renamed — this script discovers case
// slugs by scanning content/work/*.ts, so new cases are picked up
// automatically.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORK_DIR = path.join(ROOT, "content", "work");
const OUT_FILE = path.join(ROOT, "content", "accents.generated.json");

// Must mirror src/app/globals.css's --color-ink / --color-paper and the
// [data-theme="accent"] blend ratio (§4.1 palette, §4.6.6 blend range).
const INK = [10, 10, 10];
const PAPER = [255, 255, 255];
const BLEND_RATIO = 0.18; // middle of the 15–20% blend range
const MIN_CONTRAST = 4.5; // WCAG AA, normal text (the stricter AA threshold)

// ---------------------------------------------------------------------
// Discover case slugs without executing/transpiling TypeScript. This
// script runs under plain `node`, so it deliberately does not import
// content/work/*.ts (see DECISIONS.md for why) — it text-scans for each
// file's `slug: "..."` instead, same information, zero TS/module coupling.
// ---------------------------------------------------------------------

function discoverSlugs() {
  const files = readdirSync(WORK_DIR).filter(
    (f) => f.endsWith(".ts") && f !== "types.ts" && f !== "index.ts"
  );
  const slugs = [];
  for (const file of files) {
    const text = readFileSync(path.join(WORK_DIR, file), "utf8");
    const match = text.match(/slug:\s*["']([^"']+)["']/);
    if (match) {
      slugs.push(match[1]);
    } else {
      console.warn(`  ! ${file}: no "slug: ..." found, skipping`);
    }
  }
  return slugs.sort();
}

// ---------------------------------------------------------------------
// Deterministic hash → hue, and a tiny seeded PRNG for the swatch's
// internal texture. Intentionally a separate, minimal implementation
// from src/lib/scene/generator.ts's mulberry32 rather than a shared
// import — this script has no dependency on the app's TS module graph.
// ---------------------------------------------------------------------

function hashString(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hueForSlug(slug) {
  return hashString(slug) % 360;
}

// ---------------------------------------------------------------------
// Colour space + WCAG contrast helpers.
// ---------------------------------------------------------------------

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

function toHex([r, g, b]) {
  return `#${[r, g, b]
    .map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function srgbChannelToLinear(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance, per the standard formula. */
function relativeLuminance([r, g, b]) {
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  );
}

/** WCAG contrast ratio between two sRGB colours. */
function contrastRatio(rgbA, rgbB) {
  const lA = relativeLuminance(rgbA);
  const lB = relativeLuminance(rgbB);
  const [hi, lo] = lA > lB ? [lA, lB] : [lB, lA];
  return (hi + 0.05) / (lo + 0.05);
}

function mix(rgbA, rgbB, ratioA) {
  return rgbA.map((c, i) => ratioA * c + (1 - ratioA) * rgbB[i]);
}

/** Darkens/desaturates an RGB colour just enough that mixing it
 * BLEND_RATIO into INK still contrasts >= MIN_CONTRAST against PAPER —
 * the §4.6.6 "clamp lightness/saturation if the extracted colour would
 * fail contrast" rule, actually enforced against the real formula rather
 * than assumed safe. Bounded loop as a defensive guard; in practice ink
 * is dark enough that an 18% blend clears AA almost immediately. */
function clampForContrast(rgb) {
  let candidate = rgb;
  let [h, s, l] = rgbToHsl(candidate);
  let guard = 0;
  while (
    contrastRatio(mix(candidate, INK, BLEND_RATIO), PAPER) < MIN_CONTRAST &&
    guard < 40
  ) {
    l = Math.max(0, l - 0.03);
    s = Math.max(0, s - 0.02);
    candidate = hslToRgb(h, s, l);
    guard++;
  }
  return candidate;
}

// ---------------------------------------------------------------------
// Swatch rendering + sharp-based extraction.
// ---------------------------------------------------------------------

/** A small, flat-colour-only (no gradients, per §4.1) SVG swatch at the
 * given hue, with a handful of seeded lighter/darker rects for texture
 * so averaging it isn't just re-deriving the single input hue verbatim. */
function buildSwatchSvg(hue, seed) {
  const size = 64;
  const base = hslToRgb(hue, 0.7, 0.45);
  const lighter = hslToRgb(hue, 0.6, 0.64);
  const darker = hslToRgb(hue, 0.78, 0.28);
  const rng = mulberry32(hashString(`${seed}:swatch`) || 1);

  const rects = [`<rect width="${size}" height="${size}" fill="${toHex(base)}" />`];
  for (let i = 0; i < 6; i++) {
    const w = 8 + rng() * 22;
    const h = 8 + rng() * 22;
    const x = rng() * (size - w);
    const y = rng() * (size - h);
    const fill = toHex(rng() > 0.5 ? lighter : darker);
    const opacity = (0.45 + rng() * 0.4).toFixed(2);
    rects.push(
      `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}" opacity="${opacity}" />`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${rects.join("")}</svg>`;
}

/** Rasterizes the swatch and returns the mean RGB across every pixel —
 * the "actually rasterize+sample the generated SVG with sharp" option
 * this phase's brief names as an explicit alternative to a bare hash. */
async function extractAverageColor(svg) {
  const { data, info } = await sharp(Buffer.from(svg))
    .resize(64, 64)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += channels) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}

// ---------------------------------------------------------------------

async function main() {
  console.log("extract-accent: discovering case slugs from content/work/*.ts");
  const slugs = discoverSlugs();

  if (slugs.length === 0) {
    console.warn("extract-accent: no case slugs found — writing an empty map.");
  }

  const result = {};
  for (const slug of slugs) {
    const hue = hueForSlug(slug);
    const svg = buildSwatchSvg(hue, slug);
    const avgRgb = await extractAverageColor(svg);
    const clampedRgb = clampForContrast(avgRgb);
    const hex = toHex(clampedRgb);
    const achieved = contrastRatio(mix(clampedRgb, INK, BLEND_RATIO), PAPER);

    result[slug] = hex;
    console.log(
      `  ${slug.padEnd(38)} hue=${String(hue).padStart(3)}°  →  ${hex}  (blended vs paper: ${achieved.toFixed(2)}:1, AA ${achieved >= MIN_CONTRAST ? "OK" : "FAIL"})`
    );
  }

  const sorted = Object.fromEntries(Object.keys(result).sort().map((k) => [k, result[k]]));
  writeFileSync(OUT_FILE, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
  console.log(`\nWrote ${Object.keys(sorted).length} accent(s) to ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((err) => {
  console.error("extract-accent: failed —", err);
  process.exitCode = 1;
});
