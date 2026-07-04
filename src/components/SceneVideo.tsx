"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import {
  VIEW_W,
  VIEW_H,
  generateScene,
  categoryFromSrc,
  type SceneCategory,
  type SceneShape,
} from "@/lib/scene/generator";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { ASPECT_BY_KIND } from "./ScenePlaceholder";
import type { Media } from "../../content/work/types";

/**
 * The real-<video> counterpart to <ScenePlaceholder isVideo>. Kept in its
 * own file (rather than folded into ScenePlaceholder.tsx as a mode flag)
 * because it needs a client boundary — canvas + rAF + MediaStream are all
 * browser-only — while ScenePlaceholder.tsx stays Server-Component safe
 * per its own doc comment; adding "use client" there would force every
 * plain SVG-scene call site (the large majority of media slots on the
 * site) into the client bundle for no reason.
 *
 * §6.1's "video is grid-native" row needs a video cell that's genuinely
 * playing, not a static image styled to look like a video pending badge —
 * see DECISIONS.md's v3 Phase B section for why this exists and how it
 * was built given the sandbox has no ffmpeg/video-encoding tool and no
 * reachable stock-video source (same placeholder-strategy constraint
 * Phase A hit for images, see DECISIONS.md's "Placeholder media
 * strategy"). The approach: draw the exact same procedural, seed-
 * deterministic, five-token scene generateScene() already produces for
 * <ScenePlaceholder>, but onto a <canvas>, animate it with a slow,
 * ambient per-shape opacity drift, and feed the canvas's own
 * `captureStream()` MediaStream directly into a real <video>'s
 * `srcObject` — no encoded file exists anywhere, the browser is
 * genuinely decoding a live stream and painting real, changing frames
 * frame over frame. `autoplay`/`muted`/`playsinline` are real, load-
 * bearing attributes here (a MediaStream video won't play without
 * `muted` satisfying autoplay policy); `loop` is left on for markup/spec
 * compliance even though a live stream has no "end" to loop from.
 */

const CSS_VAR = /var\((--[a-z-]+)\)/;

// Hand-copied mirror of globals.css's five palette tokens, same
// disclaimer as GRID_ENGINE_BOOT_SCRIPT/APPEARANCE_BOOT_SCRIPT in
// DECISIONS.md: a canvas fillStyle can't resolve `var(--color-x)`
// through getComputedStyle reliably ahead of a style recalc, so this is
// the guaranteed-available fallback; the real, live custom-property value
// (picked up via getComputedStyle at draw time, so a future palette edit
// in globals.css is still respected) always wins when available.
const FALLBACK_HEX: Record<string, string> = {
  "--color-republic": "#1f1fff",
  "--color-republic-press": "#1414cc",
  "--color-ink": "#0a0a0a",
  "--color-paper": "#ffffff",
  "--color-smoke": "#8a8a93",
};

function resolveColor(token: string | undefined, cache: Map<string, string>): string {
  if (!token) return "transparent";
  const cached = cache.get(token);
  if (cached) return cached;
  const match = CSS_VAR.exec(token);
  let resolved = token;
  if (match) {
    const name = match[1];
    const live =
      typeof document !== "undefined"
        ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        : "";
    resolved = live || FALLBACK_HEX[name] || "#000000";
  }
  cache.set(token, resolved);
  return resolved;
}

function drawShape(ctx: CanvasRenderingContext2D, shape: SceneShape, cache: Map<string, string>, alphaMul: number) {
  const baseOpacity = "opacity" in shape && shape.opacity !== undefined ? shape.opacity : 1;
  ctx.globalAlpha = Math.max(0, Math.min(1, baseOpacity * alphaMul));

  switch (shape.el) {
    case "circle": {
      ctx.beginPath();
      ctx.arc(shape.cx, shape.cy, Math.max(shape.r, 0), 0, Math.PI * 2);
      if (shape.fill && shape.fill !== "none") {
        ctx.fillStyle = resolveColor(shape.fill, cache);
        ctx.fill();
      }
      if (shape.stroke) {
        ctx.strokeStyle = resolveColor(shape.stroke, cache);
        ctx.lineWidth = shape.strokeWidth ?? 1;
        ctx.stroke();
      }
      break;
    }
    case "rect": {
      ctx.fillStyle = resolveColor(shape.fill, cache);
      ctx.fillRect(shape.x, shape.y, Math.max(shape.w, 0), Math.max(shape.h, 0));
      break;
    }
    case "line": {
      ctx.strokeStyle = resolveColor(shape.stroke, cache);
      ctx.lineWidth = shape.strokeWidth ?? 1;
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
      break;
    }
    case "polyline": {
      const points = shape.points
        .trim()
        .split(/\s+/)
        .map((p) => p.split(",").map(Number) as [number, number]);
      ctx.beginPath();
      points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      if (shape.fill && shape.fill !== "none") {
        ctx.fillStyle = resolveColor(shape.fill, cache);
        ctx.fill();
      }
      ctx.strokeStyle = resolveColor(shape.stroke, cache);
      ctx.lineWidth = shape.strokeWidth ?? 1;
      ctx.stroke();
      break;
    }
    default:
      break;
  }
  ctx.globalAlpha = 1;
}

export interface SceneVideoProps {
  category: SceneCategory;
  label: string;
  aspect?: string;
  active?: boolean;
  seed?: string;
  showOverlay?: boolean;
  /** See the matching prop on <ScenePlaceholder> — a shorter visible
   * caption for repeated grid tiles; the full sentence stays the
   * accessible name and the caption's title tooltip either way. */
  overlayText?: string;
  /** Shorter visible text for the top-right "Procedural loop" badge, same
   * reasoning as `overlayText`. */
  badgeText?: string;
  className?: string;
}

/** Real-<video>, procedurally-animated placeholder loop. See file doc
 * comment for the full "why". Renders the same caption/badge treatment
 * as <ScenePlaceholder> (minus the "video pending" wording, since this
 * one is genuinely playing) so the two read as one system. */
export default function SceneVideo({
  category,
  label,
  aspect = "aspect-[16/9]",
  active = false,
  seed,
  showOverlay = true,
  overlayText,
  badgeText,
  className,
}: SceneVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const scale = 2; // crisper capture than the 400x300 viewBox alone
    canvas.width = VIEW_W * scale;
    canvas.height = VIEW_H * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const effectiveSeed = seed ?? label;
    const shapes = generateScene(category, effectiveSeed);
    const colorCache = new Map<string, string>();
    const reduced = prefersReducedMotion();
    const fps = reduced ? 2 : 12;

    let raf = 0;
    let stopped = false;
    const start = performance.now();

    function frame(now: number) {
      if (stopped || !ctx) return;
      const t = (now - start) / 1000;
      ctx.save();
      ctx.scale(scale, scale);
      ctx.fillStyle = resolveColor("var(--color-ink)", colorCache);
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      shapes.forEach((shape, i) => {
        // Slow, deterministic per-shape ambient drift — a gentle pulse,
        // not a scroll-linked or attention-grabbing effect. Amplitude is
        // halved under reduced motion rather than removed outright: this
        // is ambient background media (§4.6's entrance/stagger reduced-
        // motion rule targets UI transitions with a resolved end state,
        // which a looping background doesn't have) — see DECISIONS.md.
        const amp = reduced ? 0.08 : 0.18;
        const speed = reduced ? 0.15 : 0.35;
        // Ranges [1 - amp, 1] — a gentle dim/brighten pulse, never fully
        // hides a shape.
        const mul = 1 - amp * 0.5 * (1 - Math.sin(t * speed + i * 0.6));
        drawShape(ctx, shape, colorCache, mul);
      });
      ctx.restore();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    let stream: MediaStream | null = null;
    try {
      stream = canvas.captureStream(fps);
      video.srcObject = stream;
      video.play().catch(() => {
        // Autoplay can still be blocked by policy in some embedding
        // contexts even when muted; failing silently leaves a paused-but-
        // real <video> element rather than throwing.
      });
    } catch {
      // captureStream unsupported (very old browser) — canvas still
      // renders visually behind the (now sourceless) <video> via the
      // poster-less empty state; nothing to do beyond not crashing.
    }

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((tr) => tr.stop());
    };
  }, [category, label, seed]);

  const fullLabel = `PLACEHOLDER — REPLACE WITH ${label}`.toUpperCase();

  return (
    <div
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
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        aria-label={fullLabel}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {showOverlay && (
        <span className="mono-label absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-paper">
          {badgeText ?? "Procedural loop"}
        </span>
      )}

      {showOverlay && (
        <span
          className="mono-label absolute inset-x-0 bottom-0 line-clamp-2 bg-ink/70 px-3 py-2 text-paper"
          title={fullLabel}
        >
          {overlayText ?? fullLabel}
        </span>
      )}
    </div>
  );
}

/**
 * Convenience wrapper mirroring <CaseMedia> (ScenePlaceholder.tsx), for
 * call sites that already have a `Media` entry with `type: "video"` and
 * want the real, genuinely-playing <video> rendering instead of the
 * static SVG "video pending" badge treatment.
 */
export function CaseVideo({
  media,
  seedPrefix,
  aspect,
  active,
  className,
}: {
  media: Media;
  seedPrefix?: string;
  aspect?: string;
  active?: boolean;
  className?: string;
}) {
  const placeholderId = media.poster ?? media.src;
  const category = categoryFromSrc(placeholderId);
  const seed = seedPrefix
    ? `${seedPrefix}:${media.src}:${media.kind}`
    : `${media.src}:${media.kind}:${media.alt}`;

  return (
    <SceneVideo
      category={category}
      label={media.alt}
      aspect={aspect ?? ASPECT_BY_KIND[media.kind]}
      active={active}
      seed={seed}
      className={className}
    />
  );
}
