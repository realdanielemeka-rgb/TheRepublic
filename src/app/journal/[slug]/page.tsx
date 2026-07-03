import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeSection from "@/components/ThemeSection";
import Eyebrow from "@/components/Eyebrow";
import JournalBody from "@/components/JournalBody";
import { getJournalEntries } from "../../../../content/journal";
import { getLiveCaseBySlug } from "../../../../content/work";

const TYPE_LABEL = {
  perspective: "Perspective",
  press: "Press",
  recognition: "Recognition",
} as const;

// Real, non-empty only once entries exist — see content/journal/index.ts.
// Zero routes generated today, same pattern as the case template.
export function generateStaticParams() {
  return getJournalEntries().map((e) => ({ slug: e.slug }));
}

function findEntry(slug: string) {
  return getJournalEntries().find((e) => e.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) return { title: "Journal" };
  return {
    title: entry.title,
    description: `${TYPE_LABEL[entry.type]} — ${entry.date}`,
  };
}

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) notFound();

  // Only link a case that's both set AND actually live — never trust a
  // stored slug alone to gate a public link, same rule Services applies
  // to aiNativeCallout.caseSlug.
  const linkedCase = entry.linkedCase ? getLiveCaseBySlug(entry.linkedCase) : undefined;

  return (
    <ThemeSection theme="ink" className="min-h-dvh px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>
          {TYPE_LABEL[entry.type]} · {entry.date}
        </Eyebrow>
        <h1 className="display-type mt-4 text-[clamp(2rem,6vw,4.5rem)]">{entry.title}</h1>

        <JournalBody body={entry.body} />

        {linkedCase && (
          <Link
            href={`/work/${linkedCase.slug}`}
            className="mono-label mt-10 inline-block hover:text-republic"
          >
            See the case — {linkedCase.client} → {linkedCase.title} →
          </Link>
        )}

        <Link href="/journal" className="mono-label mt-16 block text-smoke hover:text-paper">
          ← Back to Journal
        </Link>
      </div>
    </ThemeSection>
  );
}
