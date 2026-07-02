import Link from "next/link";
import ThemeSection from "./ThemeSection";
import Reveal from "./Reveal";

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
            className="mono-label mt-10 inline-block rounded-full bg-ink px-8 py-4 text-paper transition-opacity hover:opacity-80"
          >
            Start a project →
          </Link>
        </Reveal>
      </div>
    </ThemeSection>
  );
}
