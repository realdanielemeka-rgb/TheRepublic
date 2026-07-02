import type { ReactNode } from "react";
import clsx from "clsx";

export type Theme = "ink" | "republic" | "paper";

/** Full-bleed section wrapper that sets the page theme for everything
 * inside it — the mechanism behind the "turning pages" scroll effect. */
export default function ThemeSection({
  theme,
  children,
  className,
  id,
  as: Tag = "section",
}: {
  theme: Theme;
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
}) {
  return (
    <Tag id={id} data-theme={theme} className={clsx("w-full", className)}>
      {children}
    </Tag>
  );
}
