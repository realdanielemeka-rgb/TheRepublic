import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import Bracket from "@/components/Bracket";
import JournalGrid from "@/components/JournalGrid";
import { getJournalEntries } from "../../../content/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "What we're noticing, saying, and winning.",
};

export default function JournalPage() {
  const entries = getJournalEntries();

  return (
    <ThemeSection theme="ink" className="min-h-dvh px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Competition-pass fix: PERSPECTIVES is one long word in an
            all-caps monospace display face — the generic
            clamp(2.5rem,7vw,6rem) headline size (shared with other,
            shorter page titles like "THE PROOF") let the word itself grow
            wider than a 360px viewport, splitting the closing bracket onto
            its own line mid-word. A steeper, lower-ceilinged clamp specific
            to this headline keeps the whole bracketed word on one line down
            to the smallest supported viewport; see DECISIONS.md. */}
        <h1 className="display-type text-[clamp(1.85rem,8.2vw,6rem)]">
          <Bracket>PERSPECTIVES</Bracket>
        </h1>
        <p className="measure mt-6 text-lg text-paper/85">
          What we&rsquo;re noticing, saying, and winning.
        </p>

        <JournalGrid entries={entries} />
      </div>
    </ThemeSection>
  );
}
