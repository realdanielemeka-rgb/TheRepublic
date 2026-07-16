import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import WorkArchive from "@/components/WorkArchive";
import { getLiveCases, getWorkFacets } from "../../../content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies, not a highlight reel. Brief, idea, result — in that order.",
};

export default function WorkPage() {
  const cases = getLiveCases();
  const facets = getWorkFacets();

  return (
    <ThemeSection theme="ink" className="min-h-dvh px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="display-type text-[clamp(2.5rem,7vw,6rem)]">THE PROOF</h1>
        <p className="measure mt-6 text-lg text-paper/85">
          Case studies, not a highlight reel. Brief, idea, result — in that
          order.
        </p>

        <WorkArchive cases={cases} facets={facets} />
      </div>
    </ThemeSection>
  );
}
