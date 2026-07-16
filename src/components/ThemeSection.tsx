import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

export type Theme = "ink" | "republic" | "paper" | "accent" | "auto";

/** Full-bleed section wrapper that sets the page theme for everything
 * inside it — the mechanism behind the "turning pages" scroll effect.
 *
 * `theme="accent"` is reserved for case-study heroes (§4.6.6): pass the
 * case's generated hex from `content/accents.generated.json` as
 * `accentColor`. It's blended 15–20% into the ink base via CSS
 * `color-mix()` (see `[data-theme="accent"]` in globals.css) — the value
 * itself is already contrast-clamped by `scripts/extract-accent.mjs`
 * before it ever reaches this component. Omitting `accentColor` falls
 * back to Republic Blue so an accent section never renders unstyled.
 *
 * `theme="auto"` is new in v3 (§4.7.3): unlike the four art-directed
 * themes above (which always render literally regardless of the user's
 * global appearance choice), an "auto" section tracks the global
 * dark/light appearance toggle — it renders as `ink` while the site is in
 * dark appearance and `paper` while in light appearance. Use this for a
 * section that's meant to *be* the page's default reading surface (follow
 * the user's preference) rather than a deliberate ink/republic/paper art
 * direction choice. See DECISIONS.md's v3 Phase A section for the full
 * reasoning on how this composes with the appearance toggle. */
export default function ThemeSection({
  theme,
  children,
  className,
  id,
  as: Tag = "section",
  accentColor,
}: {
  theme: Theme;
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
  accentColor?: string;
}) {
  const style: CSSProperties | undefined =
    theme === "accent" && accentColor
      ? ({ "--case-accent": accentColor } as CSSProperties)
      : undefined;

  return (
    <Tag id={id} data-theme={theme} style={style} className={clsx("w-full", className)}>
      {children}
    </Tag>
  );
}
