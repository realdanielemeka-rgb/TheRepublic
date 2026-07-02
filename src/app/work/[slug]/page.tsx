import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeSection from "@/components/ThemeSection";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import Bracket from "@/components/Bracket";
import { getLiveCaseBySlug, getLiveCases } from "../../../../content/work";

export function generateStaticParams() {
  return getLiveCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getLiveCaseBySlug(slug);
  if (!item) return { title: "Work" };
  return {
    title: `${item.client} — ${item.title}`,
    description: item.brief,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getLiveCaseBySlug(slug);
  if (!item) notFound();

  const liveCases = getLiveCases();
  const currentIndex = liveCases.findIndex((c) => c.slug === item.slug);
  const next = liveCases[(currentIndex + 1) % liveCases.length];

  return (
    <>
      <ThemeSection theme="ink" className="px-6 pt-32 pb-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mono-label text-smoke">{item.client}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display-type mt-3 text-[clamp(2.5rem,7vw,6rem)]">
              {item.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mono-label mt-4 text-smoke">
              {item.services.join(" · ")} — {item.year}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Placeholder
              label={`${item.client} — hero media pending`}
              tone="ink"
              ratio="aspect-[16/9]"
              className="mt-10"
            />
          </Reveal>
        </div>
      </ThemeSection>

      <ThemeSection theme="paper" className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-16 sm:grid-cols-2">
          <Reveal>
            <Eyebrow>THE BRIEF</Eyebrow>
            <p className="measure mt-4 text-lg">{item.brief}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <Eyebrow>THE IDEA</Eyebrow>
            <p className="measure mt-4 text-lg">{item.idea}</p>
            <Placeholder
              label={`${item.client} — supporting media pending`}
              tone="republic"
              ratio="aspect-[4/3]"
              className="mt-6"
            />
          </Reveal>
        </div>
      </ThemeSection>

      <ThemeSection theme="ink" className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>THE RESULT</Eyebrow>
          </Reveal>
          {item.results.length > 0 ? (
            <div className="mt-10 grid gap-10 sm:grid-cols-3">
              {item.results.map((r) => (
                <div key={r.label}>
                  <p className="display-type text-5xl text-republic">{r.value}</p>
                  <p className="mono-label mt-2 text-smoke">{r.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <Reveal delay={0.05}>
              <div className="mt-10 rounded-[var(--radius-card)] border border-paper/20 px-8 py-14">
                <p className="display-type text-2xl">
                  <Bracket>RESULTS UNDER NDA</Bracket>
                </p>
                <p className="measure mt-4 text-paper/70">
                  Ask us in the room.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </ThemeSection>

      <ThemeSection theme="paper" className="px-6 py-16 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="mono-label text-smoke">Next case</span>
          <Link href={`/work/${next.slug}`} className="display-type text-2xl hover:text-republic sm:text-3xl">
            {next.client} — {next.title} →
          </Link>
        </div>
      </ThemeSection>
    </>
  );
}
