"use client";

import clsx from "clsx";
import { useAppearance } from "@/lib/appearance";

/**
 * §4.7.3 — small dark/light control in the nav's secondary group.
 * Toggles `data-appearance` on `<html>` (via useAppearance), persists to
 * localStorage, and the background/text colour cross-fade itself is a
 * plain CSS transition on `body`/`[data-theme="auto"]` (see globals.css)
 * — already collapsed to ~instant by the sitewide `@media
 * (prefers-reduced-motion: reduce)` rule, same treatment as MixBlendHover.
 * The state change (the attribute flip, the persisted preference) always
 * happens instantly and synchronously on click regardless of the OS
 * motion setting — only the animated cross-fade is affected by reduced
 * motion, never the toggle's actual function.
 */
export default function AppearanceToggle({ className }: { className?: string }) {
  const { appearance, toggleAppearance } = useAppearance();
  const isLight = appearance === "light";

  return (
    <button
      type="button"
      onClick={toggleAppearance}
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? "dark" : "light"} appearance`}
      data-testid="appearance-toggle"
      data-appearance-value={appearance}
      className={clsx(
        "mono-label inline-flex items-center gap-1.5 rounded-full border border-current/40 px-3 py-1.5 text-current transition-colors hover:border-current",
        className
      )}
    >
      <span aria-hidden="true">[</span>
      <span className={clsx(!isLight && "opacity-100", isLight && "opacity-40")}>DARK</span>
      <span aria-hidden="true">/</span>
      <span className={clsx(isLight && "opacity-100", !isLight && "opacity-40")}>LIGHT</span>
      <span aria-hidden="true">]</span>
    </button>
  );
}
