"use client";

import { useEffect } from "react";
import { computeAndApplyGrid, measureCharWidthRatio } from "@/lib/grid-engine";

const RESIZE_DEBOUNCE_MS = 120;

/**
 * §4.5 — mounted once in the root layout, alongside SmoothScroll/
 * Preloader. Two jobs, both client-only:
 *
 *   1. On mount, measure Space Mono's real rendered character width
 *      (measureCharWidthRatio) and recompute/re-apply the grid metrics
 *      with that real ratio — replacing the FALLBACK_CHAR_WIDTH_RATIO
 *      value the blocking boot script (see layout.tsx's <head>) already
 *      applied synchronously before first paint. This is a same-tick,
 *      imperceptible refinement, not a visible jump: the boot script
 *      already prevented FOUC by setting *something* sane immediately;
 *      this just makes the numbers exact.
 *   2. Recompute on resize (debounced) and orientationchange, per §4.5.
 *
 * Deliberately does nothing on the server and returns null — this
 * component has no visual output, it only ever touches
 * document.documentElement.style as a side effect.
 */
export default function GridEngineClient() {
  useEffect(() => {
    const ratio = measureCharWidthRatio();
    computeAndApplyGrid(window.innerWidth, ratio);

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    const recompute = () => computeAndApplyGrid(window.innerWidth, ratio);

    const onResize = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(recompute, RESIZE_DEBOUNCE_MS);
    };

    // orientationchange fires immediately on rotate, ahead of the resize
    // event on some mobile browsers — recompute right away rather than
    // waiting out the debounce so the grid doesn't briefly show stale
    // portrait/landscape numbers.
    const onOrientationChange = () => recompute();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, []);

  return null;
}
