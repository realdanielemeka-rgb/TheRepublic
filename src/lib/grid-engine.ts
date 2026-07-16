/**
 * §4.5 — the fluid grid engine. One base unit — `ch`, a character width in
 * pixels — drives everything else (column count, mono label font size,
 * line height, letter spacing, gutter). This module is plain, framework-
 * free TS so its core math can be (a) imported by `GridEngineClient.tsx`
 * for the real, font-measured, resize-reactive client mount, and (b)
 * mirrored — deliberately, not automatically shared — by
 * `GRID_ENGINE_BOOT_SCRIPT` below, a standalone string injected as a
 * blocking `<script>` in the root layout's `<head>` (see layout.tsx) so
 * the grid variables exist on `<html>` *before first paint*, exactly like
 * a dark-mode-flash-prevention script. A blocking pre-paint script can't
 * `import` a module — it has to be a self-contained string — so the boot
 * script's math is hand-copied from `computeGridMetrics` below rather
 * than generated from it. Keep the two in sync if the formula changes;
 * `computeGridMetrics`'s own inline comments are the single source of
 * truth for *why* each constant is what it is.
 *
 * No-JS / reduced-data baseline: `src/app/globals.css` ships a plain
 * `@media (min-width: …)` static fallback for every one of these custom
 * properties on `:root`, so a page with JS disabled entirely (the boot
 * script never runs) still gets a sane, readable, non-degenerate grid —
 * see the "grid engine — no-JS fallback" block in that file. Both the
 * boot script and `GridEngineClient`'s post-mount pass simply overwrite
 * those static values once they run.
 */

export type GridBand = "mobile" | "desktop";

export interface GridMetrics {
  /** Column count for the current band. Unitless — consumed as
   * `grid-template-columns: repeat(var(--grid-cols), 1fr)`. */
  cols: number;
  /** The base unit itself, in px. Exposed mainly for debugging/tests —
   * not itself a published CSS custom property (§4.5 only lists
   * cols/font-size/line-height/letter-spacing/gutter), but every one of
   * those is a pure function of this value. */
  ch: number;
  /** Mono label/eyebrow font size, px. Body Inter text is NOT driven by
   * this — it stays on its own independent fluid type scale per §4.5. */
  fontSize: number;
  /** ~2× ch, per §4.5, expressed in px. */
  lineHeight: number;
  /** Small function of ch, px. Tightens (shrinks, can go negative) as the
   * grid densifies — i.e. as viewport width and column count increase. */
  letterSpacing: number;
  /** Remaining horizontal space per gutter once `cols × ch` is
   * subtracted from the viewport, split evenly across `cols + 1` gaps
   * (inner gutters + the two outer margins). Clamped to >= 0 — this can
   * never go negative regardless of input, per §4.5's sanity bar. */
  gutter: number;
  band: GridBand;
}

const MOBILE_BREAKPOINT = 769; // px — matches WorkStrip/useMediaQuery's existing 768px convention (< 769 = mobile band)

const MOBILE_MIN_COLS = 6;
const MOBILE_MAX_COLS = 8;
const DESKTOP_MIN_COLS = 12;
const DESKTOP_MAX_COLS = 16;

// How many "ch" widths of visual weight a single column is budgeted to
// hold. Larger => smaller ch for a given width/cols pair. Tuned (not
// guessed) by solving backwards from the target 10-20px mono font-size
// band at Republic's five reference viewports (360/768/1024/1440/1920) —
// see the worked table in DECISIONS.md's v3 Phase A section.
const COLUMN_CHAR_BUDGET = 10;

// Absolute safety clamps — protect against degenerate viewport widths
// (e.g. a 0px or 6000px iframe) without changing the numbers at any real
// device size. Real breakpoints never hit these; they're a floor/ceiling,
// not a tuning knob.
const CH_MIN = 5;
const CH_MAX = 30;
const FONT_MIN = 10;
const FONT_MAX = 20;

// Fallback "how many px wide is one Space Mono character per 1px of
// font-size" ratio — used only until the real font can be measured
// client-side (measureCharWidthRatio below). 0.6 is the standard
// average-advance-width-to-em-size ratio for a monospace typeface; it's
// what the pre-paint boot script uses (it can't reliably assume the
// self-hosted Space Mono file has finished loading yet), and it's also
// GridEngineClient's *initial* render value before its own effect
// replaces it with the measured ratio a moment later — this two-step
// (fallback now, measured shortly after) is what avoids FOUC while still
// honouring §4.5's "measure this against the real font, don't guess a
// constant" instruction for the value that actually matters.
export const FALLBACK_CHAR_WIDTH_RATIO = 0.6;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Target column count for the current band, per §4.5's 6-8 (mobile) /
 * 12-16 (desktop) ranges — monotonic within each band, clamped at the
 * edges so it can never fall outside the target range regardless of how
 * small/large `width` is. */
export function pickColumnCount(width: number): number {
  if (width < MOBILE_BREAKPOINT) {
    const cols = MOBILE_MIN_COLS + Math.round((width - 320) / 150);
    return clamp(cols, MOBILE_MIN_COLS, MOBILE_MAX_COLS);
  }
  const cols = DESKTOP_MIN_COLS + Math.round((width - MOBILE_BREAKPOINT) / 300);
  return clamp(cols, DESKTOP_MIN_COLS, DESKTOP_MAX_COLS);
}

/** The single computation every published CSS custom property derives
 * from. `charWidthRatio` is Space Mono's real measured per-px-of-font-
 * size character advance width (see measureCharWidthRatio) — pass
 * FALLBACK_CHAR_WIDTH_RATIO if it isn't available yet (SSR, pre-paint). */
export function computeGridMetrics(width: number, charWidthRatio: number = FALLBACK_CHAR_WIDTH_RATIO): GridMetrics {
  const band: GridBand = width < MOBILE_BREAKPOINT ? "mobile" : "desktop";
  const cols = pickColumnCount(width);

  // One base unit: the px width a single character would occupy if the
  // full viewport were divided evenly across `cols` columns, each
  // budgeted for COLUMN_CHAR_BUDGET characters of visual weight.
  const ch = clamp(width / (cols * COLUMN_CHAR_BUDGET), CH_MIN, CH_MAX);

  // Mono label font size is ch expressed back through the real (or
  // fallback) character-width ratio — i.e. "what font size would render
  // a character at exactly `ch` px wide."
  const fontSize = clamp(ch / charWidthRatio, FONT_MIN, FONT_MAX);
  const lineHeight = ch * 2; // §4.5: ~2×ch

  // Tracking tightens as the grid densifies (more columns => smaller
  // gaps => characters should sit closer together at the top of the
  // desktop band than at the bottom of the mobile band).
  const letterSpacing = 1.6 - cols * 0.08;

  const usedWidth = cols * ch;
  const gutter = clamp((width - usedWidth) / (cols + 1), 0, width);

  return { cols, ch, fontSize, lineHeight, letterSpacing, gutter, band };
}

const TEST_STRING_LENGTH = 100;
let cachedCharWidthRatio: number | null = null;

/** Measures Space Mono's actual rendered character advance width, per
 * §4.5's explicit instruction ("measure this against the real font's
 * actual rendered advance width... don't guess a constant"). Renders a
 * hidden, off-screen test string of known character count at a large
 * reference font-size (100px, for measurement precision) using the same
 * `--font-mono` stack the rest of the site uses, then divides the
 * measured pixel width by (character count × reference font size) to get
 * a ratio usable at any font size. Cached after the first successful
 * measurement (the font's metrics don't change mid-session) and re-used
 * on every subsequent resize. SSR-safe: returns the fallback ratio when
 * there's no `document`. */
export function measureCharWidthRatio(): number {
  if (cachedCharWidthRatio !== null) return cachedCharWidthRatio;
  if (typeof document === "undefined") return FALLBACK_CHAR_WIDTH_RATIO;

  const REFERENCE_FONT_SIZE = 100;
  const probe = document.createElement("span");
  probe.textContent = "0".repeat(TEST_STRING_LENGTH); // monospace: any repeated glyph has the same advance width
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.whiteSpace = "pre";
  probe.style.left = "-9999px";
  probe.style.top = "0";
  probe.style.fontFamily = "var(--font-mono), ui-monospace, monospace";
  probe.style.fontSize = `${REFERENCE_FONT_SIZE}px`;
  document.body.appendChild(probe);

  const measuredWidth = probe.getBoundingClientRect().width;
  document.body.removeChild(probe);

  if (!Number.isFinite(measuredWidth) || measuredWidth <= 0) {
    return FALLBACK_CHAR_WIDTH_RATIO;
  }

  const ratio = measuredWidth / TEST_STRING_LENGTH / REFERENCE_FONT_SIZE;
  cachedCharWidthRatio = ratio;
  return ratio;
}

const CSS_VAR_NAMES = {
  cols: "--grid-cols",
  fontSize: "--grid-font-size",
  lineHeight: "--grid-line-height",
  letterSpacing: "--grid-letter-spacing",
  gutter: "--grid-gutter",
} as const;

/** Writes a GridMetrics result onto `document.documentElement.style` —
 * the exact CSS custom property API Phase B's work-grid layouts consume:
 *
 *   --grid-cols            unitless integer, e.g. "12"
 *   --grid-font-size       px, e.g. "16px"
 *   --grid-line-height     px, e.g. "32px"
 *   --grid-letter-spacing  px, e.g. "0.48px" (can be negative)
 *   --grid-gutter          px, e.g. "64px"
 */
export function applyGridMetrics(metrics: GridMetrics): void {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  const style = el.style;
  style.setProperty(CSS_VAR_NAMES.cols, String(metrics.cols));
  style.setProperty(CSS_VAR_NAMES.fontSize, `${metrics.fontSize.toFixed(2)}px`);
  style.setProperty(CSS_VAR_NAMES.lineHeight, `${metrics.lineHeight.toFixed(2)}px`);
  style.setProperty(CSS_VAR_NAMES.letterSpacing, `${metrics.letterSpacing.toFixed(3)}px`);
  style.setProperty(CSS_VAR_NAMES.gutter, `${metrics.gutter.toFixed(2)}px`);
  el.setAttribute("data-grid-band", metrics.band);
}

/** Reference width used by both the fallback-ratio SSR pass and the boot
 * script's synchronous first paint, before `window.innerWidth` is read. */
export function computeAndApplyGrid(width: number, charWidthRatio?: number): GridMetrics {
  const metrics = computeGridMetrics(width, charWidthRatio);
  applyGridMetrics(metrics);
  return metrics;
}

/**
 * Standalone, self-contained boot script source — injected verbatim as a
 * blocking `<script>` in the root layout's `<head>` (see layout.tsx),
 * exactly like a dark-mode-flash-prevention script. Runs synchronously
 * during HTML parsing, before React hydrates and before first paint, so
 * `--grid-*` custom properties exist on `<html>` immediately rather than
 * flashing the static no-JS CSS fallback and then jumping. Uses the
 * FALLBACK_CHAR_WIDTH_RATIO (real-font measurement isn't reliable this
 * early) — GridEngineClient's mount effect replaces these values with the
 * real measured ones a moment later, imperceptibly.
 */
export const GRID_ENGINE_BOOT_SCRIPT = `(function(){try{
var w=window.innerWidth;
var mobile=w<769;
var cols=mobile?Math.min(8,Math.max(6,6+Math.round((w-320)/150))):Math.min(16,Math.max(12,12+Math.round((w-769)/300)));
var ch=Math.min(30,Math.max(5,w/(cols*10)));
var ratio=${FALLBACK_CHAR_WIDTH_RATIO};
var fontSize=Math.min(20,Math.max(10,ch/ratio));
var lineHeight=ch*2;
var letterSpacing=1.6-cols*0.08;
var used=cols*ch;
var gutter=Math.min(w,Math.max(0,(w-used)/(cols+1)));
var root=document.documentElement.style;
root.setProperty("--grid-cols",String(cols));
root.setProperty("--grid-font-size",fontSize.toFixed(2)+"px");
root.setProperty("--grid-line-height",lineHeight.toFixed(2)+"px");
root.setProperty("--grid-letter-spacing",letterSpacing.toFixed(3)+"px");
root.setProperty("--grid-gutter",gutter.toFixed(2)+"px");
document.documentElement.setAttribute("data-grid-band",mobile?"mobile":"desktop");
}catch(e){}})();`;
