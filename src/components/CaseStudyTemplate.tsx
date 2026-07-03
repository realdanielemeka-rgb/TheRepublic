import Link from "next/link";
import clsx from "clsx";
import ThemeSection from "@/components/ThemeSection";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Bracket from "@/components/Bracket";
import CaseCarousel from "@/components/CaseCarousel";
import { CaseMedia } from "@/components/ScenePlaceholder";
import type { CaseStudy } from "../../content/work";

export interface CaseStudyTemplateProps {
  item: CaseStudy;
  /** Hex from content/accents.generated.json[item.slug] — accent theme is
   * case-hero-only per §4.6.6. Omitting falls back to Republic Blue (see
   * ThemeSection). */
  accentColor?: string;
  /** Next live case by array order, or null when there is no distinct
   * other live case to point to (zero-or-one-live-case edge case) — the
   * caller resolves this so the template stays a pure presentational
   * component with no knowledge of the live-case list itself. */
  next: CaseStudy | null;
}

/**
 * Video-first case template (§ case template block order): hero → brief →
 * wide media → idea (+ gallery pairs) → carousel → quote (conditional) →
 * result → next case. Every block whose backing data is absent is omitted
 * outright rather than rendered empty — a shorter case page beats one
 * padded with filler.
 *
 * Pure presentational component, deliberately decoupled from routing/data-
 * fetching: `/work/[slug]/page.tsx` (real route, live-only data) and
 * `/dev/case-template` (dev-only harness, one seed case treated as live
 * purely to prove the template renders against a real data shape — see
 * DECISIONS.md) both render this exact component, so the two can never
 * drift out of sync with each other.
 *
 * All <CaseMedia> here render with `active` forced true: unlike
 * CaseCard/WorkStrip/Marquee/ServiceSwap/HoverReveal, nothing on this page
 * wraps media in a hover/tap affordance — it's a scrolling editorial read,
 * not a hover-interaction surface — so gating colour behind a hover nobody
 * will trigger would just leave every image looking permanently
 * desaturated.
 */
export default function CaseStudyTemplate({ item, accentColor, next }: CaseStudyTemplateProps) {
  const heroMedia = item.media.find((m) => m.kind === "hero");
  const wideMedia = item.media.filter((m) => m.kind === "wide");
  const galleryPairs = item.media.filter((m) => m.kind === "gallery-pair");
  const carouselItems = item.media.filter((m) => m.kind === "carousel");

  return (
    <>
      {/* Hero — accent theme is case-hero-only per §4.6.6 */}
      <ThemeSection theme="accent" accentColor={accentColor} className="pt-32 pb-12">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal>
            <p className="mono-label opacity-85">{item.client}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display-type mt-3 text-[clamp(2.5rem,7vw,6rem)]">{item.title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mono-label mt-4 opacity-85">
              {item.services.join(" · ")} — {item.year}
            </p>
          </Reveal>
        </div>

        {heroMedia && (
          <Reveal delay={0.15}>
            <div className="mt-10 px-6 sm:px-10">
              <CaseMedia media={heroMedia} seedPrefix={item.slug} active />
            </div>
          </Reveal>
        )}

        <div className="mt-10 flex justify-center">
          <span className="mono-label animate-bounce opacity-70" aria-hidden="true">
            ↓ SCROLL
          </span>
        </div>
      </ThemeSection>

      {/* The brief */}
      <ThemeSection theme="paper" className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>THE BRIEF</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="measure mt-6 text-xl sm:text-2xl">{item.brief}</p>
          </Reveal>
        </div>
      </ThemeSection>

      {/* Wide media */}
      {wideMedia.length > 0 && (
        <ThemeSection theme="ink" className="px-6 py-20 sm:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-10">
            {wideMedia.map((media, i) => (
              <Reveal key={i}>
                <CaseMedia media={media} seedPrefix={item.slug} active />
              </Reveal>
            ))}
          </div>
        </ThemeSection>
      )}

      {/* The idea (+ gallery pairs, alternating left/right by `reverse`) */}
      <ThemeSection theme="paper" className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>THE IDEA</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="measure mt-6 text-xl sm:text-2xl">{item.idea}</p>
          </Reveal>

          {galleryPairs.length > 0 && (
            <div className="mt-16 flex flex-col gap-16">
              {galleryPairs.map((media, i) => (
                <Reveal key={i}>
                  <div className="grid grid-cols-1 sm:grid-cols-12">
                    <div className={clsx("sm:col-span-7", media.reverse && "sm:col-start-6")}>
                      <CaseMedia media={media} seedPrefix={item.slug} aspect="aspect-[4/5]" active />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </ThemeSection>

      {/* Carousel */}
      {carouselItems.length > 0 && (
        <ThemeSection theme="ink" className="px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <CaseCarousel items={carouselItems} seedPrefix={item.slug} />
          </div>
        </ThemeSection>
      )}

      {/* Quote — only if confirmed; never fabricated */}
      {item.quote && (
        <ThemeSection theme="republic" className="px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <blockquote className="display-type text-[clamp(1.75rem,4vw,3rem)]">
                &ldquo;{item.quote.text}&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mono-label mt-6 opacity-85">
                {item.quote.name} — {item.quote.role}
              </p>
            </Reveal>
          </div>
        </ThemeSection>
      )}

      {/* The result */}
      <ThemeSection theme="paper" className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>THE RESULT</Eyebrow>
          </Reveal>
          {item.results.length > 0 ? (
            <div className="mt-10 grid gap-10 sm:grid-cols-3">
              {item.results.map((r) => (
                <Reveal key={r.label}>
                  <div>
                    <p className="display-type text-5xl text-republic-press">{r.value}</p>
                    <p className="mono-label mt-2 text-smoke">{r.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.05}>
              <div className="mt-10 rounded-[var(--radius-card)] border border-ink/15 px-8 py-14">
                <p className="display-type text-2xl">
                  <Bracket>RESULTS UNDER NDA</Bracket>
                </p>
                <p className="measure mt-4 text-smoke">Ask us in the room.</p>
              </div>
            </Reveal>
          )}
        </div>
      </ThemeSection>

      {/* Next case */}
      <ThemeSection theme="paper" className="px-6 py-16 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-ink/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
          {next ? (
            <>
              <span className="mono-label text-smoke">Next case</span>
              <Link
                href={`/work/${next.slug}`}
                className="display-type text-2xl hover:text-republic sm:text-3xl"
              >
                {next.client} — {next.title} →
              </Link>
            </>
          ) : (
            <>
              <span className="mono-label text-smoke">More work</span>
              <Link href="/work" className="display-type text-2xl hover:text-republic sm:text-3xl">
                Back to all work →
              </Link>
            </>
          )}
        </div>
      </ThemeSection>
    </>
  );
}
