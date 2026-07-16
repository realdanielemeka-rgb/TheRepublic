"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { CaseMedia } from "./ScenePlaceholder";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import type { Media } from "../../content/work/types";

export interface CaseCarouselProps {
  items: Media[];
  seedPrefix: string;
}

/**
 * Case-template carousel block ("Carousel (Embla, already installed) —
 * items with kind: 'carousel'"). Follows WorkStrip.tsx's established
 * pattern for this codebase: a top-level component branches into two
 * entirely separate sub-components based on `usePrefersReducedMotion()`,
 * so Embla's hook only ever runs in the non-reduced branch, rather than
 * mounting-but-hiding it.
 *
 * Unlike WorkStrip's mobile-only, swipe-only carousel, this one is the
 * primary (not a narrow-viewport fallback) presentation on every
 * breakpoint, so it gets explicit prev/next buttons and dot indicators in
 * addition to drag/swipe — desktop users have no drag affordance hint
 * otherwise.
 *
 * Reduced motion: per the cross-component principle in DECISIONS.md (every
 * reduced-motion fallback in this codebase removes the *interaction
 * requirement*, not just the animation) — renders every slide in a static
 * grid, `active` forced on each, instead of a carousel a user would have to
 * drag/click through.
 */
export default function CaseCarousel({ items, seedPrefix }: CaseCarouselProps) {
  const reduced = usePrefersReducedMotion();

  if (items.length === 0) return null;

  return reduced ? (
    <StaticGallery items={items} seedPrefix={seedPrefix} />
  ) : (
    <EmblaCaseCarousel items={items} seedPrefix={seedPrefix} />
  );
}

function StaticGallery({ items, seedPrefix }: CaseCarouselProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3" data-testid="case-carousel-static">
      {items.map((item, i) => (
        <CaseMedia key={i} media={item} seedPrefix={seedPrefix} aspect="aspect-[4/3]" active />
      ))}
    </div>
  );
}

function EmblaCaseCarousel({ items, seedPrefix }: CaseCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Handler defined and only ever called inside this effect (not hoisted
  // via useCallback) — matches WorkStrip.tsx's MobileCarousel, the
  // established, lint-clean pattern in this codebase for
  // eslint-plugin-react-hooks's set-state-in-effect rule (see
  // DECISIONS.md's note on this rule under Preloader).
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div data-testid="case-carousel-embla">
      <div className="touch-pan-y overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((item, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[45%]">
              <CaseMedia media={item} seedPrefix={seedPrefix} aspect="aspect-[4/3]" active />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2" role="tablist" aria-label="Carousel slides">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={`Go to slide ${i + 1} of ${items.length}`}
              aria-selected={i === selectedIndex}
              onClick={() => emblaApi?.scrollTo(i)}
              className={clsx(
                "h-2 w-2 rounded-full transition-colors",
                i === selectedIndex ? "bg-current" : "bg-current/25"
              )}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="mono-label disabled:opacity-30"
            aria-label="Previous slide"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="mono-label disabled:opacity-30"
            aria-label="Next slide"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
