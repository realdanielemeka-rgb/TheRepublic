import clsx from "clsx";
import ScenePlaceholder, { CaseMedia } from "./ScenePlaceholder";
import type { SceneCategory } from "@/lib/scene/generator";
import type { Media } from "../../content/work/types";

/**
 * §4.6.5 — content-agnostic categories used to pad the chip strip whenever
 * fewer than `chips.length` real chips are supplied (true today: Marquee's
 * only caller passes `getFeaturedMedia("ticker-chip")`, which is `[]` while
 * zero cases are both live and featured — see DECISIONS.md). Deliberately
 * NOT sourced from content/work here — Marquee stays a presentational,
 * content-agnostic component (it receives `chips` as data, it doesn't go
 * looking for case content itself), matching how CaseMedia/ScenePlaceholder
 * never import content/work either.
 */
const FALLBACK_CHIP_CATEGORIES: SceneCategory[] = [
  "beverage",
  "wellbeing",
  "civic-journey",
  "household",
  "finance-growth",
  "launch",
];

type ChipPiece = { media: Media } | { category: SceneCategory; fallbackKey: string };

function resolveChips(chips: Media[], count: number): ChipPiece[] {
  if (chips.length >= count) return chips.slice(0, count).map((media) => ({ media }));
  const real: ChipPiece[] = chips.map((media) => ({ media }));
  const padCount = count - chips.length;
  const padded: ChipPiece[] = Array.from({ length: padCount }, (_, i) => ({
    category: FALLBACK_CHIP_CATEGORIES[i % FALLBACK_CHIP_CATEGORIES.length],
    fallbackKey: `marquee-fallback-${i}`,
  }));
  return [...real, ...padded];
}

function Chip({ piece }: { piece: ChipPiece }) {
  const shared = "h-20 w-20 shrink-0";
  if ("media" in piece) {
    return <CaseMedia media={piece.media} aspect="aspect-square" className={shared} />;
  }
  return (
    <ScenePlaceholder
      category={piece.category}
      label="The Republic — reel"
      seed={piece.fallbackKey}
      aspect="aspect-square"
      className={shared}
    />
  );
}

/**
 * §4.6.5 — constant-speed ticker interleaving mono-label text segments
 * (split from `text` on " — ", matching every existing caller's copy) with
 * small looping media chips. Pauses on hover, opacity-only under reduced
 * motion (both handled globally in globals.css — no per-instance gating
 * needed here). `chips` is optional and content-agnostic (plain `Media[]`,
 * not tied to a specific case) — the caller (page.tsx today) is
 * responsible for sourcing real chips via the sanctioned
 * `getFeaturedMedia("ticker-chip")`; Marquee itself pads out to a full set
 * with generic placeholder chips if fewer than one-per-text-segment are
 * supplied, so the strip is never sparse.
 *
 * Chips are rendered via <CaseMedia>, which today is always a still SVG —
 * no <video> element exists anywhere in this codebase yet (see
 * DECISIONS.md's placeholder-media strategy). Whoever wires real footage
 * into a ticker-chip slot in the future must give that <video> `muted
 * loop autoPlay playsInline` (silent, no user gesture required, matching
 * "constant scroll... muted/no-audio" above) — flagged here since this is
 * the one call site that specifically asked for it, even though there's no
 * literal <video> tag for this phase to configure yet.
 */
export default function Marquee({
  text,
  chips = [],
  className,
}: {
  text: string;
  chips?: Media[];
  className?: string;
}) {
  const segments = text
    .split("—")
    .map((s) => s.trim())
    .filter(Boolean);
  const resolvedChips = resolveChips(chips, Math.max(segments.length, 1));

  const unit = segments.flatMap((segment, i) => [
    { kind: "text" as const, value: segment, key: `text-${i}` },
    { kind: "chip" as const, value: resolvedChips[i % resolvedChips.length], key: `chip-${i}` },
  ]);

  return (
    <div className={clsx("overflow-hidden whitespace-nowrap", className)}>
      <div className="marquee-track inline-flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="inline-flex shrink-0 items-center">
            {unit.map((piece) =>
              piece.kind === "text" ? (
                <span
                  key={`${copy}-${piece.key}`}
                  className="display-type flex shrink-0 items-center px-4 text-3xl sm:text-5xl"
                >
                  {piece.value}
                </span>
              ) : (
                <span key={`${copy}-${piece.key}`} className="mx-2 inline-flex shrink-0 align-middle">
                  <Chip piece={piece.value} />
                </span>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
