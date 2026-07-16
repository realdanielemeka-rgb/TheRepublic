import CaseStudyTemplate from "@/components/CaseStudyTemplate";
import { chivitaStyleNSips } from "../../../../content/work/chivita-style-n-sips";
import { pzlYouMatter } from "../../../../content/work/pzl-you-matter";
import accents from "../../../../content/accents.generated.json";
import type { CaseStudy } from "../../../../content/work";

export const metadata = { title: "Dev — Case template QA" };

// QA-only fixture: a real seed case's shape with a synthetic quote + result
// stats grafted on, purely to prove the template's *conditional* blocks
// (quote, numeric results) render correctly — none of the eight real seed
// cases have either yet (no quote is confirmed; no numeric result is
// signed off), per the standing "never fabricate" rule. Every field that
// would read as a real claim is deliberately, visibly marked as a QA
// fixture so it can never be mistaken for real client content — and this
// route 404s in production (src/app/dev/layout.tsx), so it never ships
// regardless.
const SYNTHETIC_QUOTE_RESULTS_CASE: CaseStudy = {
  ...chivitaStyleNSips,
  slug: "dev-synthetic-quote-results-fixture",
  client: "QA FIXTURE — NOT A REAL CLIENT",
  title: "Synthetic quote + result stats (template QA only)",
  quote: {
    text: "Placeholder quote copy for template QA only — not a real client statement.",
    name: "Dev QA fixture",
    role: "Not a real person",
  },
  results: [
    { value: "00%", label: "Synthetic stat — QA fixture, not a real result" },
    { value: "00x", label: "Synthetic stat — QA fixture, not a real result" },
  ],
};

/**
 * Visual QA harness for <CaseStudyTemplate> (§ case template). All eight
 * real seed cases are still `pending-approval`, so `generateStaticParams`
 * on the real `/work/[slug]` route yields zero paths today — correct, not
 * a bug (pending never renders publicly). This route temporarily treats
 * one real seed case as if it were live, ONLY here, to prove the template
 * actually renders correctly against a real case's full data shape before
 * any case can go live for real. Never linked from the public site; see
 * src/app/dev/layout.tsx for the production 404 gate.
 *
 * Two examples:
 *  1. A real seed case (Chivita — Style N Sips) exactly as authored —
 *     empty `results`, no `quote` — the actual common-case path every real
 *     case takes today. `next` points at a second real case to verify that
 *     link branch too.
 *  2. The synthetic fixture above, to verify the quote block and numeric
 *     result-stat block actually render when that data is present (`next`
 *     is null here, to verify the "zero other live cases" → "back to
 *     /work" fallback branch instead).
 */
export default function DevCaseTemplatePage() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      <header className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <h1 className="display-type text-4xl">CASE TEMPLATE QA</h1>
        <p className="measure mt-4 text-smoke">
          Example 1 below is a real seed case&rsquo;s exact data (empty results, no quote — today&rsquo;s
          actual shape). Example 2 grafts a synthetic quote + result stats onto a copy of that same case,
          clearly labelled as a QA fixture, to prove those conditional blocks render. Neither is reachable
          from any public route.
        </p>
      </header>

      <section>
        <p className="mono-label mx-auto max-w-6xl px-6 text-smoke sm:px-10">
          Example 1 — real case data, treated as live for this preview only
        </p>
        <div className="mt-6">
          <CaseStudyTemplate
            item={{ ...chivitaStyleNSips, status: "live" }}
            accentColor={accents[chivitaStyleNSips.slug as keyof typeof accents]}
            next={{ ...pzlYouMatter, status: "live" }}
          />
        </div>
      </section>

      <section className="border-t border-ink/15 pt-16">
        <p className="mono-label mx-auto max-w-6xl px-6 text-smoke sm:px-10">
          Example 2 — synthetic quote + result-stats fixture (QA only, not real content)
        </p>
        <div className="mt-6">
          <CaseStudyTemplate item={SYNTHETIC_QUOTE_RESULTS_CASE} accentColor="#1F1FFF" next={null} />
        </div>
      </section>
    </div>
  );
}
