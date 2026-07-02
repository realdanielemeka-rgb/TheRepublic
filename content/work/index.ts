import type { CaseStudy } from "./types";
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
