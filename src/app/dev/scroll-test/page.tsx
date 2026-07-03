"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/reducedMotion";

/**
 * Minimal reference implementation for "does the Lenis + ScrollTrigger
 * wiring in SmoothScroll.tsx actually produce smooth, non-jittery
 * scroll-linked pinning" — a pin that holds for 100vh while a box scales
 * 1 → 1.5, scrubbed to scroll position. This is the pattern Phase B
 * should copy for the real pinned sections (work strip, etc.):
 *
 *   1. Gate the whole effect on prefersReducedMotion() — reduced motion
 *      means no pin, no scrub, full stop, not a reduced version of it.
 *   2. Do all GSAP/ScrollTrigger setup inside gsap.context() scoped to
 *      this component, and call ctx.revert() on cleanup — this kills the
 *      ScrollTrigger *and* the tween together, so nothing leaks across
 *      route changes.
 *   3. Don't fight SmoothScroll.tsx: it already registers ScrollTrigger
 *      and drives Lenis via gsap.ticker — a section component only needs
 *      to create its own ScrollTrigger, never its own Lenis instance or
 *      its own rAF loop.
 *
 * Verified with Playwright screenshots at several scroll positions — see
 * DECISIONS.md. Kept as a permanent (dev-only, see ../layout.tsx) visual
 * reference rather than deleted; not linked from the public site.
 */
export default function DevScrollTestPage() {
  const pinRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: true,
        animation: gsap.to(boxRef.current, { scale: 1.5, ease: "none" }),
        onUpdate: (self) => setProgress(self.progress),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative">
      <div
        data-testid="scroll-test-hud"
        className="fixed right-4 top-4 z-50 rounded-full bg-ink px-4 py-2 text-paper"
      >
        <p className="mono-label">
          progress: <span data-testid="scroll-test-progress">{progress.toFixed(2)}</span> · reduced-motion:{" "}
          {String(reduced)}
        </p>
      </div>

      <section className="flex h-screen flex-col items-center justify-center bg-paper text-ink">
        <p className="display-type text-3xl">BEFORE PIN</p>
        <p className="measure mt-4 text-center text-smoke">Scroll down — the box below should pin for 100vh and scale up.</p>
      </section>

      <section ref={pinRef} className="flex h-screen items-center justify-center bg-ink text-paper">
        <div
          ref={boxRef}
          data-testid="scroll-test-box"
          className="flex h-40 w-40 items-center justify-center rounded-[var(--radius-card)] bg-republic"
        >
          <span className="mono-label">SCALE 1→1.5</span>
        </div>
      </section>

      <section className="flex h-screen flex-col items-center justify-center bg-paper text-ink">
        <p className="display-type text-3xl">AFTER PIN</p>
        <p className="measure mt-4 text-center text-smoke">If this appeared with no jitter and the box visibly grew, the wiring works.</p>
      </section>
    </div>
  );
}
