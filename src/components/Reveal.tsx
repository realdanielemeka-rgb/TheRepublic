"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

/** Mask-reveal on enter: lines rise into view. Falls back to an
 * opacity-only fade under prefers-reduced-motion.
 *
 * Uses `usePrefersReducedMotion` from `@/lib/reducedMotion` rather than
 * `motion/react`'s own `useReducedMotion` — the latter reads
 * `window.matchMedia` synchronously during the client's first render
 * (see its source: `useState(prefersReducedMotion.current)` with no
 * SSR guard) instead of deferring to an effect, so on any page where the
 * browser/OS already has reduced-motion on, the client's first hydration
 * pass disagrees with the server-rendered (reduced=false, no window) HTML
 * — a real React #418 hydration mismatch, confirmed via a UI/UX audit.
 * `usePrefersReducedMotion` is built on `useSyncExternalStore` with a
 * `getServerSnapshot` that always returns `false`, which is the pattern
 * React documents specifically to avoid this class of bug. */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: reduced ? 0.4 : 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
