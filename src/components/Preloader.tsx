"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ScenePlaceholder from "./ScenePlaceholder";
import { categoryFromSrc, type SceneCategory } from "@/lib/scene/generator";
import type { Media } from "../../content/work/types";

const SESSION_KEY = "republic-preloader-seen";

// §4.6.1 timing budget — flash 12 frames, hold the wordmark, exit. Total is
// checked against the ≤1.2s spec ceiling below, not just eyeballed.
const FRAME_COUNT = 12;
const FRAME_INTERVAL_MS = 50; // 12 × 50ms = 600ms of flashing
const WORDMARK_HOLD_MS = 250;
const EXIT_MS = 300;
const TOTAL_MS = FRAME_COUNT * FRAME_INTERVAL_MS + WORDMARK_HOLD_MS + EXIT_MS; // 1150ms
if (TOTAL_MS > 1200) {
  throw new Error(`Preloader: sequence budget ${TOTAL_MS}ms exceeds the §4.6.1 ≤1200ms ceiling.`);
}

// Reduced motion: a single opacity fade, no flash-cut, no bracket slide.
const REDUCED_HOLD_MS = 250;
const REDUCED_EXIT_MS = 350; // under the ≤400ms reduced-motion fade budget

/** Content-agnostic fallback categories — used whenever fewer than
 * FRAME_COUNT real media items are supplied (true today: every seed case
 * is still pending-approval, so `getFeaturedMedia()` returns `[]`; see
 * DECISIONS.md). Deliberately not sourced from content/work directly in
 * this file — see the prop doc below for why. */
const FALLBACK_CATEGORIES: SceneCategory[] = [
  "beverage",
  "wellbeing",
  "civic-journey",
  "household",
  "family",
  "finance-growth",
  "insurance",
  "launch",
  "culture",
  "generic",
];

function buildFrameCategories(media: Media[]): SceneCategory[] {
  const real = media.map((m) => categoryFromSrc(m.type === "video" && m.poster ? m.poster : m.src));
  const source = real.length > 0 ? real : FALLBACK_CATEGORIES;
  return Array.from({ length: FRAME_COUNT }, (_, i) => source[i % source.length]);
}

type Phase = "flashing" | "wordmark" | "exit";

export interface PreloaderProps {
  /**
   * Real, sanctioned media to flash through — pass `getFeaturedMedia()`
   * from content/work (root layout.tsx does this). Deliberately *not*
   * imported by this file directly: Preloader is mounted once, globally,
   * in the root layout, so unlike a page-scoped section it ships on every
   * single route from first paint — routing it through the same sanctioned,
   * live-only accessor as everything else public (rather than reaching
   * into content/work's raw case array) keeps the "pending never renders
   * publicly" guarantee intact without this component needing to know the
   * rule exists.
   *
   * Each frame's *caption* is intentionally NOT the media's real `alt`
   * text, even for sanctioned/live entries — every frame instead shows a
   * fixed, neutral "Republic — loading" label. Two independent reasons,
   * either would be sufficient alone: (1) a ~50ms flash is not a caption-
   * reading moment — a real per-case alt string flickering past unreadably
   * 12 times is pure noise, not information; (2) this defends against the
   * common case where `frames` is empty and content-agnostic fallback
   * categories are substituted instead — those have no real alt text to
   * show anyway, so a single shared label keeps flashing and fallback
   * frames visually consistent rather than swapping caption *style*
   * mid-sequence depending on how many real frames happened to be
   * available that day.
   */
  frames?: Media[];
}

/**
 * §4.6.1 — bracket flash-reveal preloader. Cycles FRAME_COUNT placeholder
 * thumbnails inside the bracket window, lands on the wordmark, then the
 * brackets slide apart to reveal the page. Once per browser session
 * (sessionStorage), ≤1.2s total.
 *
 * Reduced motion: skips the flash entirely, lands straight on the static
 * wordmark, and exits with a plain ≤400ms opacity fade (no bracket
 * slide/translate — transform-based motion is exactly what reduced-motion
 * users asked to avoid, so the exit here drops the translate and keeps
 * only the opacity step, mirroring how Reveal.tsx substitutes an
 * opacity-only fade for its own y-translate under reduced motion).
 *
 * Uses motion/react's useReducedMotion (a one-shot, render-time snapshot —
 * see DECISIONS.md on why that's fine here and distinct from
 * @/lib/reducedMotion's GSAP-oriented hook), matching Reveal.tsx/
 * BracketFill.tsx's existing convention: this is a Motion-driven, one-shot
 * mount animation, not a Lenis/GSAP/ScrollTrigger concern.
 */
export default function Preloader({ frames: mediaFrames = [] }: PreloaderProps) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("flashing");
  const [frameIndex, setFrameIndex] = useState(0);
  const [categories] = useState(() => buildFrameCategories(mediaFrames));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Deferred (not called synchronously in the effect body) so that React
    // 19's Strict Mode double-invoke in dev — mount, cleanup, mount again —
    // cancels this timer on the throwaway first pass (via the cleanup
    // below) before sessionStorage is ever touched, instead of the
    // throwaway pass permanently marking the session "seen" and silently
    // suppressing the real run.
    const start = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(true);

      if (reduced) {
        setPhase("wordmark");
        timers.push(setTimeout(() => setPhase("exit"), REDUCED_HOLD_MS));
        timers.push(setTimeout(() => setVisible(false), REDUCED_HOLD_MS + REDUCED_EXIT_MS));
        return;
      }

      setPhase("flashing");
      for (let i = 0; i < FRAME_COUNT; i++) {
        timers.push(setTimeout(() => setFrameIndex(i), i * FRAME_INTERVAL_MS));
      }
      const flashEnd = FRAME_COUNT * FRAME_INTERVAL_MS;
      timers.push(setTimeout(() => setPhase("wordmark"), flashEnd));
      timers.push(setTimeout(() => setPhase("exit"), flashEnd + WORDMARK_HOLD_MS));
      timers.push(setTimeout(() => setVisible(false), flashEnd + WORDMARK_HOLD_MS + EXIT_MS));
    }, 0);

    return () => {
      clearTimeout(start);
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  if (!visible) return null;

  const exiting = phase === "exit";
  const exitSeconds = (reduced ? REDUCED_EXIT_MS : EXIT_MS) / 1000;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      aria-hidden="true"
      data-testid="preloader"
      data-phase={phase}
    >
      <motion.div
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exitSeconds, ease: "easeOut" }}
        className="flex items-center gap-3 sm:gap-5"
      >
        <motion.span
          className="display-type text-5xl text-paper sm:text-6xl"
          animate={reduced ? undefined : { x: exiting ? -32 : 0 }}
          transition={{ duration: exitSeconds, ease: [0.16, 1, 0.3, 1] }}
        >
          [
        </motion.span>

        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-card)] sm:h-32 sm:w-32">
          {phase === "flashing" &&
            categories.map((category, i) => (
              <div key={i} className="absolute inset-0" style={{ opacity: frameIndex === i ? 1 : 0 }}>
                <ScenePlaceholder
                  category={category}
                  label="Republic — loading"
                  seed={`preloader-frame-${i}`}
                  aspect="aspect-square"
                  className="h-full w-full"
                />
              </div>
            ))}
          {phase !== "flashing" && (
            <div className="flex h-full w-full items-center justify-center bg-ink px-2 text-center">
              <span className="display-type text-sm text-paper sm:text-lg">THE REPUBLIC</span>
            </div>
          )}
        </div>

        <motion.span
          className="display-type text-5xl text-paper sm:text-6xl"
          animate={reduced ? undefined : { x: exiting ? 32 : 0 }}
          transition={{ duration: exitSeconds, ease: [0.16, 1, 0.3, 1] }}
        >
          ]
        </motion.span>
      </motion.div>
    </div>
  );
}
