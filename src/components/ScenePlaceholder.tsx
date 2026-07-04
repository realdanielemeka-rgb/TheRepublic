import clsx from "clsx";
import {
  VIEW_W,
  VIEW_H,
  generateScene,
  categoryFromSrc,
  hashString,
  type SceneCategory,
  type SceneShape,
} from "@/lib/scene/generator";
import type { Media, MediaKind } from "../../content/work/types";

/**
 * Procedural stand-in for real photography/video, per DECISIONS.md
 * ("Placeholder media strategy"). Renders a deterministic, seed-driven
 * flat-geometric SVG scene suggestive of `category`, desaturated at rest
 * and revealing its (palette-only) colour on hover, focus, or when the
 * `active` prop is set from outside — e.g. by a hover/focus/selected-
 * index state on a parent interactive component (WorkStrip's active
 * tile, ServiceSwap's active service, etc.; v3 has no GSAP/ScrollTrigger
 * scroll-driven toggling, see DECISIONS.md's v3 Phase A section).
 * Server-Component safe: no hooks, no client-only
 * state, fully determined by props (SSR/CSR markup always match).
 *
 * Every instance renders a persistent, visible mono caption identifying
 * exactly what real asset should replace it — that's the component's own
 * overlay, not something callers add separately. Video slots additionally
 * get a persistent "VIDEO PENDING" badge.
 */
export interface ScenePlaceholderProps {
  category: SceneCategory;
  /** What the real asset should be, e.g. "Chivita hero loop" — the
   * component prepends "PLACEHOLDER — REPLACE WITH" itself. */
  label: string;
  /** Tailwind aspect-ratio class, e.g. "aspect-[16/9]". */
  aspect?: string;
  isVideo?: boolean;
  /** External colour-state override (e.g. a parent's active-index state).
   * OR'd with native :hover/:focus-within and an ancestor .group's
   * :hover/:focus-within, so this drops into a <Link className="group">
   * card exactly like the existing bracket-fill pattern, or under direct
   * hover, or under an external active/selected state. */
  active?: boolean;
  /** Overrides the seed derived from category+label. Only needed if two
   * instances would otherwise share both. */
  seed?: string;
  /** Suppresses the visible "PLACEHOLDER — REPLACE WITH ..." caption bar
   * and the "VIDEO PENDING" badge, keeping only the scene graphic itself.
   * Only for instances that are already `aria-hidden` decoration (e.g. a
   * quiet, low-opacity hero background loop) — those captions exist to
   * flag real content slots that need a real asset, and have nothing to
   * say about a purely atmospheric layer nobody is meant to read. Found
   * via a UI/UX audit: without this, a full-bleed hero background's badge
   * collides with the sticky nav at the top of the page (§4.6.1/§6.1's
   * hero background is full-height, right under the nav). Do NOT set this
   * on any instance that isn't itself aria-hidden — the caption is the
   * only thing telling a real content slot apart from a finished one. */
  showOverlay?: boolean;
  /** Shorter visible caption for contexts where the full "PLACEHOLDER —
   * REPLACE WITH …" sentence, repeated across many tiles (e.g. Home/Work's
   * grid of pending-case cells), dilutes the bracket motif into visual
   * noise rather than a considered signature — see DECISIONS.md's
   * competition-pass note. The full sentence remains the accessible name
   * (`aria-label`) and the caption's `title` tooltip regardless — nothing
   * is lost for someone doing an asset-replacement pass later, it's just
   * no longer the dominant visible text on every tile. */
  overlayText?: string;
  className?: string;
}

export default function ScenePlaceholder({
  category,
  label,
  aspect = "aspect-[4/3]",
  isVideo = false,
  active = false,
  seed,
  showOverlay = true,
  overlayText,
  className,
}: ScenePlaceholderProps) {
  const effectiveSeed = seed ?? label;
  const shapes = generateScene(category, effectiveSeed);
  const grainId = `scene-grain-${hashString(`${category}:${effectiveSeed}`)}`;
  const fullLabel = `PLACEHOLDER — REPLACE WITH ${label}`.toUpperCase();
  const ariaLabel = isVideo ? `${fullLabel} — VIDEO PENDING` : fullLabel;
  const visibleCaption = overlayText ?? fullLabel;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      data-active={active ? "" : undefined}
      className={clsx(
        "group/scene relative isolate overflow-hidden rounded-[var(--radius-card)] bg-ink",
        "grayscale transition-[filter] duration-500 ease-out",
        "hover:grayscale-0 focus-within:grayscale-0",
        "group-hover:grayscale-0 group-focus-within:grayscale-0",
        "data-[active]:grayscale-0",
        aspect,
        className
      )}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <filter id={grainId} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={2}
              stitchTiles="stitch"
              result="noise"
            />
            {/* Force RGB to paper-white, keep only the noise's luminance
                as alpha — a fine, flat grain tint rather than a coloured
                texture (no gradients, no new hues). */}
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.2126 0.7152 0.0722 0 0"
            />
          </filter>
        </defs>

        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="var(--color-ink)" />
        {shapes.map((shape, i) => (
          <SceneShapeEl key={i} shape={shape} />
        ))}
        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} filter={`url(#${grainId})`} opacity={0.08} />
      </svg>

      {showOverlay && isVideo && (
        <span className="mono-label absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-paper">
          Video pending
        </span>
      )}

      {showOverlay && (
        <span
          className="mono-label absolute inset-x-0 bottom-0 line-clamp-2 bg-ink/70 px-3 py-2 text-paper"
          title={fullLabel}
        >
          {visibleCaption}
        </span>
      )}
    </div>
  );
}

function SceneShapeEl({ shape }: { shape: SceneShape }) {
  switch (shape.el) {
    case "circle":
      return (
        <circle
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          opacity={shape.opacity}
        />
      );
    case "rect":
      return (
        <rect
          x={shape.x}
          y={shape.y}
          width={Math.max(shape.w, 0)}
          height={Math.max(shape.h, 0)}
          rx={shape.rx}
          fill={shape.fill}
          opacity={shape.opacity}
        />
      );
    case "line":
      return (
        <line
          x1={shape.x1}
          y1={shape.y1}
          x2={shape.x2}
          y2={shape.y2}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth ?? 1}
          opacity={shape.opacity}
        />
      );
    case "polyline":
      return (
        <polyline
          points={shape.points}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth ?? 1}
          opacity={shape.opacity}
          fill={shape.fill ?? "none"}
        />
      );
    default:
      return null;
  }
}

/** Exported so SceneVideo.tsx's <CaseVideo> wrapper (the real-<video>
 * variant, kept in its own client-boundary file — see that file's doc
 * comment) can resolve the same per-kind default aspect ratio without
 * duplicating this table. */
export const ASPECT_BY_KIND: Record<MediaKind, string> = {
  hero: "aspect-[21/9]",
  wide: "aspect-[16/9]",
  "gallery-pair": "aspect-[4/5]",
  carousel: "aspect-[4/3]",
  "ticker-chip": "aspect-square",
};

/**
 * Convenience wrapper Phase B/C can drop into any case-media slot without
 * re-deriving category/aspect/video state by hand: given one entry from a
 * CaseStudy's `media: Media[]`, it resolves the right <ScenePlaceholder>
 * automatically. `aspect` is picked from `media.kind` unless overridden.
 */
export function CaseMedia({
  media,
  seedPrefix,
  aspect,
  active,
  className,
}: {
  media: Media;
  /** e.g. the case slug — keeps seeds unique across cases that might
   * otherwise share a category + alt text. */
  seedPrefix?: string;
  aspect?: string;
  active?: boolean;
  className?: string;
}) {
  const placeholderId = media.type === "video" && media.poster ? media.poster : media.src;
  const category = categoryFromSrc(placeholderId);
  const seed = seedPrefix
    ? `${seedPrefix}:${media.src}:${media.kind}`
    : `${media.src}:${media.kind}:${media.alt}`;

  return (
    <ScenePlaceholder
      category={category}
      label={media.alt}
      aspect={aspect ?? ASPECT_BY_KIND[media.kind]}
      isVideo={media.type === "video"}
      active={active}
      seed={seed}
      className={className}
    />
  );
}
