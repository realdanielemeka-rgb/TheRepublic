import WorkStrip from "@/components/WorkStrip";
import CaseCard from "@/components/CaseCard";
import { chivitaStyleNSips } from "../../../../content/work/chivita-style-n-sips";
import { pzlYouMatter } from "../../../../content/work/pzl-you-matter";
import { zenithHomecoming } from "../../../../content/work/zenith-homecoming";
import { twiscoEverydayHero } from "../../../../content/work/twisco-everyday-hero";
import { cowbellMumtales } from "../../../../content/work/cowbell-mumtales";
import { iInvestSecureTheBag } from "../../../../content/work/i-invest-secure-the-bag";
import { sanlamAllianzLiveWithConfidence } from "../../../../content/work/sanlamallianz-live-with-confidence";
import { heirsInsuranceLaunch } from "../../../../content/work/heirs-insurance-launch";

export const metadata = { title: "Dev — WorkStrip QA" };

/**
 * Visual/interaction QA harness for <WorkStrip> (§4.6.2). Imports all eight
 * seed cases directly (bypassing getFeaturedCases()) purely for demo
 * purposes — same precedent as /dev/placeholders, safe because this route
 * never reaches production (see ../layout.tsx). WorkStrip itself never
 * imports content/work; it only renders whatever `cases` it's handed, so
 * this exercises the exact same component Phase C will wire real
 * getFeaturedCases() data into.
 *
 * Resize the viewport below 768px (or use Playwright/devtools device
 * emulation) to see the desktop pinned strip swap for the Embla mobile
 * carousel; toggle prefers-reduced-motion to see the static-grid fallback.
 * Spacer sections above/below give the pinned section real scroll runway
 * to verify against, same idea as /dev/scroll-test.
 */
export default function DevWorkStripPage() {
  const cases = [
    chivitaStyleNSips,
    pzlYouMatter,
    zenithHomecoming,
    twiscoEverydayHero,
    cowbellMumtales,
    iInvestSecureTheBag,
    sanlamAllianzLiveWithConfidence,
    heirsInsuranceLaunch,
  ];

  return (
    <div className="flex flex-col">
      <header className="pb-8">
        <h1 className="display-type text-4xl">WORKSTRIP QA</h1>
        <p className="measure mt-4 text-smoke">
          Desktop/tablet (≥768px): pinned ~250vh scrub — scroll down through the pin below. Mobile
          (&lt;768px): Embla swipe carousel, no pin. Reduced motion: static grid. Eight cases below, mirroring
          the spec&rsquo;s 6-8 range.
        </p>
      </header>

      <section data-testid="case-card-qa">
        <h2 className="display-type text-2xl">CaseCard QA</h2>
        <p className="measure mt-2 text-sm text-smoke">
          Not otherwise reachable on any public route today — every seed case is still{" "}
          <code>pending-approval</code>, so Home/&#47;work both render their &ldquo;CASES IN REVIEW&rdquo; empty
          state instead of any <code>&lt;CaseCard&gt;</code>. Mounted directly here to verify the CaseMedia swap
          (muted looping preview slot) and the bracket-fill result-stat reveal on hover/focus.
        </p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <CaseCard item={chivitaStyleNSips} />
          <CaseCard item={pzlYouMatter} />
          <CaseCard item={zenithHomecoming} />
        </div>
      </section>

      <section data-testid="before-strip" className="mt-16 flex h-screen items-center justify-center bg-paper text-ink">
        <p className="display-type text-3xl">BEFORE STRIP — scroll down</p>
      </section>

      <WorkStrip cases={cases} />

      <section data-testid="after-strip" className="flex h-screen items-center justify-center bg-paper text-ink">
        <p className="display-type text-3xl">AFTER STRIP</p>
      </section>
    </div>
  );
}
