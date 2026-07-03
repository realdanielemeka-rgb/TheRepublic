"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { GridRow } from "./WorkGrid";
import { GridSlotContent } from "./CaseGridSlot";
import type { CaseStudy } from "../../content/work";

/**
 * v3 §6.2 — the Work index grid. Same fluid grid engine as Home (imports
 * <GridRow> from WorkGrid.tsx rather than re-deriving the span math), now
 * showing the full archive with a service × sector × market filter.
 *
 * Filter semantics (documented in DECISIONS.md): multi-select, with OR
 * *within* a facet and AND *across* facets — a case is shown when it
 * matches ANY selected service AND ANY selected sector AND ANY selected
 * market. An empty facet imposes no constraint. This is the intuitive
 * reading of a faceted archive: picking two sectors widens the sector set
 * (show either), while also picking a market narrows within it.
 *
 * The catalogue index on each card is the case's position in the WHOLE
 * live archive (computed before filtering), not its position in the
 * filtered view — per <CatalogueBracket>'s contract.
 */

const ROW_SIZE = 3; // cases per grid row on the archive layout
const PLACEHOLDER_COUNT = 8; // matches the seed archive's total case count

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function FilterFacet({
  legend,
  values,
  selected,
  onToggle,
}: {
  legend: string;
  values: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  if (values.length === 0) return null;
  return (
    <fieldset className="flex flex-wrap items-center gap-3">
      <legend className="mono-label mr-1 text-smoke">{legend}</legend>
      {values.map((value) => {
        const active = selected.has(value);
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(value)}
            className={clsx(
              "mono-label rounded-full border px-4 py-2 transition-colors",
              active ? "border-republic bg-republic text-paper" : "border-paper/30 text-paper hover:border-paper"
            )}
          >
            {value}
          </button>
        );
      })}
    </fieldset>
  );
}

export default function WorkArchive({
  cases,
  facets,
}: {
  cases: CaseStudy[];
  facets: { services: string[]; sectors: string[]; markets: string[] };
}) {
  const [services, setServices] = useState<Set<string>>(new Set());
  const [sectors, setSectors] = useState<Set<string>>(new Set());
  const [markets, setMarkets] = useState<Set<string>>(new Set());

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (value: string) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  // Archive indices are fixed to the full live-case order, before filtering.
  const indexed = useMemo(() => cases.map((item, i) => ({ item, archiveIndex: i })), [cases]);

  const filtered = useMemo(
    () =>
      indexed.filter(({ item }) => {
        const matchesFacet = (selected: Set<string>, has: (value: string) => boolean) =>
          selected.size === 0 || [...selected].some(has);
        return (
          matchesFacet(services, (v) => item.services.includes(v)) &&
          matchesFacet(sectors, (v) => item.sector === v) &&
          matchesFacet(markets, (v) => item.market === v)
        );
      }),
    [indexed, services, sectors, markets]
  );

  const hasFilters = services.size + sectors.size + markets.size > 0;
  const hasFacets = facets.services.length + facets.sectors.length + facets.markets.length > 0;

  const clearAll = () => {
    setServices(new Set());
    setSectors(new Set());
    setMarkets(new Set());
  };

  const rows = chunk(filtered, ROW_SIZE);

  // Zero live cases at all (no filters even active — the facet pills
  // themselves only ever contain values derived from live cases, so this
  // is the "nothing has cleared approval yet" state, not a filter miss).
  // Reuses the exact same per-cell "CASE PENDING APPROVAL" placeholder
  // Home established (<GridSlotContent>, src/components/CaseGridSlot.tsx)
  // rather than a single centred empty-state block, per DECISIONS.md.
  const emptyArchive = cases.length === 0;
  const placeholderRows = emptyArchive
    ? chunk(
        Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => i),
        ROW_SIZE
      )
    : [];

  return (
    <div>
      {hasFacets && (
        <div className="mt-12 flex flex-col gap-5" role="group" aria-label="Filter the archive">
          <FilterFacet legend="Service" values={facets.services} selected={services} onToggle={toggle(setServices)} />
          <FilterFacet legend="Sector" values={facets.sectors} selected={sectors} onToggle={toggle(setSectors)} />
          <FilterFacet legend="Market" values={facets.markets} selected={markets} onToggle={toggle(setMarkets)} />
          {hasFilters && (
            <button type="button" onClick={clearAll} className="mono-label w-fit text-smoke underline decoration-republic underline-offset-4 hover:text-paper">
              Clear filters
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-14 flex flex-col gap-16">
          {rows.map((row, ri) => (
            <GridRow key={ri} fractions={row.map(() => 1 / row.length)}>
              {row.map(({ item, archiveIndex }, i) => (
                <div key={item.slug}>
                  <GridSlotContent
                    intent={i % 2 === 0 ? "video" : "image"}
                    aspect="aspect-[4/3]"
                    archiveIndex={archiveIndex}
                    item={item}
                  />
                  <p className="mono-label mt-1 text-smoke">
                    {item.sector} · {item.market}
                  </p>
                </div>
              ))}
            </GridRow>
          ))}
        </div>
      ) : hasFilters ? (
        <div className="mt-14 rounded-[var(--radius-card)] border border-paper/20 px-8 py-16 text-center">
          <p className="display-type text-2xl">Nothing under these filters — yet.</p>
          <button type="button" onClick={clearAll} className="mono-label mt-6 underline decoration-republic underline-offset-4 hover:text-republic">
            Clear filters →
          </button>
        </div>
      ) : (
        <div className="mt-14 flex flex-col gap-16">
          {placeholderRows.map((row, ri) => (
            <GridRow key={ri} fractions={row.map(() => 1 / row.length)}>
              {row.map((archiveIndex) => (
                <GridSlotContent
                  key={archiveIndex}
                  intent={archiveIndex % 2 === 0 ? "video" : "image"}
                  aspect="aspect-[4/3]"
                  archiveIndex={archiveIndex}
                  seedPrefix="work-empty"
                />
              ))}
            </GridRow>
          ))}
        </div>
      )}
    </div>
  );
}
