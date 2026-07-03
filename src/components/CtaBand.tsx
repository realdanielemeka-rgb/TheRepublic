import Link from "next/link";
import ThemeSection from "./ThemeSection";
import Reveal from "./Reveal";
import MixBlendHover from "./MixBlendHover";

/**
 * The band's own CTA is this page's "one primary CTA" allowance per §4.6.7
 * (Nav's links + Start-a-project button are the other reserved spot) — see
 * DECISIONS.md for why CtaBand, specifically, was chosen as that one slot:
 * it's the final, page-closing conversion moment on every page that
 * includes it, so it's the natural single "primary CTA" per render.
 */
export default function CtaBand() {
  return (
    <ThemeSection theme="republic" className="px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="display-type text-[clamp(2.5rem,6vw,5rem)]">
            READY TO BUILD YOUR
            <br />[ REPUBLIC ]?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="measure mx-auto mt-6 text-lg opacity-90">
            One conversation. A clear recommendation. No decks about decks.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            href="/contact"
            className="group relative mt-10 inline-block rounded-full bg-ink"
          >
            <MixBlendHover className="mono-label px-8 py-4" blockClassName="rounded-full">Start a project →</MixBlendHover>
          </Link>
        </Reveal>
      </div>
    </ThemeSection>
  );
}
