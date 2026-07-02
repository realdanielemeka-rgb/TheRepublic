"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Bracket from "./Bracket";

/** Hero headline device: WE MAKE [ ] renders empty for a beat, then types
 * the given word into the bracket. Runs once on mount. */
export default function BracketFill({
  word,
  className,
}: {
  word: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setFilled(true), 650);
    return () => clearTimeout(t);
  }, [reduced]);

  const show = Boolean(reduced) || filled;

  return (
    <Bracket className={className}>
      <motion.span
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {show ? word : ""}
      </motion.span>
    </Bracket>
  );
}
