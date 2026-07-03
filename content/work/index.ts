import type { CaseStudy, Media, MediaKind } from "./types";
import { chivitaStyleNSips } from "./chivita-style-n-sips";
import { pzlYouMatter } from "./pzl-you-matter";
import { zenithHomecoming } from "./zenith-homecoming";
import { twiscoEverydayHero } from "./twisco-everyday-hero";
import { cowbellMumtales } from "./cowbell-mumtales";
import { iInvestSecureTheBag } from "./i-invest-secure-the-bag";
import { sanlamAllianzLiveWithConfidence } from "./sanlamallianz-live-with-confidence";
import { heirsInsuranceLaunch } from "./heirs-insurance-launch";

export type { CaseStudy } from "./types";

// All seed cases, including those pending approval. Never import this
// directly in a public-facing page — use getLiveCases / getFeaturedCases /
// getLiveCaseBySlug below, which enforce the publishing rule.
const allCases: CaseStudy[] = [
  chivitaStyleNSips,
  pzlYouMatter,
  zenithHomecoming,
  twiscoEverydayHero,
  cowbellMumtales,
  iInvestSecureTheBag,
  sanlamAllianzLiveWithConfidence,
  heirsInsuranceLaunch,
];

// Build-time guard for the §7 Media schema's implicit rule ("poster
// required if type === 'video'"). Runs once at module load — since every
// page that touches case content imports this module, a missing poster
// fails `next build`/`next dev` immediately rather than shipping a broken
// video slot silently.
function assertValidMedia(slug: string, media: Media[]) {
  for (const item of media) {
    if (item.type === "video" && !item.poster) {
      throw new Error(
        `content/work: case "${slug}" has a video media item (kind="${item.kind}") with no poster. Video media requires poster per the §7 schema.`
      );
    }
  }
}
allCases.forEach((c) => assertValidMedia(c.slug, c.media));

/** Cases cleared for public display, newest first. Pending-approval cases
 * never render on public routes — this is a hard rule, not a default. */
export function getLiveCases(): CaseStudy[] {
  return allCases
    .filter((c) => c.status === "live")
    .sort((a, b) => b.year - a.year);
}

export function getFeaturedCases(): CaseStudy[] {
  return getLiveCases().filter((c) => c.featured);
}

export function getLiveCaseBySlug(slug: string): CaseStudy | undefined {
  return getLiveCases().find((c) => c.slug === slug);
}

export function getLiveCasesByService(service: string): CaseStudy[] {
  return getLiveCases().filter((c) => c.services.includes(service));
}

/**
 * Media pulled from live, *featured* cases only — the sanctioned source for
 * global chrome that renders on every public page regardless of route
 * (Marquee's ticker chips, the root-layout Preloader's flash-reveal
 * frames), as opposed to case-detail content, which is scoped per-slug via
 * getLiveCaseBySlug. Built on getFeaturedCases() so it inherits the same
 * "pending never renders publicly" guarantee automatically — it is not a
 * new access path around that rule.
 *
 * Returns `[]` while no case is both live and featured (true for all eight
 * seeds today, per DECISIONS.md). Callers that need a guaranteed-non-empty
 * result (Marquee, Preloader) supply their own content-agnostic fallback
 * frames, exactly like the "CASES IN REVIEW" bracket fallback already used
 * wherever getFeaturedCases()/getLiveCases() can return empty. See
 * DECISIONS.md ("Phase B — safe media sourcing for global chrome") for why
 * this exists as a separate function rather than having Marquee/Preloader
 * import getFeaturedCases() directly.
 */
export function getFeaturedMedia(kind?: MediaKind): Media[] {
  const media = getFeaturedCases().flatMap((c) => c.media);
  return kind ? media.filter((m) => m.kind === kind) : media;
}

/** Shared "stat or NDA fallback" line — used by CaseCard and WorkStrip so
 * the copy can't drift between the two places it renders. */
export function resultLine(item: CaseStudy): string {
  const [first] = item.results;
  return first?.value && first?.label ? `${first.value} ${first.label}` : "Results under NDA — ask us";
}
