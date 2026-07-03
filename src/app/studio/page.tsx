import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Bracket from "@/components/Bracket";
import Avatar from "@/components/Avatar";
import { laws } from "../../../content/laws";
import { leadershipTeam, team } from "../../../content/team";
import { footprint, flags } from "../../../content/site";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "The Republic is a creative and digital agency delivering deep African cultural insight at global standard.",
};

export default function StudioPage() {
  return (
    <>
      <ThemeSection theme="ink" className="px-6 pt-32 pb-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h1 className="display-type text-[clamp(3rem,7vw,7rem)]">
              BORN IN LAGOS.
              <br />
              BUILT FOR THE WORLD.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="measure mt-8 text-lg text-paper/85 sm:text-xl">
              The Republic is a creative and digital agency delivering deep
              African cultural insight at global standard — strategy,
              creative, content and platforms for brands that want
              citizens, not spectators.
            </p>
          </Reveal>
        </div>
      </ThemeSection>

      <ThemeSection theme="republic" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="display-type text-[clamp(2rem,5vw,4rem)]">
              CLARITY BEFORE VOLUME.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="display-type text-[clamp(2rem,5vw,4rem)]">
              SYSTEMS OVER STUNTS.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="display-type text-[clamp(2rem,5vw,4rem)]">
              OUTCOMES OVER OUTPUTS.
            </p>
          </Reveal>
        </div>
      </ThemeSection>

      <ThemeSection theme="paper" id="method" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>THE METHOD</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-type mt-4 text-[clamp(2rem,5vw,4rem)]">
              THE REACTION STANDARD
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </ThemeSection>

      <ThemeSection theme="ink" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>LEADERSHIP</Eyebrow>
          </Reveal>
          <div className="mt-10 grid gap-14 sm:grid-cols-2">
            {leadershipTeam.map((person) => (
              <Reveal key={person.name}>
                <Avatar name={person.name} />
                <p className="display-type mt-5 text-2xl">{person.name}</p>
                <p className="mono-label mt-1 text-smoke">{person.role}</p>
                <p className="measure mt-4 text-sm text-paper/80">{person.bio}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-20">
            <p className="mono-label text-smoke">The team</p>
            <div className="mt-6 grid gap-10 sm:grid-cols-3">
              {team.map((person) => (
                <Reveal key={person.name}>
                  <Avatar name={person.name} />
                  <p className="display-type mt-4 text-lg">{person.name}</p>
                  <p className="mono-label mt-1 text-smoke">{person.role}</p>
                  <p className="measure mt-2 text-sm text-paper/70">{person.focus}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </ThemeSection>

      {/* v3 NOTE (Phase B): the v2 "BEFORE THE REPUBLIC" heritage section
          (Budweiser/Guinness/NamPost pre-Republic leadership work) is
          removed outright, not just de-linked — v3's LOCKED rule is
          "current agency roster only, no heritage tier" and "zero founder
          pre-Republic history, anywhere." heritageWork/HeritageCard no
          longer exist in content/clients.ts. Phase C owns the full Studio
          page rebuild; this phase only guarantees no heritage content
          renders anywhere. See DECISIONS.md. */}

      <ThemeSection theme="republic" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="display-type text-[clamp(2.5rem,6vw,5rem)]">{footprint.hq.label}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mono-label mt-3 opacity-85">{footprint.hq.address}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
              {footprint.markets.map((m) => (
                <span key={m} className="mono-label">
                  {m}
                </span>
              ))}
              {flags.showKigali && (
                <span className="mono-label">{footprint.kigali.label}</span>
              )}
            </div>
          </Reveal>
        </div>
      </ThemeSection>
    </>
  );
}
