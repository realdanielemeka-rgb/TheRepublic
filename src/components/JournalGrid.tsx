"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { GridRow } from "./WorkGrid";
import Bracket from "./Bracket";
import type { JournalEntry } from "../../content/journal";

const TYPE_LABEL: Record<JournalEntry["type"], string> = {
  perspective: "Perspective",
  press: "Press",
  recognition: "Recognition",
};

const TYPES = ["perspective", "press", "recognition"] as const;

const ROW_SIZE = 3;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/**
 * §6.5 — Journal index grid. Same GridRow/GridCell fluid engine as Home
 * and Work (src/components/WorkGrid.tsx), scaled to card size, per spec.
 * `getJournalEntries()` returns `[]` today (see content/journal/index.ts)
 * — the real, on-brand empty state below is not a placeholder waiting to
 * be filled, it's the honest current state.
 */
export default function JournalGrid({ entries }: { entries: JournalEntry[] }) {
  const [type, setType] = useState<JournalEntry["type"] | null>(null);

  const filtered = useMemo(
    () => (type ? entries.filter((e) => e.type === type) : entries),
    [entries, type]
  );

  const availableTypes = useMemo(
    () => TYPES.filter((t) => entries.some((e) => e.type === t)),
    [entries]
  );

  const rows = chunk(filtered, ROW_SIZE);

  return (
    <div>
      {availableTypes.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filter by type">
          <button
            type="button"
            onClick={() => setType(null)}
            className={clsx(
              "mono-label rounded-full border px-4 py-2 transition-colors",
              type === null ? "border-republic bg-republic text-paper" : "border-paper/30 hover:border-paper"
            )}
          >
            All
          </button>
          {availableTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={clsx(
                "mono-label rounded-full border px-4 py-2 transition-colors",
                type === t ? "border-republic bg-republic text-paper" : "border-paper/30 hover:border-paper"
              )}
            >
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-14 flex flex-col gap-12">
          {rows.map((row, ri) => (
            <GridRow key={ri} fractions={row.map(() => 1)}>
              {row.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/journal/${entry.slug}`}
                  className="group block rounded-[var(--radius-card)] border border-paper/15 p-6 transition-colors hover:border-paper/40"
                >
                  <p className="mono-label text-smoke">
                    {TYPE_LABEL[entry.type]} · {entry.date}
                  </p>
                  <p className="display-type mt-3 text-2xl">{entry.title}</p>
                </Link>
              ))}
            </GridRow>
          ))}
        </div>
      ) : (
        <div className="mt-14 rounded-[var(--radius-card)] border border-paper/20 px-8 py-20 text-center">
          <p className="display-type text-2xl">
            <Bracket>NOTHING PUBLISHED YET — CHECK BACK</Bracket>
          </p>
        </div>
      )}
    </div>
  );
}
