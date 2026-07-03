"use client";

import Link from "next/link";
import clsx from "clsx";
import { CaseMedia } from "./ScenePlaceholder";
import Bracket from "./Bracket";
import { resultLine, type CaseStudy } from "../../content/work";

export interface WorkStripProps {
  /** Featured cases to show, 6-8 ideally (§4.6.2) — this component doesn't
   * filter/limit/sanction the array itself, it renders whatever it's
   * given. The caller sources it via getFeaturedCases() and owns its own
   * empty-state handling, matching the existing "CASES IN REVIEW" pattern
   * already used around getFeaturedCases() elsewhere — WorkStrip renders
   * nothing for an empty array rather than inventing its own empty state. */
  cases: CaseStudy[];
  className?: string;
}

/**
 * v3 NOTE — this component is a holdover, deliberately stripped down, not
 * a finished v3 deliverable. The v2 pinned-scroll GSAP ScrollTrigger
 * strip (`PinnedStrip`/`ResponsiveStrip`/the Embla `MobileCarousel`
 * split) has been fully removed per §10 (no GSAP/ScrollTrigger/pinning
 * anywhere) and §4.6's "no scroll-jacking, no pinning, anywhere" rule —
 * see DECISIONS.md's v3 Phase A section. What remains is a plain static
 * grid so the homepage keeps compiling and rendering real content in the
 * interim. **Phase B is expected to delete this component outright** and
 * replace its one call site (`src/app/page.tsx`) with the new flowing
 * asymmetric media grid built on `src/lib/grid-engine.ts` (§4.5) — this
 * file is not meant to be iterated on further.
 */
export default function WorkStrip({ cases, className }: WorkStripProps) {
  if (cases.length === 0) return null;

  return (
    <div
      className={clsx("grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4", className)}
      data-testid="work-strip-static"
    >
      {cases.map((item, i) => (
        <Link key={item.slug} href={`/work/${item.slug}`} className="group block">
          {item.media[0] && (
            <CaseMedia media={item.media[0]} seedPrefix={item.slug} aspect="aspect-[4/3]" active className="w-full" />
          )}
          <div className="mt-4">
            <Bracket className="mono-label text-paper">
              {String(i + 1).padStart(2, "0")} — {item.client.toUpperCase()}
            </Bracket>
            <p className="display-type mt-1 text-xl sm:text-2xl">{item.title}</p>
            <p className="mono-label mt-1 text-smoke">{resultLine(item)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
