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
  const category: SceneCategory = SCENE_CATEGORIES[archiveIndex % SCENE_CATEGORIES.length];
  const seed = `${seedPrefix}-${archiveIndex}`;
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
