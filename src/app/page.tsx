import Link from "next/link";
import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import Eyebrow from "@/components/Eyebrow";
import BracketFill from "@/components/BracketFill";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import CtaBand from "@/components/CtaBand";
import WorkStrip from "@/components/WorkStrip";
import CasesEmptyState from "@/components/CasesEmptyState";
import ServiceSwap, { type ServiceSwapItem } from "@/components/ServiceSwap";
import ScenePlaceholder from "@/components/ScenePlaceholder";
import { HoverRevealText, type HoverRevealImage } from "@/components/HoverReveal";
import { SERVICE_IMAGE_CATEGORY } from "@/lib/serviceCategories";
import { services } from "../../content/services";
import { clients } from "../../content/clients";
import { getFeaturedCases, getFeaturedMedia } from "../../content/work";

export const metadata: Metadata = {
  description:
    "The Republic builds brand nations — work engineered for participation, from Lagos to the world.",
};

// §02 — THE METHOD manifesto's three hover-reveal trigger terms. Category
// choices reuse Phase B's own /dev/hover-reveal QA example (which already
// anticipated this exact "provoke / participation / citizens" set almost
// verbatim) — see DECISIONS.md.
const MANIFESTO_TERMS: Record<string, HoverRevealImage> = {
  provoke: {
    category: "launch",
    label: "Manifesto hover-reveal — a provoke-the-reaction campaign moment",
  },
  participation: {
    category: "civic-journey",
    label: "Manifesto hover-reveal — a participation touchpoint, audience remixing the work",
  },
  citizens: {
    category: "culture",
    label: "Manifesto hover-reveal — a crowd of citizens, Lagos street energy",
  },
};

export default function HomePage() {
  const featured = getFeaturedCases();
  const currentClients = clients.filter((c) => c.tier === "current");
  const heritageClients = clients.filter((c) => c.tier === "heritage");

  const serviceItems: ServiceSwapItem[] = services.map((service) => ({
    index: service.index,
    title: service.title,
    oneLiner: service.oneLiner,
    image: {
      category: SERVICE_IMAGE_CATEGORY[service.index] ?? "generic",
      label: `${service.title} — representative placeholder`,
      seed: `home-service-${service.index}`,
    },
  }));

  return (
    <>
      {/* 01 — Hero */}
      <ThemeSection
        theme="ink"
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 pt-28 pb-16 sm:px-10"
      >
        {/* Optional muted B&W background loop — quiet, type-first, kept
            desaturated (never `active`) and low-opacity so it never
            competes with the hero copy or the work strip below.
            Decorative only: aria-hidden so screen readers reach the H1
            immediately rather than hearing a placeholder disclaimer first
            (contrast with Marquee's chips, which are real content and stay
            accessible — see DECISIONS.md). */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <ScenePlaceholder
            category="culture"
            label="Home hero loop — citizens in motion, Lagos street energy, muted black and white"
            seed="home-hero-bg"
            isVideo
            showOverlay={false}
            className="h-full w-full opacity-[0.22]"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <Reveal>
            <Eyebrow>A CREATIVE &amp; DIGITAL AGENCY — LAGOS</Eyebrow>
          </Reveal>
          <h1 className="display-type mt-6 text-[clamp(3.5rem,8vw,9rem)]">
            <Reveal delay={0.05}>
              <span className="block">MOST MARKETING</span>
            </Reveal>
            <Reveal delay={0.15}>
              <span className="block">MAKES VIEWERS.</span>
            </Reveal>
            <Reveal delay={0.25}>
              <span className="flex flex-wrap items-baseline gap-x-4">
                WE MAKE
                <BracketFill word="CITIZENS" />.
              </span>
            </Reveal>
          </h1>
          <Reveal delay={0.4}>
            <p className="measure mt-8 text-lg text-paper/85 sm:text-xl">
              The Republic builds brand nations — work engineered for
              participation, from Lagos to the world.
            </p>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/work"
                className="mono-label rounded-full bg-republic px-6 py-3 text-paper transition-colors hover:bg-republic-press"
              >
                See the work →
              </Link>
              <Link
                href="/studio"
                className="mono-label rounded-full border border-paper/40 px-6 py-3 text-paper transition-colors hover:border-paper"
              >
                How we think
              </Link>
            </div>
          </Reveal>
        </div>
      </ThemeSection>

      {/* 02 — The work strip */}
      <ThemeSection theme="ink" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>01 — THE WORK</Eyebrow>
          </Reveal>

          {featured.length > 0 ? (
            <div className="mt-14">
              <WorkStrip cases={featured} />
            </div>
          ) : (
            <Reveal delay={0.1}>
              <CasesEmptyState className="mt-14" />
            </Reveal>
          )}

          <Reveal delay={0.15}>
            <Link href="/work" className="mono-label mt-12 inline-block hover:text-republic">
              All work →
            </Link>
          </Reveal>
        </div>
      </ThemeSection>

      {/* 03 — Ticker */}
      <ThemeSection theme="republic" className="py-8">
        <Marquee
          text="FROM LAGOS TO THE WORLD — CLARITY BEFORE VOLUME — SYSTEMS OVER STUNTS — OUTCOMES OVER OUTPUTS — "
          chips={getFeaturedMedia("ticker-chip")}
        />
      </ThemeSection>

      {/* 04 — Manifesto */}
      <ThemeSection theme="paper" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>02 — THE METHOD</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <HoverRevealText
              text="Most brands make viewers. We believe the work should provoke, not observe — and that participation belongs inside the format, not appended as a caption. We build for citizens: people who show up, add to the thing, and come back."
              terms={MANIFESTO_TERMS}
              className="mt-8"
              paragraphClassName="measure text-2xl leading-snug sm:text-3xl"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link href="/studio#method" className="mono-label mt-12 inline-block hover:text-republic">
              Read the laws →
            </Link>
          </Reveal>
        </div>
      </ThemeSection>

      {/* 05 — Services */}
      <ThemeSection theme="ink" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>SERVICES</Eyebrow>
          </Reveal>
          <div className="mt-10">
            <ServiceSwap services={serviceItems} />
          </div>
        </div>
      </ThemeSection>

      {/* 06 — Clients */}
      <ThemeSection theme="paper" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>TRUSTED BY</Eyebrow>
          </Reveal>

          <div className="mt-10">
            <p className="mono-label text-smoke">Current partners</p>
            <div className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
              {currentClients.map((c) => (
                <span
                  key={c.name}
                  className="display-type text-xl text-smoke transition-colors hover:text-republic"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <p className="mono-label text-smoke">Heritage &amp; leadership work</p>
            <div className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
              {heritageClients.map((c) => (
                <span
                  key={c.name}
                  className="display-type text-xl text-smoke transition-colors hover:text-republic"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ThemeSection>

      {/* 07 — CTA */}
      <CtaBand />
    </>
  );
}
