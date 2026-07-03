"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * §4.7.3 — the global, user-togglable dark/light appearance mechanism.
 *
 * Two modes only, per §4.1 ("two appearance modes, not three: dark
 * (ink-based, default) and light (paper-based). No third novelty mode.") —
 * `Appearance` is a plain union, not an open string, so a third value
 * can't be introduced by accident.
 *
 * This is deliberately a *different* system from `ThemeSection`'s
 * existing ink/republic/paper/accent theming (`src/components/
 * ThemeSection.tsx`) — see DECISIONS.md's v3 Phase A section for the full
 * reasoning on how the two compose. Short version: `ThemeSection`'s four
 * themes stay pure per-section art direction, completely unaffected by
 * this toggle (a section that asks for `theme="ink"` always renders ink,
 * regardless of the user's global appearance choice — same for
 * `"republic"`/`"paper"`/`"accent"`). This module instead controls (a)
 * unthemed page chrome — `<body>`'s own base background/text, for any
 * surface that isn't wrapped in an explicit ThemeSection — and (b) the
 * new `theme="auto"` ThemeSection variant, which Phase B/C can opt a
 * section into when they specifically want it to track the user's
 * appearance choice rather than being locked to one look.
 */
export type Appearance = "dark" | "light";

export const APPEARANCE_STORAGE_KEY = "republic-appearance";
const APPEARANCE_ATTR = "data-appearance";
const APPEARANCE_EVENT = "republic:appearance-change";

// LOCKED default per §2/§4.1: dark (ink), user togglable to light (paper).
const DEFAULT_APPEARANCE: Appearance = "dark";

function normalise(value: string | null): Appearance {
  return value === "light" ? "light" : DEFAULT_APPEARANCE;
}

function readAppearance(): Appearance {
  if (typeof document === "undefined") return DEFAULT_APPEARANCE;
  return normalise(document.documentElement.getAttribute(APPEARANCE_ATTR));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(APPEARANCE_EVENT, callback);
  return () => window.removeEventListener(APPEARANCE_EVENT, callback);
}

function getServerSnapshot(): Appearance {
  return DEFAULT_APPEARANCE;
}

/** Sets the appearance everywhere it needs to live: the `<html>`
 * attribute every CSS rule keys off, localStorage (so it persists across
 * reloads/sessions), and a same-tab custom event so every `useAppearance()`
 * subscriber re-renders immediately (a plain `storage` event only fires in
 * *other* tabs, never the tab that made the change). */
export function setAppearance(next: Appearance): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(APPEARANCE_ATTR, next);
  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, next);
  } catch {
    // Storage disabled/unavailable (private mode, etc.) — the attribute
    // write above still makes the toggle work for the rest of this
    // session, it just won't persist across a reload. Not fatal.
  }
  window.dispatchEvent(new Event(APPEARANCE_EVENT));
}

/** Reactive read + toggle, built on useSyncExternalStore for the same
 * SSR/hydration-safety reason as usePrefersReducedMotion (@/lib/
 * reducedMotion) and useMediaQuery (@/lib/useMediaQuery) — subscribing to
 * external, mutable, non-React state (an attribute on <html>, written by
 * both the pre-paint boot script and this module) without a hydration
 * mismatch. getServerSnapshot always returns the locked "dark" default,
 * matching both the boot script's own fallback and the no-JS static CSS
 * baseline in globals.css, so there's nothing for the client to
 * reconcile on first paint beyond what the boot script already set. */
export function useAppearance(): { appearance: Appearance; toggleAppearance: () => void; setAppearance: (a: Appearance) => void } {
  const appearance = useSyncExternalStore(subscribe, readAppearance, getServerSnapshot);
  const toggleAppearance = useCallback(() => {
    setAppearance(appearance === "dark" ? "light" : "dark");
  }, [appearance]);
  return { appearance, toggleAppearance, setAppearance };
}

/**
 * Blocking pre-paint boot script source (see grid-engine.ts's
 * GRID_ENGINE_BOOT_SCRIPT for the identical pattern/rationale) — reads
 * localStorage synchronously and writes the `data-appearance` attribute
 * before first paint, so there's never a flash of the wrong appearance on
 * load. Interpolates the real storage key/attribute name constants above
 * rather than duplicating the literals, so they can't drift out of sync.
 */
export const APPEARANCE_BOOT_SCRIPT = `(function(){try{
var v=localStorage.getItem("${APPEARANCE_STORAGE_KEY}");
var a=(v==="light")?"light":"${DEFAULT_APPEARANCE}";
document.documentElement.setAttribute("${APPEARANCE_ATTR}",a);
}catch(e){document.documentElement.setAttribute("${APPEARANCE_ATTR}","${DEFAULT_APPEARANCE}");}})();`;
