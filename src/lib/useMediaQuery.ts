"use client";

import { useSyncExternalStore } from "react";

/**
 * Generic, SSR-safe media-query hook — same useSyncExternalStore pattern as
 * usePrefersReducedMotion() in reducedMotion.ts (see that file's comment for
 * why useSyncExternalStore rather than useState+useEffect: it's the
 * primitive React ships for subscribing to external, mutable, non-React
 * state like a MediaQueryList without an SSR/hydration mismatch).
 *
 * Deliberately separate from reducedMotion.ts rather than generalising that
 * module to take an arbitrary query — reducedMotion.ts stays a single-
 * purpose, unambiguous import for the one query this codebase gates GSAP/
 * Lenis work on; this hook is for structural breakpoint decisions instead
 * (e.g. §4.5's hard "no pin/scroll-jacking below 768px" rule, which needs a
 * component to decide *which system to mount at all*, not just how to
 * animate it).
 *
 * `getServerSnapshot` returns `false` (i.e. assumes the query does NOT
 * match) — for the one caller today (WorkStrip's `(min-width: 768px)`
 * check) that means SSR/first paint assumes the narrower, simpler,
 * non-pinned variant, then upgrades to the pinned desktop version once the
 * client confirms a wide viewport. That's a deliberate progressive-
 * enhancement default: it's safer to briefly under-promise (render the
 * plain carousel) than to SSR a 250vh GSAP-pinned layout that hasn't been
 * confirmed to match the real viewport yet.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
