"use client";

import { motion, type Variants } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

/**
 * §4.7.2 — nav character-hover reveal. Splits `text` into individual
 * character spans on mount; hovering (or keyboard-focusing) the parent
 * triggers a brief vertical roll stagger across the characters, a few ms
 * offset per character, rather than a simple underline.
 *
 * Implementation: a single `motion.span` wrapper carries `whileHover`/
 * `whileFocus` variant state; each character is its own `motion.span`
 * child sharing the same variants object, so Motion's own orchestration
 * (`staggerChildren` on the parent's "hover" variant) staggers each
 * character's transition start without any manual per-character
 * setTimeout bookkeeping. The roll itself is a small `y` + `rotateX`
 * excursion and back — `transform`-only, per §4.6's animation rule.
 *
 * Reduced motion: per spec, "instant colour-only hover state, no
 * character animation" — this component doesn't even split the string or
 * mount per-character motion nodes in that branch, it renders plain text.
 * The colour/contrast change on hover still happens because every caller
 * wraps this in `<MixBlendHover>`, whose own hover block-scale is a plain
 * CSS transform transition already collapsed to ~0ms sitewide under
 * `prefers-reduced-motion` (see globals.css) — so "instant colour-only"
 * falls out of the existing mechanism for free, this component just needs
 * to stay out of the way of it.
 *
 * Uses `usePrefersReducedMotion` from `@/lib/reducedMotion` rather than
 * `motion/react`'s own `useReducedMotion`, matching the convention
 * established by Reveal.tsx/Preloader.tsx elsewhere in this codebase
 * (avoids a documented SSR/hydration mismatch — see Reveal.tsx's comment
 * for the full explanation) even though this component's transitions are
 * all `<motion.*>` — the hydration-safety reason outweighs the more
 * narrowly-scoped "which hook for which library" rule of thumb.
 */
const containerVariants: Variants = {
  rest: {},
  active: {
    transition: { staggerChildren: 0.018 },
  },
};

const charVariants: Variants = {
  rest: { y: 0, rotateX: 0 },
  active: {
    y: [0, -3, 0],
    rotateX: [0, 24, 0],
    transition: { duration: 0.34, ease: [0.65, 0, 0.35, 1] },
  },
};

export default function CharHoverLink({ text, className }: { text: string; className?: string }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const chars = Array.from(text);

  return (
    <motion.span
      initial="rest"
      whileHover="active"
      whileFocus="active"
      variants={containerVariants}
      className={className}
      style={{ display: "inline-flex" }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          aria-hidden="true"
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </motion.span>
  );
}
