"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

/**
 * Competition-pass addition: the v3 spec calls for "a brief Republic Blue
 * wipe, 500ms max" on route change — never built in any prior phase (grepped
 * DECISIONS.md and every component for it; only the Preloader's one-time
 * session-gated bracket-flash existed, which is a different mechanism for a
 * different moment). This is a genuinely small, contained addition: a single
 * `motion.div` overlay, mounted once in the root layout, that plays a scaleY
 * sweep down-then-away whenever `usePathname()` changes (not on first
 * mount/load — only real navigations).
 *
 * Deliberately NOT a Framer Motion route-content cross-fade (no
 * `<AnimatePresence>` around `{children}` itself) — this app's pages are
 * server components with real data fetching per route; wrapping them in an
 * exit/enter animation risks a visible flash-of-stale-content between the
 * old and new route's server-rendered HTML. A `fixed`, `pointer-events-none`
 * overlay above everything sidesteps that risk entirely: it doesn't care
 * what's mounted beneath it, it just briefly obscures the transition.
 *
 * `transform`-only (`scaleY`, `transform-origin: top`), per §4.6's forbidden-
 * list (no layout-thrashing properties animated). No GSAP, no scroll-tie —
 * a plain Motion keyframe tween, gated on `usePrefersReducedMotion()` from
 * `@/lib/reducedMotion` per this codebase's established convention for any
 * reactive/structural reduced-motion branch beyond a `<motion.*>` component's
 * own transition (see DECISIONS.md's v3 Phase A section on that convention).
 * Under reduced motion the wipe never mounts at all — the route change still
 * happens instantly, just with no full-bleed colour flash, which is the
 * correct "remove the animation, not the underlying reachability" reading.
 */
const ENTER_MS = 180;
const HOLD_MS = 140;
// Asserted at module load, same pattern Preloader.tsx uses for its own
// ≤1.2s budget — a future tuning change that blows the spec's 500ms
// ceiling fails the build instead of silently shipping a slower wipe.
if (ENTER_MS * 2 + HOLD_MS > 500) {
  throw new Error("PageTransition total duration exceeds the 500ms spec ceiling");
}

export default function PageTransition() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const isFirstRender = useRef(true);
  // Mirrored into a ref (rather than a useEffect dependency) so the route-
  // change effect below only ever re-runs on a real pathname change, never
  // on a mid-session OS reduced-motion toggle — the ref always reads the
  // latest value without needing to be a dependency.
  const reducedRef = useRef(reduced);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      // Never wipe on initial page load — only on a genuine client-side
      // route change after the app is already up. The Preloader already
      // owns the "first visit this session" moment.
      isFirstRender.current = false;
      return;
    }
    if (reducedRef.current) return;
    // Deferred one tick, same pattern Preloader.tsx/LagosClock.tsx already
    // use elsewhere in this codebase (see DECISIONS.md) — satisfies
    // eslint-plugin-react-hooks' set-state-in-effect rule, which correctly
    // flags a synchronous setState call in an effect body as the wrong tool.
    //
    // Total budget: ENTER_MS to sweep in + HOLD_MS held + EXIT_MS to sweep
    // back out via AnimatePresence's own exit transition below — kept well
    // under the spec's 500ms ceiling (180 + 140 + 180 = 500ms exactly, and
    // the two transitions don't stack serially in the way a naive first
    // draft of this component did — see DECISIONS.md for that finding).
    const showTimeout = setTimeout(() => setWiping(true), 0);
    const hideTimeout = setTimeout(() => setWiping(false), ENTER_MS + HOLD_MS);
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {wiping && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[200] bg-republic"
          style={{ transformOrigin: "top" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: ENTER_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
