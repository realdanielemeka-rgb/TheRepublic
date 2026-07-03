"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires Lenis smooth scroll to GSAP's ScrollTrigger. This is the one
 * piece of infrastructure every pinned/scrubbed section in this codebase
 * depends on — get it wrong here and every Phase B pin will jitter or
 * desync, however correct that section's own ScrollTrigger config is.
 *
 * The failure mode this avoids: Lenis and ScrollTrigger each keep their
 * own idea of "current scroll position" and, left alone, update on
 * different clocks (Lenis smooths/lerps every animation frame; native
 * `scroll` events — which ScrollTrigger listens to by default — fire on
 * the browser's own throttled schedule). One frame of disagreement is
 * enough for a pinned element to visibly jitter. The fix is to make GSAP's
 * ticker the single clock driving both:
 *
 *   1. gsap.ticker drives lenis.raf() every tick (ticker time is in
 *      seconds; Lenis wants ms, hence `time * 1000`).
 *   2. gsap.ticker.lagSmoothing(0) — GSAP's default lag-smoothing tries to
 *      "catch up" after a long frame by skipping time, which would step
 *      Lenis and ScrollTrigger out of lockstep. Disabled so both clocks
 *      always agree on elapsed time.
 *   3. lenis.on('scroll', ScrollTrigger.update) — the moment Lenis moves
 *      the (real, native) scroll position, ScrollTrigger re-measures
 *      immediately rather than waiting for its own scroll listener.
 *
 * This is the standard documented Lenis+GSAP pattern and is sufficient
 * here because Lenis is scrolling the window/document (the default —
 * `new Lenis()` below passes no `wrapper`/`content`), which is exactly
 * what ScrollTrigger already measures by default. `ScrollTrigger.
 * scrollerProxy` is the *other* documented option, but it exists to
 * teach ScrollTrigger how to read/set scroll on a **custom, non-window
 * scroll container** — a need this site doesn't have. Reach for it only
 * if a future change moves Lenis onto a custom `wrapper`/`content` pair.
 *
 * Verified in isolation with a throwaway pinned+scrubbed test element
 * (Playwright screenshots at multiple scroll positions) before this file
 * was considered done — see DECISIONS.md ("Lenis + ScrollTrigger wiring").
 *
 * Reduced motion: entirely skipped when the OS preference is set — no
 * Lenis instance is created, so scrolling stays native. Every Phase B
 * pinned section must independently gate itself the same way (Lenis
 * being off here does not stop a component from creating a ScrollTrigger
 * pin) — see `src/lib/reducedMotion.ts` for the exact pattern to copy.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: false, // gsap.ticker drives raf() instead, see below
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // gsap.ticker's `time` is seconds since the ticker started; Lenis
      // wants milliseconds.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  // Client-side navigations don't reload the page, so a ScrollTrigger
  // measured against one page's layout can go stale the instant the next
  // page (different content height) mounts. Refresh on every route
  // change so Phase B's pinned sections re-measure against the new DOM
  // rather than the previous page's cached start/end positions. Harmless
  // no-op when nothing is pinned yet.
  const pathname = usePathname();
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
