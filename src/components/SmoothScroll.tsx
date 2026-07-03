"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/reducedMotion";

/**
 * v3: Lenis for smooth-scroll *feel* only. GSAP/ScrollTrigger are gone
 * from this codebase entirely (§10 forbidden list — no pinning, no
 * scroll-scrubbing, no scroll-jacking, anywhere, at any breakpoint) — see
 * DECISIONS.md's v3 Phase A section for the removal note and what used to
 * live here (the "GSAP ticker drives Lenis" wiring, `ScrollTrigger.
 * refresh()` on route change, etc.). None of that infrastructure is
 * needed any more: nothing in v3 pins or scrubs against scroll position,
 * so Lenis only needs to smooth the browser's own scroll — it drives
 * itself via its own `requestAnimationFrame` loop (`autoRaf: true`, the
 * default) rather than being driven by an external ticker.
 *
 * Reduced motion: skipped entirely — no Lenis instance is created, so
 * scrolling stays native and instant, exactly as before.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.1 });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
