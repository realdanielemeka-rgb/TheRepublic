"use client";

import { useState } from "react";
import clsx from "clsx";
import ScenePlaceholder from "./ScenePlaceholder";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import type { SceneCategory } from "@/lib/scene/generator";

export interface ServiceSwapItem {
  index: string;
  title: string;
  oneLiner?: string;
  /** Representative placeholder media for this service — "CaseMedia-style"
   * per §4.6.4, but not a case Media object: services aren't cases, so this
   * stays decoupled from content/work's schema. Phase C supplies the real
   * category/label per service when wiring this on Home/Services. */
  image: { category: SceneCategory; label: string; seed?: string };
}

export interface ServiceSwapProps {
  services: ServiceSwapItem[];
  className?: string;
}

/**
 * §4.6.4 — sticky media frame cross-fading to whichever service is
 * hovered (desktop) or tapped (mobile); the other names dim to ~40%.
 *
 * Interaction is `onMouseEnter` (desktop hover) + `onFocus` (keyboard tab,
 * for parity — without this, keyboard users could never see any frame but
 * the default) + `onClick` (mobile tap: touch doesn't reliably produce
 * hover, but always fires click). Each service name is a plain `<button
 * type="button">` rather than a link — this component is the standalone
 * swap interaction only; if a service name should also navigate, Phase C
 * wires that at the call site (e.g. wrapping/adjacent Link), since this
 * component's job is the hover/tap↔media relationship, not routing.
 *
 * Reduced motion: per §4.5's "your call, document which you chose" —
 * chosen here is **stack each service with its image inline instead of
 * sticky** (not "instant cut, no dimming, still sticky"). Reasoning: a
 * stacked layout doesn't just remove *animation*, it removes the
 * *interaction dependency* entirely — every image is on-screen with its
 * service, full stop, which is a stronger reduced-motion guarantee than
 * "no crossfade, but you still have to hover/tap to ever see five of the
 * six images." Matches the same "make everything statically visible, drop
 * the interaction requirement" choice made in HoverReveal's reduced-motion
 * fallback, for a consistent reduced-motion posture across both
 * components. See DECISIONS.md.
 */
export default function ServiceSwap({ services, className }: ServiceSwapProps) {
  const reduced = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  if (reduced) {
    return (
      <div className={clsx("flex flex-col divide-y divide-current/15", className)} data-testid="service-swap-stacked">
        {services.map((service) => (
          <div
            key={service.index}
            data-testid="service-swap-stacked-item"
            className="grid gap-6 py-10 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10"
          >
            <div>
              <p className="mono-label text-smoke">{service.index}</p>
              <p className="display-type mt-2 text-2xl sm:text-3xl">{service.title}</p>
              {service.oneLiner && <p className="measure mt-2 text-sm text-current/70">{service.oneLiner}</p>}
            </div>
            <ScenePlaceholder
              category={service.image.category}
              label={service.image.label}
              seed={service.image.seed}
              aspect="aspect-[4/3]"
              active
              className="w-full sm:w-64"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx("grid gap-10 sm:grid-cols-2 sm:items-start sm:gap-16", className)}>
      <div className="relative sm:sticky sm:top-28" data-testid="service-swap-sticky-frame">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
          {services.map((service, i) => (
            <div
              key={service.index}
              data-testid="service-swap-frame"
              data-active={i === activeIndex ? "" : undefined}
              className={clsx(
                "absolute inset-0 transition-opacity duration-200 ease-out",
                i === activeIndex ? "opacity-100" : "opacity-0"
              )}
            >
              <ScenePlaceholder
                category={service.image.category}
                label={service.image.label}
                seed={service.image.seed}
                aspect="aspect-[4/3]"
                active={i === activeIndex}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <ol className="divide-y divide-current/15 border-y border-current/15">
        {services.map((service, i) => (
          <li key={service.index}>
            <button
              type="button"
              data-testid="service-swap-name"
              data-active={i === activeIndex ? "" : undefined}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
              className={clsx(
                "flex w-full flex-col gap-2 py-8 text-left transition-opacity duration-200 sm:flex-row sm:items-baseline sm:gap-8",
                i === activeIndex ? "opacity-100" : "opacity-40 hover:opacity-70"
              )}
            >
              <span className="mono-label text-smoke">{service.index}</span>
              <span className="display-type text-2xl sm:text-3xl">{service.title}</span>
              {service.oneLiner && (
                <span className="measure text-sm text-current/70 sm:ml-auto sm:text-right">{service.oneLiner}</span>
              )}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
