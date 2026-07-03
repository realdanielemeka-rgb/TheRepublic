import type { ReactNode } from "react";
import clsx from "clsx";

/**
 * §4.6.7 — the signature Nav/CTA hover: a Republic Blue block scales
 * `scaleY(0)` → `scaleY(1)` from the bottom on hover/focus, `mix-blend-mode:
 * difference` inverting whatever's beneath it.
 *
 * Deliberately reuses (rather than fights) the mechanism Nav already relies
 * on for its own idle-state legibility: nav text carries `mix-blend-
 * difference` + `text-paper` so it auto-contrasts against whatever
 * ThemeSection is scrolled beneath the fixed bar. That means the *label*
 * span needs the blend mode, not the sweeping block — the block is a plain,
 * unblended Republic Blue fill; once it scales up behind the label, the
 * label differences against *it* instead of the page, which is what
 * actually produces the "inverting text/background beneath" look the spec
 * describes. Giving the block its own blend mode instead (an earlier draft)
 * only produces a flat blue rectangle with normally-coloured text on top —
 * visually wrong and not what "inverting" means here. No `isolation:
 * isolate` needed either: isolating would make the block blend against a
 * transparent local canvas instead of the label, breaking the same effect.
 *
 * Usage — the parent link/button supplies `group` + `relative overflow-
 * hidden` (and its own padding/shape); this component renders the sweep
 * block and the blended label:
 *
 *   <Link href="/work" className="group relative overflow-hidden rounded-sm px-1.5 py-1">
 *     <MixBlendHover>WORK</MixBlendHover>
 *   </Link>
 *
 * Reduced motion: no bespoke JS gate here — this is a plain CSS `transform`
 * transition, already collapsed to ~0ms by the sitewide `@media
 * (prefers-reduced-motion: reduce)` rule in globals.css (verified in
 * Playwright, see DECISIONS.md). The hover *state change* still happens
 * (block still appears, text still inverts) — only the animated
 * interpolation is removed, which is the correct reduced-motion treatment
 * for a hover microinteraction. Per DECISIONS.md's tooling rule, `@/lib/
 * reducedMotion`'s `prefersReducedMotion()` is reserved for Lenis/GSAP/
 * ScrollTrigger work — this isn't that, so it isn't used here.
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
  return (
    <Tag className={clsx("relative inline-flex items-center justify-center", className)}>
      <span
        aria-hidden="true"
        data-testid="mix-blend-block"
        className={clsx(
          "pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-republic transition-transform duration-300 ease-out",
          "group-hover:scale-y-100 group-focus-visible:scale-y-100",
          blockClassName
        )}
      />
      <span className="relative mix-blend-difference text-paper">{children}</span>
    </Tag>
  );
}
