"use client";

import { useSyncExternalStore } from "react";
import { pickColumnCount } from "./grid-engine";

/**
 * Reactive read of the grid engine's live `--grid-cols` value (§4.5),
 * for any component that needs the *actual current column count* as a
 * number — not just to set it as a CSS custom property, but to compute a
 * proportional `grid-column: span N` (e.g. "half width" = half of
 * whatever `--grid-cols` currently is). This is what src/components/
 * WorkGrid.tsx uses to size its half/quarter-width cells.
 *
 * GridEngineClient (mounted once in the root layout) is the sole writer
 * of `--grid-cols` — this hook only reads it, via `useSyncExternalStore`
 * so it re-renders when the value changes on resize/orientationchange,
 * without duplicating GridEngineClient's own debounce/measurement logic.
 * SSR-safe: `getServerSnapshot` returns `pickColumnCount` at a desktop
 * reference width, matching the same "sane non-degenerate default before
 * JS runs" spirit as the no-JS static grid fallback in globals.css (which
 * separately guarantees a working *CSS* grid with zero script
 * involvement — this hook's job is only to give React components inside
 * that grid a matching *number* to compute spans from).
 */
function readCols(): number {
  if (typeof document === "undefined") return 12;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--grid-cols").trim();
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
}

// GridEngineClient debounces its own resize handler by 120ms before it
// writes the new --grid-cols value (RESIZE_DEBOUNCE_MS, grid-engine.ts /
// GridEngineClient.tsx) — this hook's own delay must be strictly longer,
// or it would re-read the CSS custom property before GridEngineClient has
// finished updating it and go stale until the next resize event.
const READ_DELAY_MS = 180;

function subscribe(callback: () => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const onChange = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(callback, READ_DELAY_MS);
  };
  window.addEventListener("resize", onChange);
  window.addEventListener("orientationchange", onChange);
  return () => {
    if (timer) clearTimeout(timer);
    window.removeEventListener("resize", onChange);
    window.removeEventListener("orientationchange", onChange);
  };
}

export function useGridCols(): number {
  return useSyncExternalStore(subscribe, readCols, () => pickColumnCount(1440));
}
