"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import { CaseMedia } from "./ScenePlaceholder";
import Bracket from "./Bracket";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/reducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { resultLine, type CaseStudy } from "../../content/work";

export interface WorkStripProps {
  /** Featured cases to show, 6-8 ideally (§4.6.2) — this component doesn't
   * filter/limit/sanction the array itself, it renders whatever it's
   * given. The caller (Phase C, on Home) is responsible for sourcing it
   * via getFeaturedCases() and for its own empty-state handling, matching
   * the existing "CASES IN REVIEW" pattern already used around
   * getFeaturedCases() elsewhere — WorkStrip renders nothing for an empty
   * array rather than inventing its own empty state. */
  cases: CaseStudy[];
  className?: string;
}

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.1;
const MIN_OPACITY = 0.55;

/**
 * §4.6.2 — scroll-scrubbed stacking work strip. Structure:
 *
 *  - `WorkStrip` — reduced-motion top-level branch (static grid) vs.
 *    everything else.
 *  - `ResponsiveStrip` — desktop/tablet (pinned GSAP strip) vs. mobile
 *    (Embla carousel) branch, gated on a *real, JS-verified* `matchMedia`
 *    check (`useMediaQuery`, not a CSS-only breakpoint) — the two variants
 *    are two different components that are only ever mounted one at a
 *    time. That's deliberate: it structurally guarantees zero GSAP/
 *    ScrollTrigger pin exists in the DOM below 768px, rather than relying
 *    on a `hidden md:block` class to visually hide a pin that's still
 *    technically active underneath. §4.5's "no pin/scroll-jacking below
 *    768px" is a hard rule — this is the version of that rule that's true
 *    even if you inspect the DOM, not just true on screen.
 */
export default function WorkStrip({ cases, className }: WorkStripProps) {
  const reduced = usePrefersReducedMotion();

  if (cases.length === 0) return null;
  if (reduced) return <StaticGrid cases={cases} className={className} />;
  return <ResponsiveStrip cases={cases} className={className} />;
}

function ResponsiveStrip({ cases, className }: WorkStripProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? (
    <PinnedStrip cases={cases} className={className} />
  ) : (
    <MobileCarousel cases={cases} className={className} />
  );
}

function CaseCaption({ item, index, className }: { item: CaseStudy; index: number; className?: string }) {
  return (
    <div className={className}>
      <Bracket className="mono-label text-paper">
        {String(index + 1).padStart(2, "0")} — {item.client.toUpperCase()}
      </Bracket>
      <p className="display-type mt-1 text-xl sm:text-2xl">{item.title}</p>
      <p className="mono-label mt-1 text-smoke">{resultLine(item)}</p>
    </div>
  );
}

/** Reduced motion: static grid, no scale/translate, captions always
 * visible — and, consistently with ServiceSwap/HoverReveal's reduced
 * fallbacks, `active` forced on every tile rather than left hover-gated.
 * The shared principle (documented in DECISIONS.md): a reduced-motion
 * fallback's job is to make everything available with zero interaction
 * required, and that's extended here to the colour state too, not just to
 * layout. */
function StaticGrid({ cases, className }: WorkStripProps) {
  return (
    <div className={clsx("grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4", className)} data-testid="work-strip-static">
      {cases.map((item, i) => (
        <Link key={item.slug} href={`/work/${item.slug}`} className="group block">
          {item.media[0] && (
            <CaseMedia media={item.media[0]} seedPrefix={item.slug} aspect="aspect-[4/3]" active className="w-full" />
          )}
          <CaseCaption item={item} index={i} className="mt-4" />
        </Link>
      ))}
    </div>
  );
}

/** Desktop/tablet (≥768px) — ~250vh pinned container, horizontal scrub. */
function PinnedStrip({ cases, className }: WorkStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return; // belt-and-braces; the parent already branches on this
    if (!sectionRef.current || !trackRef.current) return;

    const items = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);
    let lastActive = -1;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;

      const tween = gsap.to(track, {
        // Function-based target (not a pre-computed literal) so
        // invalidateOnRefresh below re-measures on resize instead of
        // scrubbing to a stale distance.
        x: () => -Math.max(track.scrollWidth - window.innerWidth, 0),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%", // + the trigger's own 100vh = ~250vh total, per §4.6.2
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        animation: tween,
        onUpdate: () => {
          const centre = window.innerWidth / 2;
          const falloff = window.innerWidth * 0.6;
          let nearestIndex = 0;
          let nearestDistance = Infinity;

          items.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const itemCentre = rect.left + rect.width / 2;
            const distance = Math.abs(itemCentre - centre);
            const closeness = gsap.utils.clamp(0, 1, 1 - distance / falloff);
            gsap.set(el, {
              scale: gsap.utils.interpolate(MIN_SCALE, MAX_SCALE, closeness),
              opacity: gsap.utils.interpolate(MIN_OPACITY, 1, closeness),
            });

            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestIndex = i;
            }
          });

          if (nearestIndex !== lastActive) {
            lastActive = nearestIndex;
            setActiveIndex(nearestIndex);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
    // `cases` isn't referenced textually inside this effect (only in the
    // JSX below, via itemRefs), but it's included deliberately: the DOM
    // this effect measures is rendered from `cases`, so a changed array
    // must tear down and re-measure a fresh ScrollTrigger against the new
    // DOM rather than scrub against stale pin/track measurements.
  }, [cases]);

  return (
    <section ref={sectionRef} className={clsx("relative h-screen", className)} data-testid="work-strip-pinned">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-ink">
        <div className="flex flex-1 items-center overflow-hidden">
          <div ref={trackRef} className="flex items-center gap-10 px-[10vw] will-change-transform">
            {cases.map((item, i) => (
              <div
                key={item.slug}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="w-[280px] shrink-0 sm:w-[340px]"
                data-testid="work-strip-item"
                data-index={i}
              >
                <Link href={`/work/${item.slug}`} className="group block">
                  {item.media[0] && (
                    <CaseMedia
                      media={item.media[0]}
                      seedPrefix={item.slug}
                      aspect="aspect-[4/3]"
                      active={i === activeIndex}
                      className="w-full"
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-24 shrink-0 border-t border-paper/15 px-[10vw] text-paper" data-testid="work-strip-caption-bar">
          {cases.map((item, i) => (
            <div
              key={item.slug}
              className={clsx(
                "absolute inset-0 flex items-center transition-opacity duration-300 ease-out",
                i === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
              )}
              aria-hidden={i !== activeIndex}
              data-testid="work-strip-caption"
              data-active={i === activeIndex ? "" : undefined}
            >
              <CaseCaption item={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Mobile (<768px) — plain Embla swipe carousel, no pin, no ScrollTrigger
 * involvement whatsoever (this component never imports gsap's pin path —
 * see the module-level doc above). `touch-action: pan-y` on the Embla
 * viewport is Embla's own documented technique for letting the browser
 * keep native vertical scroll while Embla only claims horizontal drags —
 * the concrete mechanism behind "no scroll-jacking" here, not just an
 * absence of code that would jack it. */
function MobileCarousel({ cases, className }: WorkStripProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", containScroll: "trimSnaps" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className={clsx("touch-pan-y overflow-hidden", className)} ref={emblaRef} data-testid="work-strip-mobile">
      <div className="flex gap-4 px-6">
        {cases.map((item, i) => (
          <div
            key={item.slug}
            className="min-w-0 shrink-0 grow-0 basis-[78%] sm:basis-[45%]"
            data-testid="work-strip-item"
            data-index={i}
          >
            <Link href={`/work/${item.slug}`} className="group block">
              {item.media[0] && (
                <CaseMedia
                  media={item.media[0]}
                  seedPrefix={item.slug}
                  aspect="aspect-[4/3]"
                  active={i === selectedIndex}
                  className="w-full"
                />
              )}
            </Link>
            <CaseCaption item={item} index={i} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
