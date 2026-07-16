"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Imperative, one-shot check — safe to call inside a plain useEffect body.
 * SSR-safe (returns false when there's no window).
 *
 * v3 note: this module predates the removal of GSAP/ScrollTrigger from
 * this codebase (§10 — no pinning/scroll-jacking/scroll-scrubbing
 * anywhere, any breakpoint; see DECISIONS.md's v3 Phase A section and
 * SmoothScroll.tsx, which no longer touches GSAP at all). It's kept
 * because `prefersReducedMotion()`/`usePrefersReducedMotion()` are still
 * the right, SSR-safe primitives for gating *any* non-Motion-component
 * reduced-motion branch — Lenis's own setup (SmoothScroll.tsx),
 * CharHoverLink's per-character stagger, and the historical GSAP pattern
 * alike. The "keep using motion/react's useReducedMotion for Motion
 * variants, this module for anything else reactive/imperative" split (see
 * DECISIONS.md's Phase B "refined rule") still holds; only the GSAP-
 * specific example that used to live in this comment is gone, since there's
 * nothing left in the codebase that pattern applies to.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/** Reactive version for use inside a component's render/JSX — updates if
 * the OS-level setting changes mid-session. Built on useSyncExternalStore
 * (not useState+useEffect) since that's the primitive React ships
 * specifically for subscribing to external, mutable, non-React state
 * like a MediaQueryList without an SSR/hydration mismatch. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
