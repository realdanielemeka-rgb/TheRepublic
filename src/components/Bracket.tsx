import type { ReactNode } from "react";
import clsx from "clsx";

/**
 * The signature device: square brackets representing the space the
 * audience fills. Typographic, not SVG, so it inherits type styling
 * everywhere it's used — eyebrows, captions, headline blanks, CTAs.
 */
export default function Bracket({
  children,
  className,
  as: Tag = "span",
}: {
  children?: ReactNode;
  className?: string;
  as?: "span" | "div" | "p";
}) {
  return (
    <Tag className={clsx("inline-flex items-baseline gap-1.5", className)}>
      <span aria-hidden="true">[</span>
      <span>{children}</span>
      <span aria-hidden="true">]</span>
    </Tag>
  );
}
