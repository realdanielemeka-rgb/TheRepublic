import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

export type Theme = "ink" | "republic" | "paper" | "accent";

/** Full-bleed section wrapper that sets the page theme for everything
 * inside it — the mechanism behind the "turning pages" scroll effect.
 *
 * `theme="accent"` is reserved for case-study heroes (§4.6.6): pass the
 * case's generated hex from `content/accents.generated.json` as
 * `accentColor`. It's blended 15–20% into the ink base via CSS
 * `color-mix()` (see `[data-theme="accent"]` in globals.css) — the value
 * itself is already contrast-clamped by `scripts/extract-accent.mjs`
 * before it ever reaches this component. Omitting `accentColor` falls
 * back to Republic Blue so an accent section never renders unstyled. */
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
