"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SESSION_KEY = "republic-preloader-seen";

/** Two brackets slide apart to reveal the wordmark, once per session,
 * ≤1.2s. Skipped entirely under prefers-reduced-motion. */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    const show = setTimeout(() => setVisible(true), 0);
    const hide = setTimeout(() => setVisible(false), 1100);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          aria-hidden="true"
        >
          <div className="flex items-center gap-4 overflow-hidden">
            <motion.span
              className="display-type text-6xl text-paper"
              initial={{ x: 24 }}
              animate={{ x: -8 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              [
            </motion.span>
            <motion.span
              className="display-type text-2xl text-paper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              THE REPUBLIC
            </motion.span>
            <motion.span
              className="display-type text-6xl text-paper"
              initial={{ x: -24 }}
              animate={{ x: 8 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              ]
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
