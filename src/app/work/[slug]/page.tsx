import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyTemplate from "@/components/CaseStudyTemplate";
import { getLiveCaseBySlug, getLiveCases } from "../../../../content/work";
import accents from "../../../../content/accents.generated.json";

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

/**
 * Thin data-fetching wrapper: resolves the live-only case (never a
 * pending-approval one — getLiveCaseBySlug enforces that), computes the
 * "next case" pointer, and hands both to the shared <CaseStudyTemplate>.
 * See DECISIONS.md / CaseStudyTemplate.tsx for why the actual block
 * rendering lives there rather than here.
 */
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
  // Single-or-zero-other-live-case edge case: don't link a "next case" back
  // to itself when it's the only live case — CaseStudyTemplate falls
  // through to a "back to /work" link when `next` is null.
  const next = liveCases.length > 1 ? liveCases[(currentIndex + 1) % liveCases.length] : null;
  const accentColor = (accents as Record<string, string>)[item.slug];

  return <CaseStudyTemplate item={item} accentColor={accentColor} next={next} />;
}
