"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import Reveal from "./Reveal";
import CaseCard from "./CaseCard";
import Bracket from "./Bracket";
import type { CaseStudy } from "../../content/work";

export default function WorkIndexClient({
  cases,
  serviceTitles,
}: {
  cases: CaseStudy[];
  serviceTitles: string[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const filtered = useMemo(
    () => (active ? cases.filter((c) => c.services.includes(active)) : cases),
    [active, cases]
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filter by service">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={clsx(
            "mono-label rounded-full border px-4 py-2 transition-colors",
            active === null ? "border-republic bg-republic" : "border-paper/30 hover:border-paper"
          )}
        >
          All
        </button>
        {serviceTitles.map((title) => (
          <button
            key={title}
            type="button"
            onClick={() => setActive(title)}
            className={clsx(
              "mono-label rounded-full border px-4 py-2 transition-colors",
              active === title ? "border-republic bg-republic" : "border-paper/30 hover:border-paper"
            )}
          >
            {title}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Reveal key={item.slug}>
              <CaseCard item={item} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-14 rounded-[var(--radius-card)] border border-paper/20 px-8 py-16 text-center">
          <p className="display-type text-2xl">
            <Bracket>CASES IN REVIEW</Bracket>
          </p>
          <p className="measure mx-auto mt-4 text-paper/70">
            Every case on this site clears client approval before it goes
            public. Check back soon.
          </p>
        </div>
      )}
    </>
  );
}
