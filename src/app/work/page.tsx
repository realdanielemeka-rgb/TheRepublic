import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import WorkIndexClient from "@/components/WorkIndexClient";
import { services } from "../../../content/services";
import { getLiveCases } from "../../../content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies, not a highlight reel. Brief, idea, result — in that order.",
};

export default function WorkPage() {
  const cases = getLiveCases();

  return (
    <ThemeSection theme="ink" className="min-h-dvh px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="display-type text-[clamp(2.5rem,7vw,6rem)]">THE PROOF</h1>
        <p className="measure mt-6 text-lg text-paper/85">
          Case studies, not a highlight reel. Brief, idea, result — in that
          order.
        </p>

        <WorkIndexClient cases={cases} serviceTitles={services.map((s) => s.title)} />
      </div>
    </ThemeSection>
  );
}
