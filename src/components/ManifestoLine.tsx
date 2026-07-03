"use client";

import { motion } from "motion/react";
import Bracket from "./Bracket";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

const WORDS = ["MOST", "MARKETING", "MAKES", "VIEWERS.", "WE", "MAKE"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

/** §6.1 Row 2 — the homepage's single manifesto line: huge Space Mono,
 * word-by-word `whileInView` stagger (motion, not GSAP — see
 * DECISIONS.md's v3 Phase A section on why GSAP/ScrollTrigger is gone
 * outright), with the existing `<Bracket>` device wrapping "CITIZENS" for
 * the bracket-fill treatment. Reuses `<Bracket>` directly rather than
 * `<BracketFill>` (the hero's mount-once typing effect from the old
 * homepage) since this word is arriving as part of the same scroll-
 * triggered stagger as every other word, not typing in on a timer after
 * mount — a different trigger, so a different (simpler) component. */
export default function ManifestoLine() {
  const reduced = usePrefersReducedMotion();

  const wordVariant = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
  };
  const transition = { duration: reduced ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.p
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={container}
      className="display-type flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[clamp(2.5rem,7vw,7rem)] leading-[1.05]"
    >
      {WORDS.map((word) => (
        <motion.span key={word} variants={wordVariant} transition={transition}>
          {word}
        </motion.span>
      ))}
      <motion.span variants={wordVariant} transition={transition}>
        <Bracket>CITIZENS</Bracket>.
      </motion.span>
    </motion.p>
  );
}
