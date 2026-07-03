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

/**
 * §4.3 — catalogue-index variant, new in v3: work-grid item labels use
 * the bracket as a sequential index across the WHOLE work archive (not
 * per-category), zero-padded — `[ 01 ]  CHIVITA — STYLE N' SIPS`. Built
 * as an addition alongside the plain `<Bracket>` rather than a new prop
 * on it, since the two have a genuinely different shape: `<Bracket>`
 * wraps arbitrary children in one bracket pair, while this wraps only the
 * zero-padded number in brackets and renders the label immediately after,
 * unbracketed — reusing `<Bracket>` internally for the numbered part
 * rather than duplicating the bracket markup.
 *
 * `index` is 1-based (matches the spec's own "01" example) — pass the
 * item's position in the full, flattened work archive, not a per-page or
 * per-category counter. Phase B wires this into the actual homepage/work
 * grid; this is just the ready-to-use component.
 */
export function CatalogueBracket({
  index,
  children,
  className,
  as: Tag = "span",
}: {
  index: number;
  children: ReactNode;
  className?: string;
  as?: "span" | "div" | "p";
}) {
  return (
    <Tag className={clsx("inline-flex items-baseline gap-3", className)}>
      <Bracket>{String(index).padStart(2, "0")}</Bracket>
      <span>{children}</span>
    </Tag>
  );
}
