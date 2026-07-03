"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Imperative, one-shot check — safe to call inside a plain useEffect body
 * or any GSAP/ScrollTrigger setup function (not just component render).
 * SSR-safe (returns false when there's no window).
 *
 * This is the canonical gate for anything Lenis/GSAP/ScrollTrigger-driven
 * in this codebase — see SmoothScroll.tsx for the reference pattern every
 * pinned section must follow:
 *
 *   useEffect(() => {
 *     if (prefersReducedMotion()) return; // no pin, no scrub, full stop
 *     const ctx = gsap.context(() => {
 *       ScrollTrigger.create({ trigger: ref.current, pin: true, scrub: true, ... });
 *     }, ref);
 *     return () => ctx.revert();
 *   }, []);
 *
 * Note this is deliberately separate from `useReducedMotion` exported by
 * `motion/react` (already used in Reveal/Preloader/BracketFill for
 * Motion's own component-level transitions) — keep using that one for
 * Motion variants. Use this module for anything scroll/GSAP-related, so
 * the two don't get imported interchangeably by mistake.
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
