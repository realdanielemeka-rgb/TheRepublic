import Link from "next/link";
import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import Bracket, { CatalogueBracket } from "@/components/Bracket";
import ManifestoLine from "@/components/ManifestoLine";
import CtaBand from "@/components/CtaBand";
import { GridRow } from "@/components/WorkGrid";
import ScenePlaceholder, { CaseMedia } from "@/components/ScenePlaceholder";
import SceneVideo, { CaseVideo } from "@/components/SceneVideo";
import { SCENE_CATEGORIES, type SceneCategory } from "@/lib/scene/generator";
import { getLiveCases, type CaseStudy } from "../../content/work";
import type { Media } from "../../content/work/types";

export const metadata: Metadata = {
  description:
    "The Republic builds brand nations — work engineered for participation, from Lagos to the world.",
};

/**
 * §6.1 — the homepage's whole job is to prove the work exists and is
 * good, fast: no hero, no ticker, no clients strip, no services list.
 * Everything below is one continuous flowing grid built on the grid
 * engine's `repeat(var(--grid-cols), 1fr)` track (`<GridRow>`,
 * src/components/WorkGrid.tsx), with the manifesto line as the one
 * full-width interruption and a Republic Blue CTA field closing it out.
 * See DECISIONS.md's v3 Phase B section for the empty-state treatment
 * (all 8 seed cases are `pending-approval` today) and the exact row
 * layout this file implements.
 */

type SlotIntent = "image" | "video";

// The row-by-row structure §6.1 specifies, expressed as [width fractions,
// media-type intent per item]. Flattened, this is exactly 8 slots — one
// per seed case, so the moment all 8 clear approval every slot below
// carries real content with no layout change required.
const ROWS: { fractions: number[]; intents: SlotIntent[]; aspect: string[]; marginClassName: string }[] = [
  {
    // Row 1 — two items, half-width each: one still, one native autoplay
    // video (§6.1's single most important visual proof point).
    fractions: [0.5, 0.5],
    intents: ["image", "video"],
    aspect: ["aspect-[4/3]", "aspect-[4/3]"],
    marginClassName: "",
  },
  {
    // Row 3 — three items: half + quarter + quarter, mixing stills/video.
    fractions: [0.5, 0.25, 0.25],
    intents: ["video", "image", "image"],
    aspect: ["aspect-[4/3]", "aspect-[3/4]", "aspect-[3/4]"],
    marginClassName: "mt-20 sm:mt-28",
  },
  {
    // Row 4 — one full-width item: the single biggest visual statement.
    fractions: [1],
    intents: ["video"],
    aspect: ["aspect-[21/9]"],
    marginClassName: "mt-20 sm:mt-28",
  },
  {
    // Row 5 — two items, half-width each.
    fractions: [0.5, 0.5],
    intents: ["image", "video"],
    aspect: ["aspect-[4/3]", "aspect-[4/3]"],
    marginClassName: "mt-16 sm:mt-24",
  },
];

function pickMedia(item: CaseStudy, intent: SlotIntent): Media | undefined {
  return (
    item.media.find((m) => m.type === intent) ??
    item.media.find((m) => m.type === (intent === "video" ? "image" : "video"))
  );
}

/** One flattened slot per grid cell across rows 1/3/4/5, paired 1:1 with
 * `getLiveCases()` in archive order — see the CatalogueBracket doc
 * comment in Bracket.tsx: index must be the item's position across the
 * *whole* work archive, not per-row/per-category. Falls back to an honest
 * "case pending approval" placeholder cell (never a fabricated case) once
 * `liveCases` runs out — true for all 8 slots today, since every seed
 * case ships `status: 'pending-approval'`. */
function buildSlots(liveCases: CaseStudy[]) {
  let cursor = 0;
  return ROWS.map((row) =>
    row.intents.map((intent, i) => {
      const archiveIndex = cursor; // 0-based position in the whole archive
      const item = liveCases[archiveIndex];
      cursor += 1;
      return {
        intent,
        aspect: row.aspect[i],
        archiveIndex,
        item,
      };
    })
  );
}

function GridSlotContent({
  intent,
  aspect,
  archiveIndex,
  item,
}: {
  intent: SlotIntent;
  aspect: string;
  archiveIndex: number;
  item?: CaseStudy;
}) {
  if (item) {
    const media = pickMedia(item, intent);
    const label = `${item.client.toUpperCase()} — ${item.title.toUpperCase()}`;
    const body = media ? (
      media.type === "video" ? (
        <CaseVideo media={media} seedPrefix={item.slug} aspect={aspect} className="w-full" />
      ) : (
        <CaseMedia media={media} seedPrefix={item.slug} aspect={aspect} className="w-full" />
      )
    ) : null;
    return (
      <Link href={`/work/${item.slug}`} className="group block">
        {body}
        <CatalogueBracket index={archiveIndex + 1} className="mono-label mt-4 line-clamp-2 text-current">
          {label}
        </CatalogueBracket>
      </Link>
    );
  }

  // Empty-state cell: a real, on-brand placeholder — not a fabricated
  // case. Category rotates through the full procedural-scene set purely
  // for visual variety across the eight cells; it carries no meaning
  // about which real case will eventually land here. See DECISIONS.md
  // for why this renders per-cell rather than collapsing the whole grid
  // to one empty-state block: the half/quarter/full-width rhythm is
  // itself part of what §6.1 is demonstrating, even before real cases
  // exist.
  const category: SceneCategory = SCENE_CATEGORIES[archiveIndex % SCENE_CATEGORIES.length];
  const seed = `home-empty-${archiveIndex}`;
  return (
    <div>
      {intent === "video" ? (
        <SceneVideo
          category={category}
          label="Case pending approval — placeholder loop"
          seed={seed}
          aspect={aspect}
          className="w-full"
        />
      ) : (
        <ScenePlaceholder
          category={category}
          label="Case pending approval — placeholder scene"
          seed={seed}
          aspect={aspect}
          className="w-full"
        />
      )}
      <p className="mono-label mt-4 text-smoke">
        <Bracket>CASE PENDING APPROVAL</Bracket>
      </p>
    </div>
  );
}

export default function HomePage() {
  const liveCases = getLiveCases();
  const slots = buildSlots(liveCases);

  return (
    <>
      <ThemeSection theme="auto" className="px-6 pt-28 pb-20 sm:px-10 sm:pb-28">
        <div className="mx-auto max-w-[1600px]">
          {/* Row 1 */}
          <GridRow fractions={ROWS[0].fractions}>
            {slots[0].map((slot) => (
              <GridSlotContent key={slot.archiveIndex} {...slot} />
            ))}
          </GridRow>

          {/* Row 2 — the manifesto, the one full-width interruption */}
          <div className="mt-24 sm:mt-32">
            <ManifestoLine />
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/work" className="mono-label inline-block hover:text-republic">
                All work →
              </Link>
              <Link href="/services" className="mono-label inline-block hover:text-republic">
                Our services →
              </Link>
            </div>
          </div>

          {/* Row 3 */}
          <GridRow fractions={ROWS[1].fractions} className={ROWS[1].marginClassName}>
            {slots[1].map((slot) => (
              <GridSlotContent key={slot.archiveIndex} {...slot} />
            ))}
          </GridRow>

          {/* Row 4 */}
          <GridRow fractions={ROWS[2].fractions} className={ROWS[2].marginClassName}>
            {slots[2].map((slot) => (
              <GridSlotContent key={slot.archiveIndex} {...slot} />
            ))}
          </GridRow>

          {/* Row 5 */}
          <GridRow fractions={ROWS[3].fractions} className={ROWS[3].marginClassName}>
            {slots[3].map((slot) => (
              <GridSlotContent key={slot.archiveIndex} {...slot} />
            ))}
          </GridRow>
        </div>
      </ThemeSection>

      {/* Final row — the CTA, a Republic Blue colour field, not media */}
      <CtaBand />
    </>
  );
}
