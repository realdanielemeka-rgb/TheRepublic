"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

/**
 * §4.6.7 — the signature Nav/CTA hover: a Republic Blue block scales in
 * from the bottom on hover/focus, with the label switching to a colour
 * that's always legible against it.
 *
 * v3 Phase C rewrite — this component originally used `mix-blend-mode:
 * difference` on the label (inverting text against whatever's beneath it,
 * per the spec's literal description), composing with Nav's own pre-
 * existing `mix-blend-difference` idle-state trick so both auto-contrast
 * against whatever `ThemeSection` is scrolled beneath the fixed bar.
 *
 * That mechanism turned out to be fundamentally broken, not just fragile,
 * for `<header>` — confirmed empirically, not assumed: decoded the actual
 * PNG pixel bytes of a running page's screenshot (not just eyeballing a
 * thumbnail, which is what let this slip through Phase A/B/C-v1's own
 * audits — a small rendered screenshot preview visually suggested the
 * wordmark was legible when it genuinely was not) and found the ENTIRE
 * fixed nav bar rendered as flat, uniform background colour with zero
 * distinct text pixels anywhere, in both dark and light appearance. Root
 * cause: `position: fixed` elements get their own compositing layer in
 * this Chromium build, and `mix-blend-mode` content inside that layer does
 * not composite against the page content scrolled beneath it at all — not
 * "blends incorrectly," genuinely un-painted. Bisected against an isolated
 * minimal repro (a fixed header + `mix-blend-mode: difference` span over a
 * plain white page, no app code involved) and reproduced the same total
 * invisibility, ruling out anything specific to this app's component tree.
 * This is a known class of Chromium limitation with blend modes and
 * separately-composited layers (fixed-position, `will-change`, etc.), not
 * something a CSS tweak inside this codebase can reliably work around.
 *
 * Fix: stop relying on blending for legibility inside `<header>` at all.
 * `<header>` itself now carries a plain, non-blended, appearance-tracking
 * background/text colour (`var(--app-bg)`/`var(--app-fg)`, the same custom
 * properties `[data-theme="auto"]` already reads — see globals.css) —
 * genuinely opaque, genuinely painted, no compositing-layer edge case to
 * hit. This component no longer uses `mix-blend-mode` anywhere: the label
 * inherits the header's `currentColor` at rest, and switches to a plain
 * `text-paper` (white) once the sweep block is active — always legible
 * against opaque Republic Blue, no differencing trick required. Still used
 * outside `<header>` too (CtaBand's CTA, not fixed-positioned, so it was
 * never actually hit by the compositing bug) — kept consistent rather than
 * branching the implementation by call site.
 *
 * Usage — the parent link/button supplies `group relative` (and its own
 * padding/shape); this component renders the sweep block and the label,
 * inheriting the caller's text colour at rest:
 *
 *   <Link href="/work" className="group relative rounded-sm px-1.5 py-1">
 *     <MixBlendHover>WORK</MixBlendHover>
 *   </Link>
 *
 * Second fix from the same debugging session, kept even though the blend-
 * mode removal alone would have been enough: the sweep block no longer
 * needs an `overflow-hidden` ancestor for its pill/rounded-corner shape —
 * pass `blockClassName` (`"rounded-sm"`/`"rounded-full"`) instead. And the
 * block itself is now only mounted in the DOM while actually
 * hovered/focused (via local React state + `<motion.span>`'s enter/exit),
 * rather than always-present-but-`scale`d-to-zero — cheaper, and avoids a
 * separate, also-confirmed compositing-isolation issue where an always-
 * present sibling declaring a `:hover`-triggered `transform`/`scale` (even
 * inert at rest) pre-promotes its own compositing layer in this Chromium
 * build. See DECISIONS.md's v3 Phase C section for the full debugging
 * trail.
 *
 * Reduced motion: `usePrefersReducedMotion()` (from `@/lib/reducedMotion`,
 * per this codebase's "any non-Motion-component reactive/structural
 * branch" rule) collapses the sweep's tween duration to 0 — the block
 * still mounts/unmounts on hover/focus (state change preserved) but
 * appears/disappears instantly rather than animating.
 *
 * Reserve this for exactly Nav links + the Start-a-project button + one
 * primary CTA per page (CtaBand) per §4.6.7 — everywhere else keeps
 * standard hover states so this stays a signature, not a default.
 */
export default function MixBlendHover({
  children,
  className,
  blockClassName,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  blockClassName?: string;
  as?: "span" | "div";
}) {
  const [active, setActive] = useState(false);
  const reduced = usePrefersReducedMotion();

  return (
    <Tag
      className={clsx("relative inline-flex items-center justify-center", className)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <AnimatePresence>
        {active && (
          <motion.span
            aria-hidden="true"
            data-testid="mix-blend-block"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: [0, 0, 0.2, 1] }}
            style={{ originY: 1 }}
            className={clsx("pointer-events-none absolute inset-0 bg-republic", blockClassName)}
          />
        )}
      </AnimatePresence>
      <span className={clsx("relative", active ? "text-paper" : "text-current")}>{children}</span>
    </Tag>
  );
}
