import Link from "next/link";
import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import Eyebrow from "@/components/Eyebrow";
import BracketFill from "@/components/BracketFill";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import CaseCard from "@/components/CaseCard";
import CtaBand from "@/components/CtaBand";
import Bracket from "@/components/Bracket";
import { services } from "../../content/services";
import { clients } from "../../content/clients";
import { laws } from "../../content/laws";
import { getFeaturedCases, getFeaturedMedia } from "../../content/work";

export const metadata: Metadata = {
  title: "Home",
  description:
    "The Republic builds brand nations — work engineered for participation, from Lagos to the world.",
};

export default function HomePage() {
  const featured = getFeaturedCases();
  const currentClients = clients.filter((c) => c.tier === "current");
  const heritageClients = clients.filter((c) => c.tier === "heritage");

  return (
    <>
      {/* 01 — Hero */}
      <ThemeSection theme="ink" className="flex min-h-dvh flex-col justify-center px-6 pt-28 pb-16 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
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

      {/* 02 — Ticker */}
      <ThemeSection theme="republic" className="py-8">
        <Marquee
          text="FROM LAGOS TO THE WORLD — CLARITY BEFORE VOLUME — SYSTEMS OVER STUNTS — OUTCOMES OVER OUTPUTS — "
          chips={getFeaturedMedia("ticker-chip")}
        />
      </ThemeSection>

      {/* 03 — Selected work */}
      <ThemeSection theme="ink" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>01 — THE PROOF</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-type mt-4 text-[clamp(2rem,5vw,4rem)]">
              WORK THAT RECRUITS
            </h2>
          </Reveal>

          {featured.length > 0 ? (
            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item) => (
                <Reveal key={item.slug}>
                  <CaseCard item={item} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.1}>
              <div className="mt-14 rounded-[var(--radius-card)] border border-paper/20 px-8 py-16 text-center">
                <p className="display-type text-2xl">
                  <Bracket>CASES IN REVIEW</Bracket>
                </p>
                <p className="measure mx-auto mt-4 text-paper/70">
                  Every case on this site clears client approval before it
                  goes public. Nothing here is invented — check back soon.
                </p>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.15}>
            <Link href="/work" className="mono-label mt-12 inline-block hover:text-republic">
              All work →
            </Link>
          </Reveal>
        </div>
      </ThemeSection>

      {/* 04 — The Method teaser */}
      <ThemeSection theme="paper" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>02 — THE METHOD</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-type mt-4 text-[clamp(2rem,5vw,4rem)]">
              THE REACTION STANDARD
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="measure mt-6 text-lg">
              Our proprietary operating system for brand growth. Six laws,
              one test: did the work provoke a reaction, or did it just
              occupy space?
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {laws.map((law) => (
              <Reveal key={law.index}>
                <div className="rounded-[var(--radius-card)] border border-ink/15 p-6">
                  <p className="mono-label text-smoke">{law.index}</p>
                  {law.status === "live" ? (
                    <>
                      <p className="display-type mt-3 text-xl">{law.title}</p>
                      <p className="measure mt-2 text-sm text-smoke">{law.body}</p>
                    </>
                  ) : (
                    <p className="display-type mt-3 text-xl text-smoke">
                      <Bracket>LAW PENDING</Bracket>
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Link href="/studio#method" className="mono-label mt-12 inline-block hover:text-republic">
              Read the laws →
            </Link>
          </Reveal>
        </div>
      </ThemeSection>

      {/* 05 — Services strip */}
      <ThemeSection theme="ink" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <ol className="divide-y divide-paper/15 border-y border-paper/15">
            {services.map((service) => (
              <li key={service.index}>
                <Link
                  href="/services"
                  className="group flex flex-col gap-2 py-8 transition-colors hover:text-republic sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <span className="mono-label text-smoke">{service.index}</span>
                  <span className="display-type text-2xl sm:text-3xl">{service.title}</span>
                  <span className="measure text-sm text-paper/70 sm:ml-auto sm:text-right">
                    {service.oneLiner}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
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
