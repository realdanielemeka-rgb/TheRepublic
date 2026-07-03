// Deterministic, seed-driven "scene" composition for <ScenePlaceholder>.
//
// Why this exists: the sandbox this site is built in has no reachable
// image CDN and no image-generation tool (see DECISIONS.md), so every
// media slot in a case study renders a procedural flat-geometric SVG
// scene instead of a photo. This module is the pure generation layer —
// no React/DOM — so the same shape logic is easy to reason about/test in
// isolation and is deliberately kept independent of the component that
// paints it.
//
// Every colour is one of the five §4.1 tokens, referenced as CSS custom
// properties so a rendered scene still respects the palette even once
// grayscale(0) reveals it on hover/focus/scroll-active: Republic Blue,
// Republic Press, ink, paper, smoke. No gradients, no drop-shadows — flat
// colour only, matching §4.1's "no gradients/glassmorphism/shadow-as-
// decoration" rule. (scripts/extract-accent.mjs, which also renders a
// small procedural swatch to sample with sharp, follows the same rule.)

export const VIEW_W = 400;
export const VIEW_H = 300;

export const SCENE_CATEGORIES = [
  "beverage",
  "wellbeing",
  "civic-journey",
  "household",
  "family",
  "finance-growth",
  "insurance",
  "launch",
  "culture",
  "generic",
] as const;

export type SceneCategory = (typeof SCENE_CATEGORIES)[number];

export type SceneShape =
  | {
      el: "circle";
      cx: number;
      cy: number;
      r: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      opacity?: number;
    }
  | {
      el: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      fill: string;
      opacity?: number;
    }
  | {
      el: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      stroke: string;
      strokeWidth?: number;
      opacity?: number;
    }
  | {
      el: "polyline";
      points: string;
      stroke: string;
      strokeWidth?: number;
      opacity?: number;
      fill?: string;
    };

const REPUBLIC = "var(--color-republic)";
const REPUBLIC_PRESS = "var(--color-republic-press)";
const PAPER = "var(--color-paper)";
const SMOKE = "var(--color-smoke)";
const INK = "var(--color-ink)";

/** The only five colours any generated scene is allowed to use — keeps
 * forbidden-colour compliance trivial even once grayscale(0) reveals the
 * underlying fills. */
const PALETTE = [REPUBLIC, REPUBLIC_PRESS, INK, PAPER, SMOKE] as const;

// ---- deterministic seeding -------------------------------------------
// A seeded PRNG, not Math.random(): the same category+seed must render
// identical markup on the server and on the client, or React will throw
// a hydration mismatch. Quality doesn't need to be cryptographic, just
// stable and reasonably well distributed.

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed: string): () => number {
  return mulberry32(hashString(seed) || 1);
}

/** Exposed so callers (e.g. the component, needing a stable DOM id for
 * per-instance SVG filters) can derive their own deterministic ids from
 * the same seed without re-implementing the hash. */
export { hashString };

function range(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

// ---- motif generators --------------------------------------------------
// Each takes a seeded rng + the fixed viewBox and returns flat shape
// descriptors, suggestive (not literal) of the case's real-world domain —
// e.g. abstract market-stall shapes for a beverage case, a crowd-of-dots
// motif for a culture case, radiating lines for an insurance/finance
// case. Grouped into six implementations shared across ten named
// categories via the registry below.

function marketStall(rng: () => number): SceneShape[] {
  const shapes: SceneShape[] = [];
  const groundY = range(rng, 220, 245);
  shapes.push({
    el: "line",
    x1: 20,
    y1: groundY,
    x2: VIEW_W - 20,
    y2: groundY,
    stroke: SMOKE,
    strokeWidth: 1.5,
    opacity: 0.5,
  });

  const count = Math.round(range(rng, 4, 7));
  const spacing = (VIEW_W - 80) / count;
  for (let i = 0; i < count; i++) {
    const w = range(rng, 14, 26);
    const h = range(rng, 50, 130);
    const x = 40 + i * spacing + range(rng, -6, 6);
    const fill = pick(rng, [REPUBLIC, INK, SMOKE, REPUBLIC_PRESS] as const);
    shapes.push({ el: "rect", x, y: groundY - h, w, h, rx: w / 3, fill, opacity: range(rng, 0.7, 1) });
    if (rng() > 0.5) {
      const apex = groundY - h - range(rng, 18, 32);
      shapes.push({
        el: "polyline",
        points: `${x - 10},${groundY - h + 6} ${x + w / 2},${apex} ${x + w + 10},${groundY - h + 6}`,
        stroke: PAPER,
        strokeWidth: 1.5,
        opacity: 0.6,
      });
    }
  }
  return shapes;
}

function concentricArcs(rng: () => number): SceneShape[] {
  const shapes: SceneShape[] = [];
  const cx = range(rng, VIEW_W * 0.35, VIEW_W * 0.65);
  const cy = range(rng, VIEW_H * 0.35, VIEW_H * 0.65);
  const rings = Math.round(range(rng, 5, 8));
  for (let i = 0; i < rings; i++) {
    shapes.push({
      el: "circle",
      cx,
      cy,
      r: 14 + i * range(rng, 16, 24),
      fill: "none",
      stroke: i % 2 === 0 ? REPUBLIC : SMOKE,
      strokeWidth: 1.5,
      opacity: Math.max(0.12, 0.65 - i * 0.08),
    });
  }
  return shapes;
}

function routeLines(rng: () => number): SceneShape[] {
  const shapes: SceneShape[] = [];
  const hub = { x: range(rng, VIEW_W * 0.4, VIEW_W * 0.6), y: range(rng, VIEW_H * 0.55, VIEW_H * 0.8) };
  const count = Math.round(range(rng, 5, 8));
  for (let i = 0; i < count; i++) {
    const edge = { x: range(rng, 0, VIEW_W), y: range(rng, 0, VIEW_H * 0.4) };
    const stroke = pick(rng, [SMOKE, REPUBLIC, PAPER] as const);
    shapes.push({
      el: "line",
      x1: edge.x,
      y1: edge.y,
      x2: hub.x,
      y2: hub.y,
      stroke,
      strokeWidth: 1.25,
      opacity: range(rng, 0.35, 0.7),
    });
    if (rng() > 0.6) {
      const t = range(rng, 0.3, 0.7);
      shapes.push({
        el: "circle",
        cx: edge.x + (hub.x - edge.x) * t,
        cy: edge.y + (hub.y - edge.y) * t,
        r: 2.5,
        fill: REPUBLIC,
        opacity: 0.8,
      });
    }
  }
  shapes.push({ el: "circle", cx: hub.x, cy: hub.y, r: 5, fill: REPUBLIC_PRESS, opacity: 0.9 });
  return shapes;
}

function tileGrid(rng: () => number): SceneShape[] {
  const shapes: SceneShape[] = [];
  const cols = 8;
  const rows = 6;
  const pad = 18;
  const gap = 6;
  const cellW = (VIEW_W - pad * 2 - gap * (cols - 1)) / cols;
  const cellH = (VIEW_H - pad * 2 - gap * (rows - 1)) / rows;
  const highlightIndex = new Set<number>();
  const highlightCount = Math.round(range(rng, 2, 4));
  while (highlightIndex.size < highlightCount) {
    highlightIndex.add(Math.floor(rng() * cols * rows));
  }
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isHighlight = highlightIndex.has(idx);
      shapes.push({
        el: "rect",
        x: pad + c * (cellW + gap),
        y: pad + r * (cellH + gap),
        w: cellW,
        h: cellH,
        rx: 2,
        fill: isHighlight ? REPUBLIC : rng() > 0.5 ? SMOKE : PAPER,
        opacity: isHighlight ? 0.95 : range(rng, 0.15, 0.4),
      });
      idx++;
    }
  }
  return shapes;
}

function softBlobs(rng: () => number): SceneShape[] {
  const shapes: SceneShape[] = [];
  const count = Math.round(range(rng, 4, 6));
  for (let i = 0; i < count; i++) {
    shapes.push({
      el: "circle",
      cx: range(rng, VIEW_W * 0.2, VIEW_W * 0.8),
      cy: range(rng, VIEW_H * 0.25, VIEW_H * 0.75),
      r: range(rng, 30, 70),
      fill: pick(rng, [REPUBLIC, PAPER, SMOKE] as const),
      opacity: range(rng, 0.16, 0.34),
    });
  }
  return shapes;
}

function radiatingLines(rng: () => number, variant: "fan" | "ascend"): SceneShape[] {
  const shapes: SceneShape[] = [];
  if (variant === "fan") {
    const origin = { x: VIEW_W / 2, y: VIEW_H + 20 };
    const count = Math.round(range(rng, 9, 14));
    const spread = Math.PI * range(rng, 0.55, 0.75);
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = -Math.PI / 2 - spread / 2 + spread * t;
      const len = range(rng, 130, 210);
      shapes.push({
        el: "line",
        x1: origin.x,
        y1: origin.y,
        x2: origin.x + Math.cos(angle) * len,
        y2: origin.y + Math.sin(angle) * len,
        stroke: pick(rng, [REPUBLIC, PAPER, SMOKE] as const),
        strokeWidth: 1.25,
        opacity: range(rng, 0.35, 0.75),
      });
    }
    shapes.push({
      el: "circle",
      cx: origin.x,
      cy: VIEW_H - 30,
      r: 40,
      fill: "none",
      stroke: SMOKE,
      strokeWidth: 1,
      opacity: 0.4,
    });
  } else {
    const bars = Math.round(range(rng, 6, 9));
    const gap = 10;
    const w = (VIEW_W - 40 - gap * (bars - 1)) / bars;
    const pts: string[] = [];
    for (let i = 0; i < bars; i++) {
      const h = 30 + (i / (bars - 1)) * range(rng, 130, 170) + range(rng, -8, 8);
      shapes.push({
        el: "rect",
        x: 20 + i * (w + gap),
        y: VIEW_H - 30 - h,
        w,
        h,
        fill: i === bars - 1 ? REPUBLIC : SMOKE,
        opacity: i === bars - 1 ? 0.95 : range(rng, 0.3, 0.55),
      });
      pts.push(`${20 + i * (w + gap) + w / 2},${VIEW_H - 30 - h - 10}`);
    }
    shapes.push({ el: "polyline", points: pts.join(" "), stroke: REPUBLIC_PRESS, strokeWidth: 1.5, opacity: 0.6, fill: "none" });
  }
  return shapes;
}

function burstRays(rng: () => number): SceneShape[] {
  const shapes: SceneShape[] = [];
  const origin = { x: VIEW_W / 2, y: VIEW_H + 10 };
  const count = Math.round(range(rng, 10, 16));
  const spread = Math.PI * range(rng, 0.3, 0.42);
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angle = -Math.PI / 2 - spread / 2 + spread * t;
    const len = range(rng, 160, 260);
    shapes.push({
      el: "line",
      x1: origin.x,
      y1: origin.y,
      x2: origin.x + Math.cos(angle) * len,
      y2: origin.y + Math.sin(angle) * len,
      stroke: pick(rng, [REPUBLIC, PAPER] as const),
      strokeWidth: range(rng, 1, 2.5),
      opacity: range(rng, 0.3, 0.7),
    });
  }
  return shapes;
}

function crowdDots(rng: () => number): SceneShape[] {
  const shapes: SceneShape[] = [];
  const count = Math.round(range(rng, 40, 70));
  for (let i = 0; i < count; i++) {
    shapes.push({
      el: "circle",
      cx: range(rng, 10, VIEW_W - 10),
      cy: range(rng, 10, VIEW_H - 10),
      r: range(rng, 2, 6),
      fill: pick(rng, PALETTE),
      opacity: range(rng, 0.35, 0.85),
    });
  }
  return shapes;
}

// ---- category → generator registry -------------------------------------

const GENERATORS: Record<SceneCategory, (rng: () => number) => SceneShape[]> = {
  beverage: marketStall,
  wellbeing: concentricArcs,
  "civic-journey": routeLines,
  household: tileGrid,
  family: softBlobs,
  "finance-growth": (rng) => radiatingLines(rng, "ascend"),
  insurance: (rng) => radiatingLines(rng, "fan"),
  launch: burstRays,
  culture: crowdDots,
  generic: tileGrid,
};

export function generateScene(category: SceneCategory, seed: string): SceneShape[] {
  const rng = createRng(`${category}:${seed}`);
  const generator = GENERATORS[category] ?? tileGrid;
  return generator(rng);
}

// ---- src convention: "placeholder:<category>" --------------------------
// Media.src doesn't need to be a real file path while every asset is a
// placeholder — it just needs to be a string <CaseMedia> knows how to
// turn into a category. "placeholder:<category>" is that convention.

const PLACEHOLDER_PREFIX = "placeholder:";

export function placeholderSrc(category: SceneCategory): string {
  return `${PLACEHOLDER_PREFIX}${category}`;
}

export function isPlaceholderSrc(src: string): boolean {
  return src.startsWith(PLACEHOLDER_PREFIX);
}

export function categoryFromSrc(src: string): SceneCategory {
  const raw = src.startsWith(PLACEHOLDER_PREFIX) ? src.slice(PLACEHOLDER_PREFIX.length) : src;
  return (SCENE_CATEGORIES as readonly string[]).includes(raw) ? (raw as SceneCategory) : "generic";
}
