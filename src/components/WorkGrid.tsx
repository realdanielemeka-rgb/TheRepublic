"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { useGridCols } from "@/lib/useGridCols";
import { computeSpans } from "@/lib/gridSpans";

/**
 * §4.5/§6.1 — reusable pieces of the flowing asymmetric grid. Genuinely
 * generic (no homepage-specific content, copy, or row sequencing lives
 * here): `<GridRow fractions={[0.5, 0.25, 0.25]}>` lays out whatever
 * children you give it, in that exact width proportion, on the live
 * `repeat(var(--grid-cols), 1fr)` track, with a `whileInView` fade+
 * translateY stagger across the row's own items. `src/app/page.tsx`'s
 * specific row-by-row sequence (§6.1's exact structure) is homepage
 * content, not part of this file — Phase C's Work index page (§6.2) can
 * import `<GridRow>`/`<GridCell>` directly for its own layout rather than
 * rebuilding the span-math/stagger mechanism.
 */

const STAGGER_S = 0.04; // ~40ms per item within a row, per §6.1

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER_S } },
};

function itemVariants(reduced: boolean) {
  return {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 12 },
    show: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
  };
}

export function GridRow({
  fractions,
  children,
  className,
  gap,
}: {
  /** Width proportions, one per child, e.g. [0.5, 0.5] or [0.5, 0.25, 0.25].
   * Don't need to sum to exactly 1 — computeSpans normalises against the
   * live column count either way — but should reflect the intended ratio. */
  fractions: number[];
  children: ReactNode[];
  className?: string;
  /** Overrides the default `var(--grid-gutter)` row gap. */
  gap?: string;
}) {
  const cols = useGridCols();
  const reduced = usePrefersReducedMotion();
  const spans = computeSpans(cols, fractions);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={containerVariants}
      className={className}
      style={{
        display: "grid",
        // minmax(0, 1fr) rather than a bare 1fr: an `fr` track's implicit
        // minimum is `auto` (its content's min-width), so a row that packs
        // several cells against the large `--grid-gutter` at a narrow
        // viewport would otherwise refuse to shrink below the widest cell's
        // content and blow the grid past its container (real horizontal
        // overflow, caught by this phase's audit on /work and /journal).
        // minmax(0, …) lets tracks shrink to fit; content clamps via
        // line-clamp inside each cell.
        gridTemplateColumns: "repeat(var(--grid-cols), minmax(0, 1fr))",
        gap: gap ?? "var(--grid-gutter)",
      }}
    >
      {children.map((child, i) => (
        <GridCell key={i} span={spans[i] ?? 1} reduced={reduced}>
          {child}
        </GridCell>
      ))}
    </motion.div>
  );
}

export function GridCell({
  span,
  children,
  className,
  reduced,
}: {
  span: number;
  children: ReactNode;
  className?: string;
  /** Pass through from a parent that already computed reduced-motion
   * state (GridRow does) to avoid re-subscribing per cell; falls back to
   * its own read if used standalone. */
  reduced?: boolean;
}) {
  const ownReduced = usePrefersReducedMotion();
  const isReduced = reduced ?? ownReduced;

  return (
    <motion.div
      variants={itemVariants(isReduced)}
      transition={{ duration: isReduced ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ gridColumn: `span ${Math.max(1, Math.round(span))}`, minWidth: 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
