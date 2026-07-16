"use client";

import { useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import ScenePlaceholder from "./ScenePlaceholder";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import type { SceneCategory } from "@/lib/scene/generator";

export interface HoverRevealImage {
  category: SceneCategory;
  /** What the real asset should be — passed straight through to
   * ScenePlaceholder's `label` ("PLACEHOLDER — REPLACE WITH …" is
   * prepended by that component, not here). */
  label: string;
  seed?: string;
}

export interface HoverRevealProps {
  /** The trigger word/phrase, rendered exactly as given (underlined). */
  word: string;
  image: HoverRevealImage;
  /** Which side of the word the popover opens on. "auto" (default)
   * measures available viewport space above the word on hover/focus and
   * picks accordingly. */
  anchor?: "above" | "below" | "auto";
  className?: string;
}

const POPOVER_HEIGHT_ESTIMATE_PX = 220;

/**
 * §4.6.3 — the atomic manifesto hover-reveal unit: one trigger word,
 * underlined, that reveals a small Republic-Blue-bordered placeholder
 * image on hover (desktop) or tap (mobile) near it, fading + scaling in,
 * fading out on exit.
 *
 * Real `<button>`, not a styled `<span>`, deliberately: it's the one
 * element that gets hover (`:hover`), tap (a tap both focuses *and*
 * clicks), and keyboard (`Tab` + native `:focus`) reveal semantics for
 * free from one set of CSS rules, with no separate touch/click state to
 * manage. `:focus` is used rather than `:focus-visible` specifically so a
 * tap (which focuses without necessarily satisfying `:focus-visible`'s
 * "was this keyboard navigation" heuristic in every browser) reliably
 * reveals the popover on mobile.
 *
 * Self-contained reduced-motion fallback (checked independently here, not
 * only by the HoverRevealText orchestrator below) — renders the image
 * inline immediately after the word instead of as a hover popover, no
 * interaction required, so this component is correct even if a caller
 * uses it standalone rather than through HoverRevealText.
 *
 * Reactive `usePrefersReducedMotion()` (from @/lib/reducedMotion) rather
 * than motion/react's hook: this component has no `<motion.*>` element to
 * gate — it's a plain CSS hover transition that needs a *structural*
 * render branch (popover vs. inline), which is exactly what the reactive,
 * SSR-safe hook in @/lib/reducedMotion is for. See DECISIONS.md for why
 * that hook's use is extended here (and in ServiceSwap) beyond Phase A's
 * original "GSAP/Lenis only" framing.
 */
export default function HoverReveal({ word, image, anchor = "auto", className }: HoverRevealProps) {
  const reduced = usePrefersReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [resolvedAnchor, setResolvedAnchor] = useState<"above" | "below">(anchor === "below" ? "below" : "above");

  if (reduced) {
    return (
      <span className={clsx("inline", className)}>
        <span className="underline decoration-republic decoration-2 underline-offset-4">{word}</span>{" "}
        <span className="mx-1 inline-block w-36 align-middle">
          <ScenePlaceholder
            category={image.category}
            label={image.label}
            seed={image.seed}
            aspect="aspect-[4/3]"
            active
            className="border-2 border-republic"
          />
        </span>
      </span>
    );
  }

  function updateAnchor() {
    if (anchor !== "auto" || !triggerRef.current) return;
    const spaceAbove = triggerRef.current.getBoundingClientRect().top;
    setResolvedAnchor(spaceAbove > POPOVER_HEIGHT_ESTIMATE_PX ? "above" : "below");
  }

  return (
    <button
      type="button"
      ref={triggerRef}
      onMouseEnter={updateAnchor}
      onFocus={updateAnchor}
      className={clsx(
        "group/hover-reveal relative inline cursor-pointer border-0 bg-transparent p-0 underline decoration-republic decoration-2 underline-offset-4",
        className
      )}
    >
      {word}
      <span
        aria-hidden="true"
        data-testid="hover-reveal-popover"
        className={clsx(
          "pointer-events-none absolute left-1/2 z-20 w-48 -translate-x-1/2 scale-95 opacity-0",
          "transition-[opacity,transform] duration-200 ease-out",
          "group-hover/hover-reveal:scale-100 group-hover/hover-reveal:opacity-100",
          "group-focus/hover-reveal:scale-100 group-focus/hover-reveal:opacity-100",
          resolvedAnchor === "above" ? "bottom-full mb-3" : "top-full mt-3"
        )}
      >
        <ScenePlaceholder
          category={image.category}
          label={image.label}
          seed={image.seed}
          aspect="aspect-[4/3]"
          active
          className="border-2 border-republic"
        />
      </span>
    </button>
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface HoverRevealTextProps {
  /** Plain body copy (one paragraph's worth of text). */
  text: string;
  /** Trigger word/phrase → its placeholder image. Matching is whole-word,
   * case-insensitive. */
  terms: Record<string, HoverRevealImage>;
  className?: string;
  paragraphClassName?: string;
}

/**
 * §4.6.3 — "a component that takes body text + a map of trigger-word→media"
 * wrapping <HoverReveal>. Not a rich-text engine: `text` is plain copy,
 * tokenised by matching `terms`' keys as whole words/phrases
 * (case-insensitive) and wrapping each match in <HoverReveal>; everything
 * else renders as plain text in place.
 *
 * Reduced motion: renders the same paragraph (trigger words statically
 * underlined, not interactive — there's no popover concept left to
 * trigger) followed by every referenced image, labelled, in a row below
 * the paragraph. This is a deliberately different granularity than
 * <HoverReveal>'s own standalone reduced-motion fallback (one image
 * immediately after its one word) — appropriate here because this
 * component operates on a whole paragraph with potentially several terms,
 * and "collect the images together below the text" reads far better than
 * several inline images breaking up mid-sentence flow.
 */
export function HoverRevealText({ text, terms, className, paragraphClassName }: HoverRevealTextProps) {
  const reduced = usePrefersReducedMotion();
  const entries = Object.entries(terms);
  const pattern = entries.length > 0 ? new RegExp(`\\b(${entries.map(([w]) => escapeRegExp(w)).join("|")})\\b`, "gi") : null;
  const pieces = pattern ? text.split(pattern) : [text];

  function findTerm(piece: string): HoverRevealImage | undefined {
    const match = entries.find(([w]) => w.toLowerCase() === piece.toLowerCase());
    return match?.[1];
  }

  const renderPieces = (renderTerm: (piece: string, image: HoverRevealImage, key: number) => ReactNode) =>
    pieces.map((piece, i) => {
      const term = findTerm(piece);
      return term ? renderTerm(piece, term, i) : <span key={i}>{piece}</span>;
    });

  if (reduced) {
    return (
      <div className={className}>
        <p className={paragraphClassName}>
          {renderPieces((piece, _term, i) => (
            <span key={i} className="underline decoration-republic decoration-2 underline-offset-4">
              {piece}
            </span>
          ))}
        </p>
        {entries.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-6">
            {entries.map(([word, image]) => (
              <figure key={word} className="w-36">
                <ScenePlaceholder
                  category={image.category}
                  label={image.label}
                  seed={image.seed}
                  aspect="aspect-[4/3]"
                  active
                  className="border-2 border-republic"
                />
                <figcaption className="mono-label mt-2 text-smoke">{word}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <p className={clsx(className, paragraphClassName)}>
      {renderPieces((piece, term, i) => (
        <HoverReveal key={i} word={piece} image={term} />
      ))}
    </p>
  );
}
