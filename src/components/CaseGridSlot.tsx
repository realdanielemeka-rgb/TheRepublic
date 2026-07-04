import Link from "next/link";
import Bracket, { CatalogueBracket } from "@/components/Bracket";
import ScenePlaceholder, { CaseMedia } from "@/components/ScenePlaceholder";
import SceneVideo, { CaseVideo } from "@/components/SceneVideo";
import { SCENE_CATEGORIES, type SceneCategory } from "@/lib/scene/generator";
import type { CaseStudy, Media } from "../../content/work/types";

/**
 * v3 §6.1/§6.2 — the one shared "grid cell" renderer for both Home's
 * flowing work grid and the /work archive grid. Extracted out of Home
 * (which originated this pattern in Phase B) so /work's empty-state
 * treatment can reuse it verbatim rather than re-implementing a second
 * "CASE PENDING APPROVAL" placeholder — see DECISIONS.md's v3 Phase C
 * section for why this was pulled out.
 *
 * Renders a real case (media + catalogue-numbered caption, linked to
 * `/work/[slug]`) when `item` is supplied, or an honest, on-brand,
 * never-fabricated placeholder scene when it isn't — never a fake case.
 */

export type SlotIntent = "image" | "video";

export function pickMedia(item: CaseStudy, intent: SlotIntent): Media | undefined {
  return (
    item.media.find((m) => m.type === intent) ??
    item.media.find((m) => m.type === (intent === "video" ? "image" : "video"))
  );
}

export function GridSlotContent({
  intent,
  aspect,
  archiveIndex,
  item,
  seedPrefix = "empty",
}: {
  intent: SlotIntent;
  aspect: string;
  archiveIndex: number;
  item?: CaseStudy;
  seedPrefix?: string;
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
  // for visual variety across cells; it carries no meaning about which
  // real case will eventually land here.
  //
  // Competition-pass fix: the visible caption is a short "[ PENDING ]" tag
  // rather than the full "PLACEHOLDER — REPLACE WITH …" sentence — both
  // audits flagged the full sentence, repeated across ~20 tiles on Home/
  // Work, as diluting the bracket motif into a boilerplate stamp rather
  // than a considered signature. This also fixed a real crowding bug at
  // narrow grid-cell widths (the long sentence + the video badge had no
  // room to coexist in a ~70px-tall cell at 360px). The full sentence is
  // still available for anyone doing an asset-replacement pass later, via
  // the media's own `aria-label`/`title` (unchanged, see ScenePlaceholder/
  // SceneVideo) and this label's own `title` tooltip + `sr-only` text.
  const category: SceneCategory = SCENE_CATEGORIES[archiveIndex % SCENE_CATEGORIES.length];
  const seed = `${seedPrefix}-${archiveIndex}`;
  const fullNote = "Case pending approval — not yet cleared for publishing";
  return (
    <div>
      {intent === "video" ? (
        <SceneVideo
          category={category}
          label="Case pending approval — placeholder loop"
          seed={seed}
          aspect={aspect}
          overlayText="[ PENDING ]"
          badgeText="[ VIDEO ]"
          className="w-full"
        />
      ) : (
        <ScenePlaceholder
          category={category}
          label="Case pending approval — placeholder scene"
          seed={seed}
          aspect={aspect}
          overlayText="[ PENDING ]"
          className="w-full"
        />
      )}
      <p className="mono-label mt-4 text-smoke" title={fullNote}>
        <Bracket>
          <span aria-hidden="true">PENDING</span>
          <span className="sr-only">{fullNote}</span>
        </Bracket>
      </p>
    </div>
  );
}
