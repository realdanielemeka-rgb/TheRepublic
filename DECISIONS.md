# DECISIONS

Judgement calls made while building this site, where the spec was silent
or needed interpretation, plus the outstanding TODO punch-list from §2.

---

## Phase A — v2 rebuild foundation (this section)

Phase A of the v1→v2 rebuild (image/video-first, GSAP ScrollTrigger +
Lenis pinned sequences). Scope: Tailwind/theme foundation, the v2 case
content schema, the placeholder media system, per-case accent extraction,
and the Lenis+GSAP integration layer. Everything below this section, down
to "Judgement calls" (v1), documents the original type-led v1 build and
is kept for history — Phase B/C should treat *this* section as current.

### Placeholder media strategy — why procedural SVG, not photos

This sandbox's outbound network is allowlisted; `picsum.photos`,
`images.unsplash.com` and `source.unsplash.com` all fail at the proxy
(403/CONNECT tunnel failure), and there is no image-generation tool
available in this environment. The spec's placeholder policy ("source the
nearest visually-analogous stock or Claude-generated image") is therefore
not achievable as written — fetching or generating real imagery was not
attempted, on either count, anywhere in this phase.

Instead every media slot renders `<ScenePlaceholder>`
(`src/components/ScenePlaceholder.tsx`) — a deterministic, seed-driven,
flat-geometric SVG "scene" suggestive of the case's category (market-
stall shapes for the beverage case, radiating lines for the two
insurance/finance cases, a crowd-of-dots motif available for a future
culture/football case, etc. — see `src/lib/scene/generator.ts`), rendered
at generous size with a fine `feTurbulence` grain overlay, grayscale at
rest and revealing colour on hover/focus/scroll-active. Every shape fill
is one of the five §4.1 tokens (referenced as CSS custom properties), so
"colour" state can never introduce a forbidden hue — this was the whole
point of building it this way rather than reaching for a stock swap.
Every instance renders its own persistent "PLACEHOLDER — REPLACE WITH
…" caption (the component prepends that prefix; callers only supply what
the real asset should be) and video slots add a persistent "VIDEO
PENDING" badge — the labelling requirement is baked into the component,
not a manual step per usage site.

**The swap-in path for Phase B/C or a future asset pass is zero code
changes elsewhere**: `Media.src`/`Media.poster` are placeholder
identifiers today (`"placeholder:<category>"`, parsed by
`categoryFromSrc()`); pointing them at a real file path is a
content-only edit. `<ScenePlaceholder>`'s own props (`category`, `label`,
`aspect`, `isVideo`, `active`) don't change shape either way — a real
`<img>`/`<video>` component can be swapped in behind `<CaseMedia>`
(the `Media` → `ScenePlaceholder` convenience wrapper, also in
`ScenePlaceholder.tsx`) without touching any page that already calls
`<CaseMedia media={item} />`.

### Dev QA routes — kept, not deleted

`/dev/placeholders` (every `SceneCategory`, every `Media.kind`'s default
aspect ratio, the video badge, the externally-controlled `active` colour
state, two full cases run through `<CaseMedia>`, and every generated
accent-theme swatch) and `/dev/scroll-test` (the throwaway pin/scrub
element used to verify the Lenis+ScrollTrigger wiring, see below) were
**kept rather than deleted** after verification, gated behind
`src/app/dev/layout.tsx`, which calls `notFound()` whenever
`NODE_ENV === "production"` (true for both `next build` and Vercel's
build step) — confirmed in the actual build output: the prerendered
`/dev/*` routes carry `"status": 404` and an empty visible HTML body,
RSC-payload-in-`<script>` notwithstanding. `next dev` renders them
normally. `robots.ts` also disallows `/dev`, belt-and-braces since the
gate already 404s. Reasoning: Phase B is about to drop `<ScenePlaceholder>`
into every real media slot and build the first real pinned sections —
having a living, visual reference/regression check for both systems
seemed more useful than a clean diff. Delete either route if it turns out
not to earn its keep.

### Content schema v2 (§7)

`content/work/types.ts` now matches the spec's `Media`/`CaseStudy` shape
verbatim, plus one addition: a `MediaKind` named export (used by
`ScenePlaceholder.tsx`'s per-kind aspect-ratio defaults) and a `quote?`
field (never populated this phase — no quote was confirmed for any case,
so every case still omits it, consistent with the v1 "never fabricated"
rule carried forward). The schema's implicit "poster required if
`type === 'video'`" rule isn't just a comment: `content/work/index.ts`
runs `assertValidMedia()` over every case at module load, so a missing
poster fails `next build`/`next dev` immediately rather than shipping a
silently-broken video slot.

All eight seed cases got a full `media: Media[]` array (hero video +
poster, one wide, a gallery-pair of two, three carousel slides, one
ticker-chip — 8 entries each) with specific, non-generic `alt` text
grounded in that case's actual brief/idea copy. Category assignment
(one `SceneCategory` per case, feeding both the scene motif and the
accent hue):

| case | category | motif family |
|---|---|---|
| chivita-style-n-sips | `beverage` | market-stall |
| pzl-you-matter | `wellbeing` | concentric arcs |
| zenith-homecoming | `civic-journey` | route lines |
| twisco-everyday-hero | `household` | tile grid |
| cowbell-mumtales | `family` | soft blobs |
| i-invest-secure-the-bag | `finance-growth` | radiating lines (ascend) |
| sanlamallianz-live-with-confidence | `insurance` | radiating lines (fan) |
| heirs-insurance-launch | `launch` | burst rays |

`culture` (crowd-dots) and `generic` (tile grid) exist in
`SCENE_CATEGORIES` but aren't used by any seed case — available for a
future case or as a safe fallback (`categoryFromSrc()` falls back to
`generic` for an unrecognised identifier rather than throwing).
Per-`kind` aspect defaults (`ASPECT_BY_KIND` in `ScenePlaceholder.tsx`):
hero `21/9`, wide `16/9`, gallery-pair `4/5`, carousel `4/3`, ticker-chip
`1/1` — all overridable via `<CaseMedia aspect="…">` if Phase B's actual
layouts want something else; these are just sane defaults, not a rule
from the spec.

`content/work/*.ts` deliberately does **not** import from `src/lib/` or
`src/components/` — content stays data-only (matching the v1 convention
already in place: `content/site.ts` etc. have never imported application
code). `Media.src`/`poster` are plain string literals
(`"placeholder:beverage"`, etc.) rather than calling a `placeholderSrc()`
helper, even though that helper exists and would add compile-time
category validation — the tradeoff favoured keeping content/ dependency-
free over that safety net. A typo would silently fall back to `generic`
rather than fail the build; `/dev/placeholders`' full-catalogue render
was the mitigation actually used (visually confirms every category
string used across all eight cases resolves to the intended motif).

### Per-case accent theming (§4.6.6)

`<ThemeSection>` gained a fourth theme, `"accent"`, plus an optional
`accentColor` (hex) prop. When set, it's exposed as the CSS custom
property `--case-accent` and blended 18% into the ink base via
`color-mix(in oklch, var(--case-accent, var(--color-republic)) 18%,
var(--color-ink))` in `globals.css` — verified with Playwright by reading
each swatch's actual computed `background-color` (resolves to a distinct,
concrete `oklch(...)` value per case, not an unresolved/invalid
`color-mix()` string) and confirming `color: rgb(255,255,255)` (paper)
stays applied. Omitting `accentColor` falls back to Republic Blue so an
accent section can never render unstyled.

`scripts/extract-accent.mjs` generates the hex values. The spec's literal
instruction is to extract a dominant hue from each case's hero image via
`sharp`; since every case's media is currently a procedural placeholder
built from exactly five brand tokens (of which only Republic Blue carries
any hue — ink/paper/smoke are achromatic), literally sampling those
scenes would hand back "Republic Blue" for all eight cases, defeating
the purpose of *per-case* theming. This phase's brief explicitly
sanctioned the alternative it names: hash each case's slug to a
deterministic hue. The script does both halves properly rather than
taking a shortcut on either: it hashes the slug to a hue, renders a small
**flat-colour** (no gradients — §4.1) SVG swatch at that hue, and
actually rasterizes + pixel-averages it with `sharp` (`resize` + `raw()`
+ manual channel averaging) — so `sharp` is doing real decode/resample
work, not installed and left unused. The averaged colour is then clamped
— real WCAG relative-luminance/contrast-ratio math, not an assumption —
so that blended 18% into ink it still contrasts ≥ 4.5:1 (AA, normal
text) against paper; in this build all eight land between 14.5:1 and
18.9:1 unclamped (ink is dark enough that the 18% blend rarely needs to
move), but the clamp loop is real and runs every time.

The script discovers case slugs by scanning `content/work/*.ts` for
`slug: "…"` (plain text match, not a TypeScript import — see "why not
import content/ from a script" below) rather than a hardcoded list, so a
future case is picked up automatically the next time `npm run palette`
runs. Output: `content/accents.generated.json`, flat `{ slug: hex }`,
committed. Re-run (`npm run palette`) whenever a case is added, removed,
or renamed, and before every build, per §4.6.6.

*Why the script doesn't import `content/work/*.ts` directly*: it runs
under plain `node scripts/extract-accent.mjs`, not through Next's
TypeScript pipeline, and this repo's Node version support for executing
`.ts` directly isn't something worth depending on for a build script that
needs to run reliably in this sandbox, in CI, and on Vercel. Text-scanning
for `slug: "…"` gets the one piece of information the script actually
needs with zero module-system coupling.

### Lenis + ScrollTrigger wiring — the highest-risk item this phase

`src/components/SmoothScroll.tsx` was rebuilt around the documented
"GSAP ticker drives Lenis" pattern (the brief's other sanctioned option,
`ScrollTrigger.scrollerProxy`, exists specifically for a *custom, non-
window* scroll container — Lenis here scrolls the default window/
document, exactly what ScrollTrigger already measures by default, so
scrollerProxy would be solving a problem this setup doesn't have):

1. `gsap.registerPlugin(ScrollTrigger)` once, at module scope.
2. `new Lenis({ lerp: 0.1, autoRaf: false })` — `autoRaf: false` because
   GSAP's ticker drives `lenis.raf()` instead of Lenis's own rAF loop.
3. `gsap.ticker.add((time) => lenis.raf(time * 1000))` — ticker time is
   seconds, Lenis wants ms.
4. `gsap.ticker.lagSmoothing(0)` — disables GSAP's default "catch up
   after a long frame" behaviour, which would otherwise step GSAP's clock
   and Lenis's clock out of lockstep.
5. `lenis.on('scroll', ScrollTrigger.update)` — the moment Lenis moves
   the real scroll position, ScrollTrigger re-measures immediately rather
   than waiting for its own scroll listener on a possibly-different tick.
6. `ScrollTrigger.refresh()` on every route change (`usePathname()`
   effect) — a Next.js-App-Router-specific addition beyond the base
   pattern: client-side navigations don't reload the page, so a
   ScrollTrigger measured against one page's layout goes stale the
   instant a differently-sized page mounts in its place. No-op when
   nothing is pinned yet.
7. Both effects tear down cleanly (`gsap.ticker.remove`, `lenis.destroy()`)
   on unmount, though in practice `SmoothScroll` lives in the root layout
   and doesn't unmount across navigations.

**Verification** (not just "it compiles"): a throwaway pinned+scrubbed
element at `/dev/scroll-test` (pins for 100vh, scales 1→1.5, scrub tied
to scroll) was driven with Playwright (`chromium` at
`/opt/pw-browsers/chromium`) — scrolled to 7 marked positions plus a
13-sample fine sweep through the pin's scrub range, reading the box's
actual computed `transform` and an on-page GSAP `onUpdate`-driven
progress readout at each step, and screenshotted at several of them.
Results: scale progressed **strictly monotonically** (1.0 → 1.5 across
the fine sweep, no regression at any of the 13 samples), the box's
bounding-rect stayed pinned near the top of the viewport throughout the
scrub range then released and scrolled normally (`boxTop` went negative)
immediately after progress hit 1.0 — exactly the expected pin/release
behaviour, not jitter or desync. Only console error during the whole
session was an unrelated font-fetch `ERR_TUNNEL_CONNECTION_FAILED` (this
sandbox's network policy again — `next/font/google` trying to reach
Google's font CDN; pre-existing, not introduced by this phase, and
`next build` completed with no errors regardless).

**API surface for Phase B** — every real pinned section (work strip,
etc.) should follow the exact pattern demonstrated at
`src/app/dev/scroll-test/page.tsx`:

```tsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger"; // default export, not named
import { prefersReducedMotion } from "@/lib/reducedMotion";

export default function PinnedSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // no pin, no scrub, full stop
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: true,
        // ...
      });
    });
    return () => ctx.revert(); // kills the ScrollTrigger + any tweens together
  }, []);

  return <div ref={ref}>…</div>;
}
```

Don't create a second Lenis instance or a second rAF loop anywhere else —
`SmoothScroll.tsx` (mounted once, in `layout.tsx`) already owns both; a
section component only ever needs to create its own `ScrollTrigger`.

### Reduced motion — two hooks, deliberately not one

`src/lib/reducedMotion.ts` exports `prefersReducedMotion()` (a plain,
SSR-safe, one-shot check — call it inside any `useEffect`/GSAP setup
function, exactly as `SmoothScroll.tsx` and the pattern above do) and
`usePrefersReducedMotion()` (a `useSyncExternalStore`-based hook for
render-time/JSX use, reactive to the OS setting changing mid-session).

This is intentionally separate from `useReducedMotion` already exported
by `motion/react`, which `Reveal.tsx`/`Preloader.tsx`/`BracketFill.tsx`
already use for Motion's own component-level transitions and should keep
using unchanged. Rule of thumb: **Motion (fade/slide-in variants) →
`motion/react`'s `useReducedMotion`. Anything Lenis/GSAP/ScrollTrigger →
`@/lib/reducedMotion`.** Two differently-named tools rather than one
shared one, specifically so autocomplete can't silently pull in the wrong
one for the wrong system.

(Aside: the first draft of both `usePrefersReducedMotion()` and the
`/dev/scroll-test` HUD used plain `useState` + `setState` inside
`useEffect` to sync from `matchMedia`. `eslint-plugin-react-hooks`'s
`set-state-in-effect` rule — enabled by default in this repo's Next 16 /
React 19.2 setup — correctly flags that as the wrong tool;
`useSyncExternalStore` is what React ships specifically for subscribing
to external, mutable, non-React state like a `MediaQueryList` without an
SSR/hydration mismatch, so that's what shipped instead.)

### Other judgement calls this phase

- **GSAP import path**: `import ScrollTrigger from "gsap/ScrollTrigger"`
  — a **default** import. `gsap/ScrollTrigger` ships no named export;
  `import { ScrollTrigger } from "gsap/ScrollTrigger"` will not compile.
  Confirmed empirically against this repo's installed `gsap@3.15.0` and
  `tsconfig.json` (`moduleResolution: "bundler"`) before writing
  `SmoothScroll.tsx`, not assumed from memory — this Next.js's own
  AGENTS.md warns training-data conventions can be stale here, and GSAP's
  own export shape isn't immune to that same caution.
- **`@gsap/react`**: not installed. Plain `useEffect` + `gsap.context()` +
  manual `.revert()` cleanup (as shown above) covers everything this
  phase and the documented Phase B pattern need without another
  dependency.
- **`embla-carousel-react`**: installed per §3/step 5 only — no carousel
  UI was built this phase; that's Phase C's case-page work.
- **Tailwind v4 tokens/fonts**: audited against §4.1/§4.2 and left
  unchanged — palette hex values, Space Mono/Inter setup via `next/font/
  google`, `.display-type`/`.mono-label`/`.measure` utility classes all
  already matched spec exactly from the v1 build. `<Bracket>` likewise
  audited against §4.3's four listed usages (hero headline, eyebrows,
  case-card hover caption, CTA band) and found already correct — the CTA
  band renders its brackets as literal `[ REPUBLIC ]` text rather than
  through the `<Bracket>` component, which is visually identical and left
  alone rather than force-refactored for componentisation purity alone.
- **`results: []` / no `quote`** kept on all eight cases — no numeric
  result or confirmed quote exists for any case yet; fabricating either
  would violate the standing "never fabricated" rule from the v1 section
  below. Unchanged from v1 other than the schema addition.

### Handoff to Phase B

- Drop `<CaseMedia media={item} seedPrefix={case.slug} />` into any real
  case-media slot — it resolves category/aspect/video-badge automatically
  from the `Media` object; `<ScenePlaceholder>` directly if you need a
  one-off (e.g. a non-case decorative slot) outside a `CaseStudy.media[]`
  array.
- Any new pinned/scrubbed section: copy the pattern at
  `src/app/dev/scroll-test/page.tsx` (reproduced above) — gate on
  `prefersReducedMotion()` from `@/lib/reducedMotion`, scope GSAP setup in
  `gsap.context()`, don't create a second Lenis instance.
- Case-study hero backgrounds: `<ThemeSection theme="accent"
  accentColor={accents[caseSlug]}>` where `accents` is
  `content/accents.generated.json` — re-run `npm run palette` first if a
  case was touched since the file was last generated.
- `/dev/placeholders` and `/dev/scroll-test` are there for visual QA
  against both systems — delete either if it stops earning its keep.

## Phase B — global components + four signature interactions (this section)

Scope: §11 build order steps 5 (global components) and 7 (the four
signature scroll/hover interactions), built as standalone, reusable,
Playwright-verified components. Phase C wires real content into
`<WorkStrip>`/`<HoverReveal>`/`<ServiceSwap>` on real pages; everything in
this section is the component layer underneath that.

### Safe media sourcing for global chrome (Preloader, Marquee)

Phase A's hard rule — "pending never renders publicly," enforced by
`content/work/index.ts` only exporting live-filtered accessors — was
written with page-scoped content in mind (a case-study page, a work-index
card). Preloader and Marquee are different: both are mounted globally
(Preloader in the root layout; Marquee already on Home) and would, if
naively wired to any of the eight seed cases' real media, ship
pending-case `alt` text (client name + specific campaign narrative, e.g.
"Chivita hero film — creator styling an outfit around a bottle of
Chivita, Style N Sips title card") into every page's initial HTML from day
one — not a hypothetical, since all eight seeds are still
`pending-approval` today. That's a materially different exposure than a
scroll-past visual: it's confidential campaign narrative in the literal
page source on every route, permanently, regardless of approval status.
(Client *names* themselves aren't the sensitive part — they're already
public in `content/clients.ts`'s "Trusted by" strip; it's the specific
unapproved campaign idea/title text that shouldn't ship early.)

Fix: `content/work/index.ts` gained `getFeaturedMedia(kind?)`, built on the
existing `getFeaturedCases()` (so it inherits the live-filter guarantee
automatically — not a new access path around the rule) and returns `[]`
today, same as `getFeaturedCases()` itself. `Preloader`/`Marquee` both
accept this as an optional prop and pad out to a full frame/chip count with
**content-agnostic fallback categories** (module-level constants, not
imported from `content/work`) whenever fewer real items are supplied than
needed — the same "swap-in path is zero code changes" pattern Phase A used
for placeholder media generally. Once any case goes live, its real,
now-safe-to-show media flows through automatically with no code change on
either component.

One more layer specific to Preloader: even the *live-sourced* portion never
shows the real per-case `alt` text as the frame's caption — every flash
frame uses one fixed, neutral label ("Republic — loading") regardless of
source. Two independent reasons make this correct even once real cases are
live, not just a confidentiality workaround: a ~50ms flash is not a
caption-reading moment (a real descriptive string flickering past
unreadably 12 times is noise, not information), and it keeps every frame
visually consistent regardless of how many real vs. fallback frames happen
to be available. Marquee's real chips, by contrast, *do* show their real
`alt` caption (via `<CaseMedia>` directly) — safe once sourced only from
`getFeaturedMedia()`, and legible at a ticker-chip's slower, always-visible
pace, unlike the preloader's flash.

### §4.6.7 — mix-blend-difference hover (`MixBlendHover.tsx`)

The spec describes a Republic Blue block scaling `scaleY(0)→scaleY(1)`
with `mix-blend-mode: difference`, "inverting text/background beneath."
The literal reading — put the blend mode *on the block* — doesn't produce
that: a blend-mode block with nothing yet painted behind it (before the
label, in an isolated or non-isolated stack) just renders as a flat blue
rectangle, with the normally-coloured label sitting unaffected on top. The
"inverting" look requires the **label** to carry `mix-blend-mode:
difference`, with the block as a plain, unblended, solid-colour fill
painted *before* it — so the label differences against whatever's directly
beneath it at each moment: the page background at rest (grayscale-0 →
"none" effectively, text renders in its own colour), or the Republic Blue
block once it scales up over that same area.

This turned out to compose for free with Nav's *existing* v1 mechanism:
nav text already had `mix-blend-difference text-paper` so the fixed bar
auto-contrasts against whatever `ThemeSection` colour is scrolled beneath
it (no opaque nav background needed). That's the same "text differences
against whatever's behind it" primitive, just with nothing else controlling
what's behind it. `MixBlendHover` slots a Republic Blue block into that gap
specifically for the hovered/focused word — no `isolation: isolate`
needed (isolating would make the block blend against a transparent local
canvas instead of the label, breaking the effect), no conflict with the
pre-existing legibility behaviour (block `scale-y-0` at rest is invisible,
so idle-state auto-contrast is untouched).

Applied to: the four Nav links, Nav's Start-a-project button (desktop +
mobile overlay), and CtaBand's "Start a project →" button — chosen as the
"one primary CTA per page" slot because CtaBand is the page-closing
conversion moment on every page that includes it, a natural single
"primary" per render. Nowhere else — standard hover states (opacity,
`hover:bg-republic-press`, etc.) stay standard, per the "don't spread this
everywhere" instruction.

No `prefersReducedMotion()` gate on this component specifically: it's a
plain CSS `transform` transition, already collapsed to ~0ms by the
sitewide `@media (prefers-reduced-motion: reduce)` rule already in
`globals.css` (Phase A). The hover *state change* still applies under
reduced motion (block still appears, text still inverts), just without the
animated interpolation — correct treatment for a hover microinteraction,
and per DECISIONS.md's own tooling boundary, `@/lib/reducedMotion` is
reserved for Lenis/GSAP/ScrollTrigger work, which this isn't. Verified in
Playwright by reading the block's computed `transition-duration` under
`page.emulateMedia({reducedMotion:'reduce'})` (≈1e-6s) and confirming the
scale state still flips on hover.

**Tailwind v4 gotcha hit while verifying this**: `scale-y-0` /
`group-hover:scale-y-100` compile to the CSS **`scale`** property (a
`translate`/`scale`/`rotate` split, not the legacy `transform: scale()`
function) — `getComputedStyle(el).transform` reads back `"none"`
regardless of state; the live value is on `getComputedStyle(el).scale`
(`"1 0"` at rest → `"1"` on hover). GSAP's own `gsap.set(el, {scale})`,
used later in WorkStrip, does the *opposite*: it still composes into the
legacy `transform: matrix(...)` property, not the new one. Two different
systems, two different CSS properties, same-looking API — worth knowing
before debugging either by reading computed styles.

### §4.6.1 — Preloader rebuild (`Preloader.tsx`)

Full rebuild per spec: 12-frame bracket flash-reveal (`FRAME_INTERVAL_MS ×
FRAME_COUNT` = 600ms) → wordmark hold (250ms) → brackets slide apart + fade
exit (300ms) = 1150ms, under the ≤1.2s ceiling (asserted at module load —
`TOTAL_MS > 1200` throws — so a future tuning change that blows the budget
fails the build instead of silently shipping). Frames render via
`<ScenePlaceholder>` pre-mounted and stacked (opacity-toggled, no
transition on the toggle itself — a hard cut is the correct read for
"flash-reveal") rather than mounted/unmounted per frame, avoiding repeated
SVG-filter compute mid-sequence.

Reduced motion: skips straight to the wordmark phase (the "flashing" phase
is never scheduled at all under reduced motion, not sped up), holds
briefly, then a **plain opacity fade only** — no bracket-slide translate,
since that's exactly the kind of transform-based motion reduced-motion
users asked to avoid (mirrors `Reveal.tsx` substituting an opacity-only
fade for its own `y` translate). ≤400ms fade budget, ~600ms total —
verified in Playwright by asserting the `"flashing"` phase is never
observed and the sequence completes well under the full-sequence budget.

Uses `motion/react`'s `useReducedMotion()` (one-shot, resolved
synchronously via `useState(prefersReducedMotion.current)` — confirmed by
reading the installed package source, not assumed — so no transient-null
double-effect risk), matching the existing convention that Motion
component-level transitions use that hook while GSAP/ScrollTrigger work
uses `@/lib/reducedMotion`.

**Strict Mode safety**: this repo's Next 16 App Router defaults
`reactStrictMode: true` (confirmed against the installed docs, not
assumed), so `next dev` double-invokes effects (mount → cleanup → mount).
The session-gate write (`sessionStorage.setItem`) is deferred inside a
`setTimeout(..., 0)` rather than called synchronously in the effect body,
so the throwaway first Strict Mode pass gets cancelled by its own cleanup
before it can mark the session "seen" — otherwise the *real* second mount
would silently find the session already marked and never show the
preloader at all in local dev. (v1's Preloader had the same
synchronous-`sessionStorage.setItem` shape and was very likely affected by
this in `next dev`, though harmless in production, where Strict Mode's
double-invoke doesn't happen; not treated as a bug to fix in the old file
since this phase supersedes it entirely.)

### CaseCard — CaseMedia swap, shared `resultLine()`, a11y fix

Swapped the static v1 `<Placeholder>` for `<CaseMedia media={item.media[0]}
seedPrefix={item.slug} />` — `media[0]` is consistently the hero
video+poster entry across all eight seeds, i.e. the "muted looping
preview" slot once real video lands. The bracket-fill result-stat reveal
was already correctly built in v1 (empty-looking brackets at rest via
`.bracket-fill{opacity:0}`, filling on `.group:hover`) — no structural
change needed there, just reuse.

Extracted the fallback-stat logic (`results[0]?.value && …label ? … :
"Results under NDA — ask us"`) out of CaseCard into `resultLine()` in
`content/work/index.ts`, since WorkStrip's caption bar needs the exact same
logic and duplicating it would let the two drift.

Found and fixed a real, pre-existing accessibility gap while wiring this:
`.bracket-fill`'s reveal rule in `globals.css` only had `:hover` variants
(`*:hover > .bracket-fill`, `.group:hover .bracket-fill`) — no
`:focus-within` — so a keyboard-only user tabbing to a CaseCard got the
media's colour reveal (which already had `focus-within` coverage via
ScenePlaceholder) but never saw the result-stat caption. Added
`*:focus-within > .bracket-fill` / `.group:focus-within .bracket-fill`
alongside the existing hover rules. Verified in Playwright: focusing a
CaseCard via `.focus()` (no mouse) now reveals the caption exactly like
hovering does.

### §4.6.2 — WorkStrip (`WorkStrip.tsx`)

**API**: `<WorkStrip cases={CaseStudy[]} className? />`. Renders nothing
for an empty array — Phase C keeps the empty-state decision (the
"CASES IN REVIEW" bracket fallback) at the call site, same as the existing
pattern around `getFeaturedCases()` elsewhere, rather than WorkStrip
inventing its own.

**Structural, not just visual, mobile/desktop split**: `<ResponsiveStrip>`
picks between `<PinnedStrip>` (GSAP `pin:true, scrub:true`) and
`<MobileCarousel>` (Embla) using a real `matchMedia` check
(`useMediaQuery("(min-width: 768px)")`, a new small hook in
`src/lib/useMediaQuery.ts`, same `useSyncExternalStore` pattern as
`usePrefersReducedMotion`) — only one of the two ever *mounts*. This is
deliberately stronger than a `hidden md:block` CSS class: it structurally
guarantees zero ScrollTrigger pin exists in the DOM below 768px, which is
what "verify it actually degrades correctly on a 360px viewport, not just
via a media query you assume works" (§4.5) is really asking for — I
verified this by asserting the pinned strip's `data-testid` has *zero*
matches in the DOM at 360px, not just that it's visually hidden.
`useMediaQuery`'s SSR/first-paint default is `false` (assume the narrower
variant) — a deliberate progressive-enhancement choice: better to
under-promise (plain carousel) for one frame than SSR a 250vh GSAP-pinned
layout before the client confirms the real viewport.

**Pin pattern**: follows the `/dev/scroll-test` reference exactly — `h-screen`
trigger (not a manually-tall wrapper), `end: "+=150%"` (giving ~250vh
total scrub range via GSAP's own pin-spacer, matching the spec's "~250vh
pinned container" as the *effective* scroll-through distance without
hand-rolling the spacer), `pin: true`, `scrub: true`, torn down via
`ctx.revert()`. One addition beyond the reference pattern:
`invalidateOnRefresh: true` plus a **function-based** tween target (`x: ()
=> -Math.max(track.scrollWidth - window.innerWidth, 0)` instead of a
pre-computed literal) — without this, a window resize mid-session (GSAP's
own `ScrollTrigger.refresh()` on resize) would re-measure the pin's
start/end but keep scrubbing toward a stale horizontal distance. Small
addition, meaningfully more robust, same underlying GSAP mechanism.

**Scale/dim math**: driven entirely inside the `ScrollTrigger`'s own
`onUpdate` — for each item, `distance` from viewport centre → `closeness =
gsap.utils.clamp(0,1, 1 - distance/(innerWidth*0.6))` → `gsap.utils.
interpolate(0.85, 1.1, closeness)` for scale, `interpolate(0.55, 1,
closeness)` for opacity — applied via `gsap.set()` directly on each item's
DOM node (imperative, no React re-render per tick: this is the part that
genuinely runs every scrub frame, so it has to bypass React state).
Verified empirically: readings at one scroll sample showed a clean
`[0.85, 0.85, 0.888, 0.998, 1.093, 0.983, 0.873, 0.85]` bell curve across 8
items — smooth, centred, no discontinuities.

The *discrete* "which item is active" signal (drives each item's
`<CaseMedia active>` colour state and the caption bar's cross-fade) is
kept separate and cheap: a plain `useState` updated only when the nearest
index actually changes (guarded by a closure variable, not a dependency),
so React only re-renders ~6-8 times across the whole scrub, not every
frame. Caption bar cross-fades via a stacked-absolute + conditional-opacity
pattern (plain CSS transition, not GSAP — it only changes a handful of
times, no need for the imperative path).

**Reduced motion**: static CSS grid, no pin, no Embla — and, per the same
"reduced motion removes the interaction *requirement*, not just animation"
principle applied consistently across all three interactive components
this phase (see ServiceSwap below), every tile's `<CaseMedia active>` is
forced true rather than left hover-gated, so the fallback needs zero
interaction to see anything.

**Re-verified Lenis+ScrollTrigger jitter-free with a real pinned section on
top of it** (not just Phase A's throwaway box): 13 fine-grained scroll
samples through the WorkStrip's full pin range at `/dev/work-strip` read
the section's `boundingClientRect().top` at every step — **0px deviation
at every single sample** (vs. Phase A's own throwaway test, which held
"within" a small tolerance). Also re-ran Phase A's original
`/dev/scroll-test` sweep as a regression check: progress still strictly
monotonic 0→0.91 across 13 samples, no jitter — confirms nothing about the
base `SmoothScroll.tsx` wiring was disturbed (it wasn't touched).

### §4.6.3 — HoverReveal (`HoverReveal.tsx`)

**API**: default export `<HoverReveal word={string} image={{category,
label, seed?}} anchor?="above"|"below"|"auto" />` — the atomic, single-word
hover-popover unit, matching the task's literal `<HoverReveal word image>`
signature. Named export `<HoverRevealText text={string} terms={Record<
string, HoverRevealImage>} paragraphClassName? />` — the "rich-text-ish"
orchestrator: tokenises `text` on whole-word/phrase matches against
`terms`' keys (case-insensitive, regex-escaped, `\b`-bounded) and wraps
each match in `<HoverReveal>`, leaving everything else as plain text.
`image` is a lightweight `{category, label, seed?}` shape (ScenePlaceholder's
own prop needs) rather than a full case `Media` object — manifesto copy
isn't case content, so this stays decoupled from `content/work/types`.

Real `<button>` as the trigger (not a styled `<span>`): gets hover, tap
(a tap both focuses *and* clicks), and keyboard (`Tab` + native `:focus`)
reveal semantics from one set of CSS rules with no separate touch-state to
manage. Deliberately `:focus` rather than `:focus-visible` for the reveal
— `:focus-visible`'s "was this keyboard navigation" heuristic isn't
guaranteed to fire for a tap in every browser, and reliable mobile tap
support was an explicit requirement.

**`anchor="auto"`**: measures `getBoundingClientRect().top` against a fixed
`POPOVER_HEIGHT_ESTIMATE_PX` (220) on hover/focus start (one-time per
hover, not continuous — cheap). Verified both branches in Playwright: a
word with room above opens above; the same component scrolled so its word
sits ~150-190px from the viewport top (comfortably below the 76px fixed
Nav, so the cursor is actually over the word and not the Nav sitting on
top of it — an early version of this test scrolled the word *under* the
Nav and got a false "not hovering" reading) flips to open below.

**Reduced motion — two different granularities, deliberately**:
`HoverRevealText`'s reduced branch collects every referenced image into
one row *below the whole paragraph*, each labelled with its trigger word —
reads far better for a multi-term paragraph than several images breaking
up the sentence inline. The standalone `<HoverReveal>` component,
independently reduced-motion-aware (checked with its own
`usePrefersReducedMotion()` call, not just delegated to by the
orchestrator, so it's correct even used on its own), instead renders its
one image immediately inline after its one word — no paragraph-level
"collect them all" concept applies at that scope. Both fallbacks force
`active` on their placeholder media (full colour, no hover-gating) — see
the cross-component reduced-motion principle noted under ServiceSwap.

### §4.6.4 — ServiceSwap (`ServiceSwap.tsx`)

**API**: `<ServiceSwap services={{index, title, oneLiner?, image:
{category, label, seed?}}[]} className? />`. Sticky media frame (`sm:
sticky sm:top-28`) on one side, `<ol>` of plain `<button type="button">`
service names on the other — not `<Link>`, since this component's job is
the hover/tap↔media relationship, not routing; Phase C wraps/extends for
navigation if a service name should also link somewhere. `onMouseEnter` +
`onFocus` + `onClick` all set the same `activeIndex`, covering desktop
hover, keyboard tab, and mobile tap with one state variable. Cross-fade is
a stacked-absolute + `opacity-0/100` + `duration-200` (200ms, inside the
150-200ms band) — verified via computed `transitionDuration === "0.2s"`
and confirming exactly one frame is opaque at a time (a clean swap, not an
additive stack).

**Reduced motion — the "your call, document which you chose" decision**:
chose **stack each service with its image inline instead of sticky**, not
"instant cut, no dimming, still sticky." Reasoning: the instant-cut variant
still requires a hover/tap to ever see five of the six images — it removes
the *animation* but not the *interaction dependency*. Stacking removes
both, which is the stronger and more consistent reduced-motion guarantee,
and mirrors the same choice made for HoverReveal's fallback (collect
everything, require zero interaction). Verified: `.sticky`-equivalent
`data-testid` has zero matches in this branch, no element carries the
`opacity-40` dimming class (dimming is an interactive-only concept, not
carried into the static layout), and every one of the six images is
present with `opacity: 1` unconditionally.

**Cross-component reduced-motion principle** (applies to WorkStrip's
static grid, both HoverReveal fallbacks, and ServiceSwap's stacked
layout): each forces its placeholder media's `active`/colour state on,
rather than leaving it hover-gated. The grayscale→colour transition itself
is a plain CSS `filter` transition already collapsed to ~0ms sitewide
under reduced motion, so leaving it hover-gated wouldn't violate the
letter of "no animation" — but these four fallbacks are specifically about
removing the *interaction requirement* to see content, and a placeholder
that stays perpetually desaturated for a user who never happens to hover
it (a real scenario for keyboard/switch users navigating a *statically
laid-out* fallback with no obvious single "focus everything" gesture) cuts
against that goal. Applied consistently rather than decided per-component.

### `usePrefersReducedMotion()` used beyond GSAP/Lenis

Phase A's rule of thumb was framed as a binary: Motion-component
transitions → `motion/react`'s hook; GSAP/Lenis/ScrollTrigger →
`@/lib/reducedMotion`. HoverReveal and ServiceSwap are neither — plain
CSS/React-conditional components with no animation library involved at
all, but still needing a *reactive* signal to pick between two
structurally different render trees (not just gate an animation's
duration). `@/lib/reducedMotion`'s hook (SSR-safe, `useSyncExternalStore`-
based, genuinely reactive to a mid-session OS change) is the better
technical fit than reaching for `motion/react` just for its reduced-motion
hook when nothing else in the component uses Motion. Refined rule going
forward: **`<motion.*>` component transitions → `motion/react`'s hook;
any other reactive/structural reduced-motion branch (GSAP or not) →
`@/lib/reducedMotion`'s hook.** Flagging this explicitly since it extends
rather than strictly follows Phase A's stated boundary — worth a second
look from Daniel/Phase C if the narrower reading was intentional.

### Known, pre-existing, not-fixed-this-phase: trig-precision hydration mismatch in `generator.ts`

While Playwright-testing `/dev/work-strip` (which renders far more
`<ScenePlaceholder>` instances per page than any existing route), React
logged a hydration mismatch for one specific instance (Sanlam Allianz's
hero media, `category="insurance"`): an SVG line's `y2` differed between
server and client HTML by `2×10⁻¹⁴` — the 14th decimal place, sub-pixel
by many orders of magnitude, not visible, not crashing (React just keeps
the client value going forward, exactly its documented recovery
behaviour). Root cause, confirmed by inspection: `radiatingLines(...,
"fan")` (category `insurance`) and `burstRays` (category `launch`) — the
only two motif generators using `Math.cos`/`Math.sin` — feed a
deterministically-seeded angle through a transcendental function, and
`Math.sin`/`Math.cos` are *not* required by the ECMAScript spec to be
bit-identical across JS engines/builds (unlike `+ - * /`, which are
exact); Node's V8 and the specific Chromium build Playwright launches can
disagree in the very last bit for some inputs. This is a latent
characteristic of `src/lib/scene/generator.ts` as Phase A wrote it (that
file's own `createRng`/`mulberry32` seeding is itself perfectly
deterministic — the divergence is entirely downstream, in `Math.cos`/
`Math.sin` specifically), not something introduced this phase — confirmed
by testing that it does **not** reproduce on the current production
`/` (0 hydration errors) or on Phase A's own pre-existing
`/dev/placeholders` (also 0) with today's actual content; it only shows up
via specific seeds that happen to land near a precision boundary, which my
new routes' much higher render volume (all 8 cases × 8 media items, plus
WorkStrip/Marquee/Preloader's own instances) had enough surface area to
hit. `generator.ts` is explicitly out of this phase's scope ("verified
working, don't rebuild these") and the practical impact today is a
dev-console-only warning, not a user-visible or build-breaking defect, so
it wasn't fixed here. Flagged for a future pass: rounding computed
coordinates (e.g. `Math.cos(angle) * len`) to a fixed decimal precision
before they reach JSX would eliminate the class of bug entirely, since any
last-bit engine disagreement would round away identically on both sides.

### Dev QA routes added this phase

`/dev/work-strip`, `/dev/hover-reveal`, `/dev/service-swap` — one per
signature interaction that has no real page to mount on yet, same
production-404 gate as Phase A's `/dev/placeholders`/`/dev/scroll-test`
(`src/app/dev/layout.tsx`, unchanged) — confirmed all three 404 in a real
`next build && next start`. `/dev/work-strip` also carries a small
"CaseCard QA" section, since CaseCard isn't reachable from any live route
today either (zero cases are `status: 'live'`, so Home/`/work` both render
their empty state instead of any `<CaseCard>`) — same precedent as
`/dev/placeholders` importing individual case files directly for QA
purposes, safe because none of these routes ship to production.
**Recommendation for Phase C**: keep all five `/dev/*` routes as living
regression/QA harnesses through the pages build-out (cheap to keep, same
reasoning Phase A gave for its own two) — delete individually once a route
stops earning its keep (e.g. once WorkStrip is live on Home with real
data, `/dev/work-strip`'s pinned-strip section is redundant, though the
CaseCard QA sub-section may still be useful until at least one case goes
live).

### Other judgement calls this phase

- **`resultLine()`** moved to `content/work/index.ts` (shared by CaseCard
  and WorkStrip) rather than duplicated — copy unchanged from v1
  ("Results under NDA — ask us"), not updated to match this task's
  shorthand mention of "Results under NDA" verbatim, since that mention
  was describing the existing fallback *concept* DECISIONS.md already
  documents, not new copy.
- **Marquee's chip-splitting delimiter** loosened from an exact `" — "`
  match to `text.split("—").map(s=>s.trim()).filter(Boolean)` — more
  robust to incidental whitespace differences in a `text` prop, same
  practical result against every existing caller's copy.
- **GSAP `scale`/`opacity` reads in tests must use `getComputedStyle(el).
  transform`, not `.scale`** (see the Tailwind-vs-GSAP note under
  §4.6.7 above) — noted here too since it affects anyone writing further
  Playwright coverage against WorkStrip specifically.

## Judgement calls (v1)

- **Zero live cases, empty-state handling.** All eight seed case studies
  ship with `status: 'pending-approval'`, per the corrected instructions in
  §7. `content/work/index.ts` exposes `getLiveCases`/`getFeaturedCases`/
  `getLiveCaseBySlug`/`getLiveCasesByService` as the *only* sanctioned way
  to read cases on public routes — nothing imports the raw case array
  directly. Home's "Work that recruits" section and `/work` both render a
  bracket-framed "CASES IN REVIEW" empty state rather than showing zero
  content or faking a `live` status. `/work/[slug]` has no static params
  today (all eight are pending), so no case URLs resolve until at least
  one case is approved — that's intentional per the "pending never renders
  publicly" rule, not a bug.
- **Leadership bios.** Ola Olowu and Daniel Emeka's ~100-word bios in
  `content/team.ts` were written from the brief's known facts (heritage
  work, co-founding narrative, MD's platform/engineering angle) to match
  the "boardroom-grade" tone. Flagged for Daniel's review before deploy —
  no invented metrics or client claims were used, only directional
  professional framing.
- **Wider team roster.** No real team roster was supplied, so six
  placeholder names/roles were seeded in `content/team.ts` (clearly a
  TODO) so the team grid renders as designed. Swap or delete freely — the
  page reads from this file only.
- **Social links.** `content/site.ts` ships `socials: []` — no placeholder
  URLs, per the "hide any icon without a confirmed URL" rule. Footer
  renders nothing in that slot until real handles land.
- **Case media/team photography/client logos.** All rendered via the
  `<Placeholder>` (blue/ink field + mono label) and `<Avatar>`
  (initial-monogram on Republic Blue) components rather than any stock or
  generated imagery, per §4.4 and the forbidden-list (no AI portraits,
  no stock icons).
- **Reaction Standard laws.** Two seeded as `status: 'live'` (Provoke,
  don't observe / Participation is the format), four slotted as
  `status: 'pending'` and rendered as locked `[ LAW PENDING ]` cards on
  both Home and Studio, per §2/§6.3.
- **Kigali footprint.** `flags.showKigali` is `false`; the Kigali block in
  `content/site.ts` exists but is only rendered on `/studio` when the flag
  flips true.
- **AI-native case link.** `aiNativeCallout.caseSlug` is `null` — the
  callout copy renders on `/services` but the "see the case" link stays
  hidden until a real case clears approval, per the status-gate
  instruction in §6.4.
- **Contact form → email.** `src/app/api/contact/route.ts` uses Resend
  when `RESEND_API_KEY` is set; otherwise it returns a `fallback: true`
  payload with a prefilled `mailto:` link, which `ContactForm.tsx`
  redirects to client-side. No environment in this build has the key set,
  so the fallback path is what ships today — confirmed working.
- **Footer copyright string.** Rendered as the literal
  "© 2026 The Republic. Lagos." per §9, rather than a dynamically computed
  year, since the spec gives an exact string.
- **Preloader/session gate.** Uses `sessionStorage` to show the bracket
  wipe once per browser session, skipped entirely under
  `prefers-reduced-motion`.
- **Favicon/OG images.** No default Next.js favicon ships — `icon.tsx` and
  `opengraph-image.tsx` both generate a Republic Blue, mono-type image via
  `next/og`, consistent with §9's "no default favicons" rule.
- **Legal.** Only `/legal/privacy` was specced (§5 lists it as a stub);
  the old build's `/legal/terms-conditions`, `/legal/refund-policy` and
  `/legal/accessibility-statement` routes were removed rather than carried
  forward, since they weren't in the new site map.

## TODO punch-list (v1, from §2, carried into content files as inline TODOs)

- [ ] Confirm Ola Olowu's and Daniel Emeka's final titles before deploy.
- [ ] Supply real, confirmed social handles in `content/site.ts` — until
      then the site correctly ships with no social icons.
- [ ] Supply numeric case results per project once client sign-off lands;
      `results: []` on all eight seeds renders the NDA fallback correctly.
- [ ] Confirm the Kigali office publicly before flipping
      `flags.showKigali`.
- [ ] Pull the canonical six Reaction Standard laws from the master doc
      (currently 2 live, 4 pending slots).
- [ ] Confirm display rights per client logo before deploy; swap the
      current text-based roster in `content/clients.ts` for real SVG
      logos once cleared.
- [ ] Confirm the eight seed case studies (brief/idea copy, service tags,
      years) with Daniel — every case file is marked
      `// TODO: verify with Daniel`.
- [ ] Confirm final wider-team roster and commission the team photography
      session (B/W, consistent crop) to replace `<Avatar>` monogram
      placeholders.
- [ ] Supply wordmark + speech-bubble "R" mark as SVG, hero film/stills,
      and per-case media once available — all currently render as
      `<Placeholder>` designed slots.

## Phase C — Studio/Contact wire-up, SEO/OG/JSON-LD, full audit (this section, final)

Continuing from checkpoint `346a051`, which had already rewired Home/
Services/case-template to v2 and added per-page OG images. This session's
job (per the brief): Studio, Contact, a reduced-motion pass on the real
assembled pages, SEO/OG/JSON-LD completion, and a full pre-handoff audit.

### First finding: Studio, Contact, `site.ts`, sitemap/robots, JSON-LD were
### already correct — built in the v1 pass, never touched by Phase C's
### checkpoint, but already conforming to the v2 spec verbatim

Per this file's own "trust the code over the brief's summary" instruction,
I read every file before touching anything. `src/app/studio/page.tsx` and
`src/app/contact/page.tsx` were last modified in `6c03ee5` (the original v1
rebuild) — `346a051`'s "in progress" checkpoint never got to them — but
both already matched the v2 spec's exact copy, section order, and
`id="method"` anchor target. `content/site.ts` already carried the correct
final phone number (`+234 700 700 5252`) and address (`10 Onisiwo Road,
Ikoyi, Lagos, Nigeria`) — the brief's warning that these were "likely
empty/missing" didn't hold for this codebase's actual state. Root
`layout.tsx` already had the Organisation JSON-LD block (name, url, logo,
address, email, telephone, `sameAs` derived live from `content/site.ts`'s
`socials` array so it can't go stale). `sitemap.ts`/`robots.ts` already
listed Studio/Contact/Services/Work/legal-privacy and excluded `/dev/*`.
None of this was re-built; all of it was verified against the spec line by
line (metadata title templates, locked copy, bracket usage, budget-band
options, button copy, success/error copy) and left alone once confirmed
correct, rather than rewritten for the sake of motion.

### Real defects found and fixed during the audit

Everything above was "already right." The audit pass did find three real,
confirmed contrast/focus defects — not hypothetical, verified by reading
actual computed styles in Playwright against the real pages, not just by
eye:

1. **`CaseCard` and `WorkStrip`'s caption brackets used `text-republic-press`
   on an `ink` background** (`src/components/CaseCard.tsx`,
   `src/components/WorkStrip.tsx`). Both components are only ever placed
   inside `theme="ink"` sections in production (Home's work-strip section,
   `/work`'s grid). Measured contrast: Republic Press (`#1414cc`) against
   ink (`#0a0a0a`) is **1.89:1** — nowhere near the 3:1 floor even for
   large text, let alone 4.5:1 for the caption's actual small mono-label
   size. This directly violates the spec's own contrast law and the
   forbidden-list line "Republic Blue never carries body text." Fixed by
   switching both to `text-paper` (19.80:1 against ink) — Bracket has no
   built-in colour, so this is a plain class swap, no structural change.
   Re-verified in Playwright post-fix: both read 19.80:1.
2. **`ContactForm`'s validation-error text used `text-republic`** on the
   same always-ink Contact page — `#1f1fff` vs `#0a0a0a` is **2.54:1**,
   also failing AA. Fixed by moving the colour to `text-paper` (still
   19.80:1) and keeping the Republic Blue accent as an `underline
   decoration-republic` instead of the text colour itself — satisfies the
   letter of "Republic Blue never carries body text" rather than just the
   contrast number, while keeping a visible brand-coloured accent on the
   error state. Verified by triggering a real validation error (invalid
   email) in Playwright and reading the rendered `[role="alert"]` text's
   computed colour/background.
3. **Nav's keyboard focus ring had no reliable contrast against whatever
   theme happened to be scrolled beneath the fixed header.** `Nav`'s
   `<header>` is mounted once in the root layout and is deliberately
   outside every `ThemeSection` (§4.6.7's own reasoning: it has to work
   over ink/republic/paper alike, which is why its link *text* already
   used the `mix-blend-difference` trick). But `globals.css`'s theme-scoped
   focus-ring override (`[data-theme="ink"] :focus-visible { outline-color:
   paper }`) is written as a descendant selector keyed to an *ancestor*
   `data-theme` attribute — and Nav has no such ancestor, so it always fell
   through to the plain default (`outline: 2px solid var(--color-republic)`),
   i.e. **2.54:1 against the ink hero section every real page opens on**,
   under the WCAG 1.4.11 non-text 3:1 minimum for a focus indicator.
   Confirmed by tabbing through the real Home page in Playwright and
   reading `getComputedStyle` on the focused link, then visually with a
   screenshot (the ring was barely a sliver against the dark hero).
   Text's own mix-blend trick doesn't extend to `outline` automatically
   (outline is a separate paint layer from the blended text span), so the
   fix is a dedicated rule: `header :focus-visible { outline: 2px solid
   var(--color-paper); outline-offset: 2px; box-shadow: 0 0 0 4px
   var(--color-ink) }` — a two-tone paper+ink "halo" that stays legible
   regardless of which of the three themes is behind the bar at the time,
   rather than trying to pick one colour that works everywhere (none of
   the five tokens does). Re-verified: outline now reads `rgb(255,255,255)`
   at 2px (19.80:1) with the ink box-shadow ring visible in the
   screenshot.

None of these three were touched by the earlier phases' own Playwright
contrast checks because those checks (Phase A's accent-clamp math, Phase
B's component-level a11y passes) verified the *systems* they were built
for correctly; nobody had previously walked the *composed* real pages
specifically checking every rendered text/background pair against the
5-token palette + the accent system. This session's audit did that
systematically (grep for every `text-republic`/`text-republic-press`
non-hover usage, cross-referenced against the actual `ThemeSection` each
one renders inside), which is what surfaced these three — flagging the
method in case a future content addition reintroduces the same class of
bug: **grep for `text-republic`/`text-republic-press` in new components,
and confirm the theme it's rendered inside before assuming a passing
component-level check means the composed page is fine.**

### Dev harness fix: `/dev/work-strip`'s CaseCard QA section wasn't wrapped
### in `theme="ink"`

Same root cause as defect #1 above, one layer further out: the harness
mounted `<CaseCard>` directly on the page's default (unthemed, paper)
background rather than reproducing its real ink placement, so a
Playwright contrast check against the harness read a false "passing"
number purely because white-on-white text happened to still be
white-on-*paper* by coincidence of the old blue-on-white combination,
masking the real ink-background bug documented above until checked
against an actual production placement. Fixed by wrapping the CaseCard QA
section in `<ThemeSection theme="ink">` in `src/app/dev/work-strip/
page.tsx` — the harness now matches production context, and the fix above
reads correctly there too (19.80:1). Lesson applied: a `/dev/*` QA
harness is only a useful regression check if it reproduces the *theme
context* a component actually ships in, not just the component in
isolation.

### `eslint.config.mjs` ignore globs hardened against nested worktree checkouts

Discovered while re-running `npm run lint` mid-session: this sandbox has a
harness-managed git worktree at `.claude/worktrees/agent-<id>/` (not part
of this repo's tracked history, not created by anything in this session's
own tool calls, locked by the harness itself) that carries its own stale
`.next` build output. `eslint.config.mjs`'s ignores were written as
`".next/**"` etc — which only matches a `.next` directory at the lint
invocation's own root, not one nested three directories down inside that
worktree — so a bare `npm run lint` from the repo root was transitively
scanning that worktree's *compiled, minified* JS output and reporting
~6,500 unrelated problems. Confirmed real project lint was always clean by
running `npx eslint src content scripts` directly (zero output, before and
after). Fixed the ignore patterns to `"**/.next/**"` etc so `npm run lint`
is correct regardless of what else happens to be checked out alongside
this repo in a given sandbox — a real, if environmental, robustness fix,
not a workaround left in place. Also explains an earlier hour of confusing
stale-chunk-hash 500s during this session's own manual `next build`/`next
start` cycles: multiple overlapped background server processes (my own,
from repeated `npm start`/`npm run dev` invocations across tool calls)
were left listening on the same ports after a rebuild changed chunk
hashes underneath them — resolved by killing every stray Next.js process
bound to this repo's working directory and doing one clean, sequential
build → start cycle before trusting any Playwright reading. Not a code
defect; noted here only so a future session recognises the symptom (a
page loads but a specific `_next/static/chunks/*.js` 404s/500s inconsistently)
immediately as "stale server process," not as an application bug.

### Reduced-motion pass on the real assembled pages — all confirmed passing

Re-verified every pattern from Phase B's component-level checks against
the actual composed pages (`page.emulateMedia({ reducedMotion: 'reduce' })`),
not just the isolated `/dev/*` harnesses, per this session's brief:

- **WorkStrip**: Home currently renders `<CasesEmptyState>` instead of
  `<WorkStrip>` (zero live cases — expected, see Phase A/B's
  "zero live cases" decision, unchanged), so neither the pinned nor static
  variant mounts on the real page today; re-confirmed the fallback
  directly on `/dev/work-strip` instead (`work-strip-pinned`: 0 matches,
  `work-strip-static`: 1 match under reduced motion) — the moment a case
  goes live this same check should be re-run against Home/`/work`
  directly.
- **ServiceSwap**: real Home and `/services` both correctly render the
  stacked fallback (`service-swap-sticky-frame`: 0 matches,
  `service-swap-stacked`: 1 match, all six images at `opacity: 1`) under
  reduced motion.
- **HoverRevealText** (Home's manifesto section): confirmed the popover
  markup never mounts (`hover-reveal-popover`: 0 matches) and the
  "collect below the paragraph" fallback renders all three referenced
  images with visible `<figcaption>`s (`provoke`, `participation`,
  `citizens`).
- **Preloader**: confirmed on the real Home page that the `"flashing"`
  phase is never observed under reduced motion — the `data-phase`
  attribute goes straight `wordmark → exit → (unmounted)`.
- **Marquee**: confirmed `.marquee-track`'s computed `animationName` is
  `"none"` under reduced motion on the real Home page (the sitewide
  `@media (prefers-reduced-motion: reduce)` rule in `globals.css`, not a
  per-instance gate — exactly as documented in Phase B's notes).
- **MixBlendHover** (Nav + CtaBand): confirmed computed
  `transitionDuration` collapses to ~1e-6s under reduced motion on the
  real Home page, and the hover/focus state change itself (the block
  appearing, the label inverting) still fires — motion removed, state
  change preserved, as designed.

### SEO/OG/JSON-LD — verified, not rebuilt

Root `layout.tsx`'s Organisation JSON-LD, every route's `next/og`
opengraph-image (Studio's and Contact's included — both render correctly,
confirmed by fetching them directly and checking the returned PNG's
dimensions), the `"%s — The Republic"` title template (confirmed resolved
on Studio and Contact specifically, not just assumed from the template
existing), and `sitemap.ts`/`robots.ts`'s route coverage were all audited
against the spec and found already correct from earlier phases — nothing
in this section needed rebuilding, only confirming.

### Full audit results (this session)

- **Typo/British-English sweep**: read every user-facing string across
  every real page (not just Studio/Contact) plus `content/*.ts` and
  `content/work/*.ts`. Zero American spellings, zero typos found. No
  changes needed.
- **Link check**: every literal `href="/…"` and every `href={\`/work/${…}\`}`
  site-wide resolves to a real, live route — the dynamic case links are
  gated by the same `getLiveCases()`/`getLiveCaseBySlug()` pool that
  generates `/work/[slug]`'s static params, so they can't point at a
  route that doesn't exist. `/studio#method` confirmed to actually scroll
  the method section to the viewport top (measured
  `getBoundingClientRect().top ≈ 0` after a direct anchor-URL navigation).
- **Contrast**: full sweep, not spot-check — grepped every non-hover
  `text-republic`/`text-republic-press` usage site-wide and checked each
  against the theme it actually renders inside; found and fixed the three
  defects documented above. Re-ran `npm run palette` (all eight generated
  accents still pass AA, 14.55:1–18.88:1 against paper, unchanged from
  Phase A) and re-confirmed the `hover:text-republic` link-hover instances
  (Footer, CtaBand, Home's client list, etc.) are an accepted exception —
  transient hover-only states, not the resting/body-text case the "never
  carries body text" rule targets.
- **Playwright visual + perf sanity**: screenshotted Home/Work/Studio/
  Services/Contact at 360/768/1024/1440/1920, scrolling through each page
  first so `whileInView`-gated `<Reveal>` content actually renders before
  the full-page screenshot is taken (a naive full-page screenshot without
  a pre-scroll undercounts below-fold content — worth remembering for any
  future visual QA pass on this codebase). Zero horizontal overflow at
  360px on any real route. Zero console errors beyond one expected,
  environment-only entry (`/_vercel/insights/script.js` 404s under local
  `next start`/`next dev` — Vercel Analytics' script only resolves on
  actual Vercel infrastructure, confirmed harmless and not present at all
  once accounted for). Hero LCP element on every page is the poster/
  placeholder `<ScenePlaceholder>` image, never a live `<video>` (no
  `<video>` tag exists anywhere in this codebase yet, per Phase A/B's
  placeholder strategy).
- **Forbidden-content grep**: repo-wide (`src/`, `content/`) for emoji,
  "lorem ipsum", literal "Submit" button text, gradient/shadow utility
  classes, "purple", any `status: 'live'` seed case, third-party/template
  footer credits, AI-portrait/stock-photo references, autoplay audio,
  custom cursors, default Next.js favicon. Zero matches beyond comments
  *documenting* the rule (e.g. Placeholder.tsx's own comment mentioning
  "lorem ipsum" as the thing it avoids).
- **Naming/locked-copy consistency**: "The Republic" used consistently
  (the one bracketed "[ REPUBLIC ]?" in CtaBand is the bracket *device*,
  not a naming-rule violation — same pattern the spec itself uses for the
  bracket motif). Leadership titles exact and consistent between
  `content/site.ts`, `content/team.ts`, and Studio's render. Footer reads
  exactly "© 2026 The Republic. Lagos." with the Legal link present and
  socials correctly hidden (empty array).

### Verification run (final)

`npm run lint`, `npx tsc --noEmit`, `npm run build` all clean on a single,
freshly-rebuilt `.next` output (no stray processes serving a stale build
underneath the check — see the eslint/worktree note above for why that
mattered this session). `npm start` against that production build, hit
every real route with Playwright (`/`, `/work`, `/studio`, `/services`,
`/contact`, `/legal/privacy`, `/sitemap.xml`, `/robots.txt`, plus every
`/dev/*` route confirmed 404 and a genuine unknown path confirmed 404) —
all correct status codes, no unexpected console errors.

### Final consolidated TODO punch-list (carried forward from §2 and §8,
### unchanged by this phase — nothing below was resolvable inside this
### sandbox; all require real-world input from Daniel/the client)

**§2 — confirm before public launch:**
- [ ] Confirm Ola Olowu's and Daniel Emeka's final leadership titles.
- [ ] Supply real, confirmed social handles in `content/site.ts` (ships
      with zero social icons until then — correct, not a bug).
- [ ] Supply numeric case results per project once client sign-off lands
      (`results: []` on all eight seeds renders the "Results under NDA"
      fallback correctly in the meantime).
- [ ] Confirm the Kigali office publicly before flipping
      `flags.showKigali` (currently `false`, verified still hidden this
      session).
- [ ] Pull the canonical six Reaction Standard laws from the master doc
      (currently 2 live + 4 pending `[ LAW PENDING ]` slots — verified
      still rendering correctly on `/studio#method` this session, not
      rewritten).
- [ ] Confirm display rights per client logo before deploy; swap the
      text-based roster in `content/clients.ts` for real SVG logos once
      cleared.
- [ ] Confirm the eight seed case studies (brief/idea copy, service tags,
      years) with Daniel — every case file still marked
      `// TODO: verify with Daniel`; all eight remain `pending-approval`,
      so none render publicly yet (by design).
- [ ] Confirm final wider-team roster and commission the team
      photography session (B/W, consistent crop) to replace `<Avatar>`
      monogram placeholders on Studio.

**§8 — real assets to source once available:**
- [ ] Wordmark + speech-bubble "R" mark as SVG (currently type-only/
      `<Bracket>`-based everywhere, including the newly-audited Studio/
      Contact pages).
- [ ] Hero film/stills for Home (currently `<ScenePlaceholder>` with
      persistent "PLACEHOLDER — REPLACE WITH …" captions).
- [ ] Per-case media (video + stills) for all eight seed cases, once each
      clears client approval.
- [ ] Team photography (leadership + wider roster) to replace `<Avatar>`
      initial-monogram placeholders.
- [ ] Client logos (pending display-rights confirmation above).
- [ ] Confirmed social URLs for `content/site.ts`'s `socials` array (also
      feeds the JSON-LD `sameAs` list automatically once populated — no
      code change needed there).
- [ ] On-camera talent releases for any real people appearing in future
      case media, ahead of publishing that media.

**Housekeeping, not client-facing:**
- [ ] All eleven `/dev/*` QA routes (`/dev/placeholders`, `/dev/
      scroll-test`, `/dev/work-strip`, `/dev/hover-reveal`, `/dev/
      service-swap`, `/dev/case-template`) remain in place, still
      404-gated in production (re-confirmed this session on a fresh
      build) — no new dev routes were added or removed this phase.
      Recommended next prune: once WorkStrip is live on Home with a real
      case, `/dev/work-strip`'s pinned-strip demo section becomes
      redundant (its CaseCard QA sub-section may still earn its keep a
      little longer, until at least one case is live on a real page).
- [ ] `generator.ts`'s known sub-pixel `Math.cos`/`Math.sin` hydration
      warning (documented in Phase B's section above) is still present,
      unchanged, confirmed via the same `insurance`-category symptom on
      `/dev/work-strip` this session — still dev-console-only, still not
      user-visible or build-breaking, still not fixed (out of scope,
      same reasoning as Phase B).

## v3 Phase A — grid engine, GSAP removal, appearance toggle, character-hover nav (this section)

Scope: §11 build order steps 1-3 of the v3 spec (scaffold confirmation,
`src/lib/grid-engine.ts` built and verified in isolation, tokens/fonts
audit, `<Bracket>` catalogue-numbering variant, the appearance toggle
§4.7.3, character-hover nav §4.7.2), plus removing everything §10-forbids
that existed from the v2 GSAP/ScrollTrigger build. Phase B builds the
actual homepage flowing grid and content layer on top of this.

### GSAP/ScrollTrigger removal

`gsap` is uninstalled (`npm uninstall gsap` — removed from
`package.json`/`node_modules`). `grep -rn "gsap\|ScrollTrigger" src/
content/ scripts/` now returns only prose comments (no `import`, no
`gsap.*`/`ScrollTrigger.*` call sites) — several of those comments were
themselves rewritten this phase to stop describing the now-dead GSAP
pattern as current guidance (`ScenePlaceholder.tsx`, `dev/placeholders/
page.tsx`, `MixBlendHover.tsx`, `reducedMotion.ts`), rather than leaving
stale "Phase B should drive this from a GSAP ScrollTrigger callback"-style
instructions for a mechanism that no longer exists in this codebase.

- **`SmoothScroll.tsx`** rebuilt to the drastically simpler v3 spec: Lenis
  only, driving itself via its own default `autoRaf` (no
  `gsap.ticker`/`lagSmoothing`/`ScrollTrigger.update` wiring, no
  `usePathname()`-triggered `ScrollTrigger.refresh()`). Reduced motion:
  unchanged behaviour — no Lenis instance created at all, scroll stays
  native.
- **`WorkStrip.tsx`** — the v2 pinned GSAP strip (`PinnedStrip`,
  `ResponsiveStrip`, the desktop/mobile `useMediaQuery` split) is deleted
  outright, not just de-GSAP'd. What remains is a plain static grid
  (`grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4`) so the one real
  call site (`src/app/page.tsx`'s Home) keeps compiling and rendering
  actual featured-case content in the interim, but the file carries an
  explicit `v3 NOTE` doc comment flagging it as a holdover, not a finished
  v3 deliverable — **Phase B is expected to delete this component outright**
  and replace its call site with the new flowing asymmetric media grid
  built on the grid engine (§4.5), per the spec's own framing ("Phase B is
  replacing the whole homepage work section with the new flowing grid
  anyway, so WorkStrip as a pinned-scroll component is being fully
  retired"). Chose delete-the-pin-but-keep-a-minimal-fallback over
  deleting the whole component, since Home currently imports and renders
  it with real (if empty-state-gated) content — leaving Home in a broken
  import state for one phase felt worse than a short-lived, clearly-
  labelled placeholder.
- **`/dev/scroll-test`** and **`/dev/work-strip`** deleted outright (both
  existed purely to visually/Playwright-verify the now-removed GSAP
  pinning pattern — `/dev/scroll-test`'s pin/scrub box and
  `/dev/work-strip`'s pinned-strip demo section had no reason to exist
  once nothing pins). Confirmed both now 404 in a real
  `next build && next start` (same production-only 404 gate,
  `src/app/dev/layout.tsx`, unchanged) rather than merely being absent
  from the route tree — belt-and-braces against a stale build artifact.
  The other four `/dev/*` QA routes (`placeholders`, `hover-reveal`,
  `service-swap`, `case-template`) are untouched and still 404-gated in
  production, confirmed via the same Playwright pass.

### `src/lib/grid-engine.ts` — the CSS custom property API Phase B consumes

One base unit (`ch`, a character width in px) computed from
`window.innerWidth`, everything else derived from it:

```
--grid-cols            unitless integer, e.g. "12"      → repeat(var(--grid-cols), 1fr)
--grid-font-size       px string, e.g. "16.81px"         → mono label/eyebrow text only
--grid-line-height     px string, e.g. "20.57px"         → = 2 × ch
--grid-letter-spacing  px string, e.g. "0.480px" (can go negative as density increases)
--grid-gutter          px string, e.g. "86.40px"
```

Also sets `data-grid-band="mobile"|"desktop"` on `<html>` for any CSS/JS
that wants to branch on which band produced the current numbers without
re-deriving it from `--grid-cols`.

**Formula** (`computeGridMetrics`, `src/lib/grid-engine.ts`): column count
is picked per band first (6→8 mobile below 769px, 12→16 desktop at 769px+,
both monotonic-within-band and clamped at the edges so they can never
leave their target range regardless of input); `ch` is then
`clamp(width / (cols × 10), 5, 30)` — the "10" is `COLUMN_CHAR_BUDGET`,
tuned (not guessed) by solving backwards from the target 10-20px mono
font-size band at the five reference viewports; `fontSize =
clamp(ch / charWidthRatio, 10, 20)`; `lineHeight = ch × 2`;
`letterSpacing = 1.6 - cols × 0.08` (tightens as cols increases, i.e. as
the grid densifies at larger viewports, per §4.5's explicit instruction);
`gutter = clamp((width - cols×ch) / (cols + 1), 0, width)` (remaining
horizontal space after `cols × ch` is subtracted, split across `cols + 1`
gaps — inner gutters plus the two outer margins). `charWidthRatio` is
"how many px wide is one Space Mono character, per 1px of font-size" —
real client-measured font metrics, not a guessed constant, per §4.5's
explicit instruction: `measureCharWidthRatio()` renders a hidden 100-
character test string of the real `--font-mono` stack at a 100px
reference size and divides. Verified sane/non-degenerate at all five
required breakpoints via Playwright (reading the actual computed
`getComputedStyle(document.documentElement)` custom-property values, not
screenshots):

| width | cols | fontSize | lineHeight | letterSpacing | gutter | band |
|---|---|---|---|---|---|---|
| 360 | 6 | 10.00px | 12.00px | 1.120px | 46.29px | mobile |
| 768 | 8 | 15.69px* | 19.20px | 0.960px | 76.80px | mobile |
| 1024 | 13 | 12.87px* | 15.75px | 0.560px | 65.83px | desktop |
| 1440 | 14 | 16.81px* | 20.57px | 0.480px | 86.40px | desktop |
| 1920 | 16 | 19.61px* | 24.00px | 0.320px | 101.65px | desktop |

(*measured against the real, loaded Space Mono font in a live Playwright
Chromium session — the actual measured `charWidthRatio` came out slightly
different from the 0.6 fallback, which is exactly the "don't guess a
constant" instruction working as intended; every value stayed inside
range regardless.) All positive, all within the mandated 10-20px font
band, no negative gutters, cols never left its band's target range.

**Two-pass FOUC prevention, deliberately not one**: `GRID_ENGINE_BOOT_SCRIPT`
(a hand-written, self-contained IIFE string, same file) runs as a blocking
`<script>` in the root layout's `<head>` — before React hydrates, before
first paint — using `FALLBACK_CHAR_WIDTH_RATIO` (0.6, the standard
monospace average-advance-width-to-em-size ratio) since the real
self-hosted Space Mono file isn't reliably guaranteed loaded/measurable
that early. `GridEngineClient.tsx` (mounted once in the root layout,
alongside `SmoothScroll`) then measures the *real* font on mount and
re-applies, an imperceptible same-tick refinement rather than a visible
jump — the boot script's job is only "prevent FOUC by setting something
sane immediately," not "produce the final exact numbers." The boot
script's math is a hand-copied mirror of `computeGridMetrics`, not
generated from it — a blocking pre-paint script can't `import` a webpack
module, it has to be a standalone string, so the two are kept in sync
manually (documented at the top of both, `computeGridMetrics`'s own
inline comments are the single source of truth for constants).
`GridEngineClient` also owns the debounced (`120ms`) `resize` listener and
an un-debounced `orientationchange` listener (fires immediately on
rotate, ahead of `resize` on some mobile browsers) per §4.5.

**No-JS / reduced-data baseline**: `globals.css` ships a plain
`:root`/`@media (min-width: …)` static fallback for every one of these
five custom properties (4 cols / 12px mono font mobile → 8 cols/13px at
640px → 12 cols/14px at 1024px, per §4.5's own suggested "4 columns
mobile / 12 desktop" numbers) — present in the initial server-rendered
HTML with zero script involvement, overwritten by the boot script the
moment JS *is* available. Verified with Playwright's
`javaScriptEnabled: false` context option (not just a script-blocking
route intercept — the harder, more literal reading of "JS disabled"):
`/` returns 200, nav links (`/work`, `/contact`, etc.) are present and
real `<a href>`s (no JS-only routing), `/work` navigates and returns 200,
and `--grid-cols` reads the plain-CSS fallback value ("4" at a 375px
viewport) rather than an unset/broken custom property.

**Deep-research finding on the boot-script mechanism**: this Next.js
version (16.2.10) ships a dedicated guide for exactly this pattern —
`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-
hydration.md` — recommending a literal `<head><script
dangerouslySetInnerHTML={{...}} /></head>` inside the root layout's JSX
(which Next merges with its own generated metadata `<head>` content;
only `<title>`/`<meta>` are discouraged as manual entries per the
separate `layout.md` guide, not arbitrary elements like `<script>`) —
**not** `next/script`'s `strategy="beforeInteractive"`, whose execution is
documented (`docs/.../script.md`) to *not* block hydration, the opposite
of what a pre-paint FOUC-prevention script needs. `layout.tsx`'s `<html>`
gained `suppressHydrationWarning` accordingly, since both boot scripts
mutate its attributes/inline styles before React ever touches the DOM —
without it, React would treat the boot scripts' own changes as a
hydration mismatch and roll them back. Confirmed this is genuinely a
Next-version-specific answer worth verifying rather than assuming from
training data, per this repo's own AGENTS.md warning.

### §4.7.3 — the appearance toggle, and how it composes with `ThemeSection`

This is flagged in the brief as "the single most architecturally
important call this phase," so the reasoning in full:

**The two systems stay separate, not merged.** `ThemeSection`'s existing
four themes (`ink`/`republic`/`paper`/`accent`) remain pure, literal
per-section art direction, completely unaffected by the new global
toggle — a section that asks for `theme="ink"` always renders ink
(`#0a0a0a`), regardless of whether the user has the site set to dark or
light appearance; same for `"republic"` (a full Republic Blue field is a
deliberate colour choice, not a "dark mode" surface) and `"accent"` (a
per-case hex blend). This was the only defensible reading given the
existing contrast law ("Republic Blue is a field/display-type colour
only, never small body text on ink") and the existing "turning pages"
scroll narrative these four themes already encode across every real page
(Home/Work/Studio/Services/Contact alternate ink/republic/paper sections
deliberately, as composed art direction, not as a light/dark state) — if
toggling "light appearance" silently remapped every `theme="ink"` section
to render as paper, it would invert that entire deliberate page rhythm
and potentially put small text in front of a section that was
specifically art-directed as an ink backdrop for a reason unrelated to
"is dark mode on." Retrofitting *that* meaning onto the existing prop
would be a bigger, riskier, and less honest change than building the new
mechanism as its own thing.

**What the toggle actually controls**: two things, both new, both
additive (nothing existing changes behaviour):

1. **Unthemed page chrome.** `body`'s own base background/text — visible
   in any gap outside a `ThemeSection`, and the correct default for any
   future page surface that doesn't wrap itself in one — now reads
   `var(--app-bg)`/`var(--app-fg)` instead of the old hardcoded
   `var(--color-paper)`/`var(--color-ink)`. `:root[data-appearance="dark"]`
   (and the plain `:root` default, matching the locked "default dark"
   rule) sets `--app-bg: var(--color-ink); --app-fg: var(--color-paper)`;
   `:root[data-appearance="light"]` flips them. `body` gets a 200ms
   background/colour transition (collapsed to ~instant under reduced
   motion by the existing sitewide rule).
2. **A new fifth `ThemeSection` value, `theme="auto"`.** Resolves to
   `var(--app-bg)`/`var(--app-fg)` exactly like `body` — i.e. it tracks
   the user's global appearance choice rather than being locked to one
   literal colour. This is the actual mechanism Phase B/C should reach
   for when a section specifically wants to *be* the page's default
   reading surface (follow the user's dark/light preference) rather than
   art-direct a fixed look. No existing page currently uses `"auto"` —
   this phase only builds the mechanism and documents when to use it, per
   the brief's own scoping ("don't wire every page to it yet").

**Mechanism**: `data-appearance="dark"|"light"` on `<html>`, written
before first paint by a blocking boot script (`APPEARANCE_BOOT_SCRIPT`,
`src/lib/appearance.ts`) using the exact same pattern as the grid engine's
own boot script — reads `localStorage["republic-appearance"]`,
defaults to `"dark"` (LOCKED default) if unset or unreadable (private-mode
`localStorage` throws are caught). `useAppearance()` is a
`useSyncExternalStore`-based hook (same family as `usePrefersReducedMotion`/
`useMediaQuery` — SSR-safe, reactive, no hydration mismatch) exposing
`{ appearance, toggleAppearance, setAppearance }`. Same-tab reactivity
uses a plain custom `window` event (`republic:appearance-change`) rather
than the native `storage` event, since `storage` only fires in *other*
tabs — the tab that actually clicked the toggle needs to re-render too.
`<AppearanceToggle>` (`src/components/AppearanceToggle.tsx`) is a small
`[ DARK / LIGHT ]`-styled button in Nav's desktop secondary group (next to
"Start a project") and in the mobile overlay; `role="switch"` +
`aria-checked` for the a11y-correct binary-toggle semantics.

**Reduced motion**: the toggle's *state change* (attribute write,
localStorage persist, event dispatch) is a plain synchronous function
call — it's never gated on reduced motion and always works instantly,
exactly per spec. Only the *animated* 200ms background/colour cross-fade
is motion, and that's a plain CSS `transition` already collapsed to
~0ms by the existing sitewide `@media (prefers-reduced-motion: reduce)`
rule in `globals.css` — no bespoke JS gate needed, same treatment as
`MixBlendHover`.

**Focus ring**: extended the existing theme-scoped `:focus-visible`
override (ink/republic/accent → paper outline) with
`:root:not([data-appearance="light"]) [data-theme="auto"] :focus-visible`
so an `auto` section gets the correct paper-on-dark ring while dark and
falls through to the already-correct default (Republic Blue on paper)
while light.

### §4.7.2 — character-hover nav (`CharHoverLink.tsx`)

Splits link text into individual character `motion.span`s on mount. A
single parent `motion.span` carries `whileHover="active"`/
`whileFocus="active"` variant state; each character shares the same
`containerVariants`/`charVariants` objects, so Motion's own orchestration
(`staggerChildren: 0.018` on the parent's active variant) staggers each
character's transition start without any manual per-character
`setTimeout` bookkeeping — a "brief vertical roll/flip stagger" via a
small `y`/`rotateX` keyframe excursion and back (`transform`-only, per
§4.6). A single `<span className="sr-only">` carries the real text for
screen readers since each character span is `aria-hidden`.

**Reduced motion**: per spec ("instant colour-only hover state, no
character animation"), the reduced branch doesn't split the string or
mount any `motion.span` at all — it renders plain text. The "instant
colour" half of that requirement falls out for free: every caller wraps
`<CharHoverLink>` in the existing `<MixBlendHover>` (§4.6.7), whose own
hover block-scale is a plain CSS transform transition already collapsed
to ~0ms sitewide under reduced motion — so the colour/contrast change on
hover/focus still happens instantly, this component just needed to stay
out of the way of it rather than reimplement it. Verified in Playwright:
zero `motion.span` character nodes render under
`page.emulateMedia({reducedMotion:'reduce'})`, and the same nav link
renders the expected character spans under normal motion.

Uses `usePrefersReducedMotion` from `@/lib/reducedMotion` rather than
`motion/react`'s own `useReducedMotion`, even though every transition here
is a `<motion.*>` component — deliberately follows the *practical*
convention already established by `Reveal.tsx`/`Preloader.tsx` (both
actually import `usePrefersReducedMotion` from `@/lib/reducedMotion` in
their real code, despite `Preloader.tsx`'s own doc comment describing a
different, narrower rule) rather than the more theoretical "Motion
components → motion/react's hook" framing written into Phase B's
DECISIONS.md section. `Reveal.tsx`'s comment explains why: `motion/react`'s
hook reads `matchMedia` synchronously on first client render with no SSR
guard, which mismatches server HTML whenever the OS already has reduced
motion on — a real hydration bug, not a hypothetical one. Flagging this
explicitly since it's a second phase now quietly diverging from Phase B's
stated (but not, in practice, followed) rule of thumb — `@/lib/
reducedMotion`'s hook is the one to reach for by default in this codebase
for any new component, motion-driven or not, and the "Motion components
use motion/react's hook" framing in Phase B's notes should probably be
treated as superseded.

Wired into Nav's four desktop nav links and the desktop "Start a
project" button (inside their existing `<MixBlendHover>` wrappers,
replacing the plain text children) — not into the mobile overlay's large
touch-target links, since hover/character-roll has no meaningful touch
equivalent and the mobile overlay already uses larger `display-type` text
with its own `MixBlendHover` tap-contrast behaviour. `<AppearanceToggle>`
was added to both the desktop nav and the mobile overlay, since the
toggle itself (unlike character-hover) is equally meaningful on touch.

### §4.3 — `<Bracket>` catalogue-numbering variant

Added `CatalogueBracket` as a named export alongside the existing default
`<Bracket>` (`src/components/Bracket.tsx`) rather than a new prop on
`<Bracket>` itself — the two have a genuinely different shape:
`<Bracket>` wraps arbitrary children in one bracket pair; the catalogue
variant wraps only a zero-padded index number in brackets
(`String(index).padStart(2, "0")`, reusing `<Bracket>` internally rather
than duplicating the bracket markup) and renders the label immediately
after, unbracketed — `[ 01 ]  CHIVITA — STYLE N' SIPS`. `index` is
1-based, matching the spec's own "01" example; callers are responsible
for passing the item's position in the full, flattened work archive (not
a per-page/per-category counter) — Phase B wires this into the actual
homepage/work grid once that content layer exists.

### Tokens/fonts audit

Re-confirmed against §4.1/§4.2, unchanged since Phase A/B/C: the five
palette tokens, Space Mono/Inter via `next/font/google`, `.display-type`/
`.mono-label`/`.measure` utilities all still match spec exactly. No
changes made — this was a verify-not-rebuild step per the brief's own
scoping.

### Verification run (this phase)

`npx eslint src content scripts` and `npx tsc --noEmit` both clean.
`npm run build` clean (Turbopack, Next 16.2.10) after uninstalling
`gsap` and deleting the two GSAP-testing dev routes — confirmed the
`.next/types` validator no longer references the deleted routes (a stale
`.next` from before the deletion did, transiently, until a clean rebuild).
`npm start` against that production build, driven with Playwright
(`chromium`, `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`):

- Grid engine sane/non-degenerate at all five required breakpoints (table
  above) — cols positive and within its band's target range, font-size
  10-20px, gutter non-negative, at every one.
- No-JS (`javaScriptEnabled: false` context option, not just a script-
  blocking route intercept): `/` and `/work` both 200, real `<a href>`
  nav links present and correct, static CSS grid fallback (`--grid-cols:
  4` at a 375px viewport) renders with zero script involvement.
- Reduced motion (`page.emulateMedia({reducedMotion:'reduce'})`):
  character-hover's per-character `motion.span` nodes are absent from the
  real Home page's nav links; present under normal motion on the same
  page.
- Appearance toggle: defaults to `dark` on first load: `data-appearance`
  flips to `light` on click, persists to `localStorage["republic-
  appearance"]`, and survives a full page reload.
- Every real route (`/`, `/work`, `/studio`, `/services`, `/contact`,
  `/legal/privacy`) returns 200 with zero unexpected network failures —
  the one console/network entry every page produces
  (`/_vercel/insights/script.js` `net::ERR_ABORTED`/404) is the same
  pre-existing, environment-only, Vercel-infrastructure-only entry Phase C
  already documented, not a regression from this phase's changes.
- All six `/dev/*` paths (`scroll-test`, `work-strip` — both now deleted
  from the route tree entirely — plus the four still-live QA routes
  `placeholders`/`hover-reveal`/`service-swap`/`case-template`) 404 in the
  production build, confirming the removal is real and the still-live
  harnesses' production gate is undisturbed.
- Embla-based case-page carousels are unaffected by any change this
  phase (Embla was never GSAP-driven) — not re-verified in depth this
  session since nothing touched `CaseCarousel.tsx`/`CaseStudyTemplate.tsx`,
  consistent with the brief's own framing that Embla "must still work,
  they're unaffected by this change."

### Handoff to Phase B

- Consume the grid engine via the five `--grid-*` custom properties
  documented above (`repeat(var(--grid-cols), 1fr)` +
  `grid-column: span N` per §4.5) — they're already live on `<html>`
  before first paint on every route, no additional wiring needed.
- Delete `WorkStrip.tsx` and replace its one call site
  (`src/app/page.tsx`) with the new flowing asymmetric media grid — the
  static-grid version left in place this phase is explicitly a holdover,
  not something to extend.
- `theme="auto"` on `<ThemeSection>` is ready to use for any section that
  should track the user's dark/light choice rather than render a fixed
  ink/republic/paper/accent look.
- `<CatalogueBracket index={n}>{label}</CatalogueBracket>` is ready for
  the homepage/work grid's `[ 01 ]  CLIENT — TITLE` labels — remember
  `index` must be the item's position across the *whole* work archive,
  not per-category.
- `<CharHoverLink text="…">` is available for any future nav-style link
  (the brief specifically calls out Journal's new nav link) — wrap it in
  the existing `<MixBlendHover>` the same way the four current nav links
  do, don't reimplement the contrast mechanism.
- `useAppearance()` (`@/lib/appearance`) is the hook for any component
  that needs to read or react to the user's dark/light choice going
  forward, beyond the nav toggle and `theme="auto"` itself.

---

## v3 Phase B — content layer v3 + homepage flowing grid (this section)

Scope: §7 content-layer changes (heritage removal, leadership bio trims,
Journal content type, case media video budget) and §6.1's homepage
rebuild — §11 build-order steps 4-6. Phase A's grid engine, appearance
toggle, `CatalogueBracket`, and GSAP removal are consumed as-is, not
rebuilt (see the previous section's "Handoff to Phase B" list — every
item on it was used).

### Content layer

- **`content/clients.ts`**: `tier`/`heritageWork`/`HeritageCard` deleted
  outright — `Client` is now just `{ name: string }`, and the roster is
  the eight current clients only. The one other call site,
  `src/app/studio/page.tsx`'s "BEFORE THE REPUBLIC" section (v2's
  Budweiser/Guinness/NamPost heritage-work cards), is also deleted
  outright rather than left importing a type that no longer exists —
  Phase C owns the full Studio rebuild, but leaving that section in a
  broken-import or still-heritage-rendering state for one phase would
  violate v3's LOCKED "no heritage tier, anywhere" rule in the interim,
  which matters more than keeping Studio's diff minimal this phase. A
  `v3 NOTE` doc comment marks the deletion for Phase C.
- **`content/team.ts`**: Ola Olowu's bio rewritten to 59 words (was ~120,
  spec caps at ~60), Daniel Emeka's to 56 — both now describe role/focus
  *at* The Republic only. Ola's old bio's two forbidden references
  ("Guinness Africa Special", "the launch of Budweiser in Nigeria") are
  gone, not softened — replaced with what he actually chairs (strategic
  direction, cultural insight over borrowed formats), not a scrubbed
  version of the same career narrative. Daniel's bio already had no
  pre-Republic employer references; it was trimmed for length only, same
  Republic-only scope preserved.
- **`content/site.ts`**: added `defaultAppearance: "dark"` as a content-
  layer documentation flag — the actual mechanism is still
  `src/lib/appearance.ts`'s `DEFAULT_APPEARANCE` constant (a boot-script
  string can't `import` this module, same constraint as the grid
  engine's boot script, see the Phase A section above); the two must be
  kept in sync by hand if the default ever changes. `flags.showKigali`
  was already `false` — confirmed, not changed.
- **`content/journal/types.ts` + `content/journal/index.ts`**: new. Body
  format is **stored markdown** (a plain string field), not pre-rendered
  HTML and not an `.mdx` file per entry — chosen because (a) entries live
  as plain data objects alongside every other content file in this repo
  (`content/work/*.ts`, `content/team.ts`), and introducing `.mdx` files
  here would mean a second, structurally different content-authoring
  pattern for exactly one content type; (b) storing markdown as a string
  keeps `JournalEntry` a plain serialisable object with no build-time
  MDX-compilation step, consistent with how every other content file in
  this repo works; (c) rendering is explicitly deferred to Phase C
  (`react-markdown` vs `next-mdx-remote` is a rendering-layer decision,
  not a storage-format one) — Phase C can render a markdown string with
  either without touching this file. `journalEntries` ships genuinely
  empty (`[]`), not seeded with placeholder/fake entries — inventing a
  press mention or award would violate the same zero-fabricated-proof
  rule that keeps every case's `quote` field unpopulated. `getJournalEntries(type?)`
  is the accessor Phase C should read through (sorts newest-first,
  filters by `type` when given) — mirrors the `getLiveCases()`/
  `getFeaturedCases()` accessor pattern in `content/work/index.ts` rather
  than having call sites import the raw array.
- **Case media video budget**: each of the 8 seed cases already had
  exactly one `type: "video"` entry (the `hero` kind). Converted each
  case's `wide` entry from `image` to `video` (added a `poster`, kept the
  same `src` placeholder id, appended "(grid loop)" to the `alt` text) so
  every case now ships 2 video entries — enough for the homepage's
  video-native grid to draw a video from a case without exhausting it
  down to zero remaining videos. Did not attempt the full "2-3 grid-
  weight loops + 8-12 stills + 1 detail sequence" shot-list rebuild
  §8 describes — that's a production/asset-scoping exercise, explicitly
  out of scope this phase per the brief, and every media item is still a
  procedural placeholder either way.

### Real, genuinely-playing `<video>` placeholders — `src/components/SceneVideo.tsx`

§6.1's Row 1 needs a native video cell that's actually playing, not a
static image styled to look like it could be — but this sandbox has no
`ffmpeg`, no video-encoding library, and (per Phase A's "Placeholder
media strategy" section above) no reachable image/video CDN either. No
encoded video file could be produced or fetched by any means available
in this environment.

The approach: `SceneVideo`/`CaseVideo` draw the *exact same* procedural,
seed-deterministic, five-token scene `generateScene()` already produces
for `<ScenePlaceholder>`, but onto a `<canvas>` (via a hand-written
switch over each `SceneShape` variant — circle/rect/line/polyline —
mirroring `ScenePlaceholder.tsx`'s own SVG-element switch), animate it
with a slow, seeded, per-shape opacity drift (`requestAnimationFrame`,
gated to 12fps/2fps normal/reduced-motion), and feed the canvas's own
`captureStream(fps)` `MediaStream` directly into a real `<video>`'s
`srcObject`. No file exists anywhere — the browser is genuinely decoding
a live stream and painting real, changing frames, frame over frame.
Verified in Playwright: every such `<video>` reports `readyState: 4`
(`HAVE_ENOUGH_DATA`), `paused: false`, `hasSrcObject: true`, and the
required `autoplay`/`muted`/`loop`/`playsinline` attributes are real
DOM properties, not just styled to look that way. `muted` is load-
bearing here, not decorative — a `MediaStream`-sourced `<video>` won't
satisfy autoplay policy without it.

Kept in its own file rather than added as a mode flag on
`ScenePlaceholder.tsx`: canvas/rAF/`MediaStream` all require a client
boundary, and `ScenePlaceholder.tsx`'s own doc comment states it's
deliberately Server-Component safe (no hooks) so the large majority of
plain-SVG media slots across the site don't ship extra client JS.
`ASPECT_BY_KIND` was exported from `ScenePlaceholder.tsx` so
`SceneVideo.tsx` doesn't duplicate the per-kind aspect-ratio table.
Colour resolution (`var(--color-x)` → an actual canvas `fillStyle`)
reads the live custom property via `getComputedStyle` at draw time (so a
future palette edit in `globals.css` is still respected), falling back
to a hand-copied hex mirror only if that read is unavailable — same
"boot-script mirror, live value wins" pattern as
`GRID_ENGINE_BOOT_SCRIPT`/`APPEARANCE_BOOT_SCRIPT` in the Phase A
section above.

Reduced motion: amplitude/speed are turned down (not fully removed) —
this is ambient background media, not a UI transition with a resolved
end state, so full-stop doesn't obviously apply the same way it does to
`Reveal`/`GridRow`'s entrance stagger; a much subtler drift felt like the
more defensible reading of "collapse motion" for a decorative loop that
has no "settled" frame to jump to.

### `src/lib/useGridCols.ts` + `src/lib/gridSpans.ts` — turning `--grid-cols` into real `grid-column: span N`

§4.5's own guidance is `grid-template-columns: repeat(var(--grid-cols), 1fr)`
with items spanning `grid-column: span N`. The complication: `--grid-cols`
isn't a fixed number — it's 6-8 on mobile, 12-16 on desktop, chosen by
`pickColumnCount(width)` — so "half width" can't be a single hardcoded
Tailwind `col-span-N` class; it has to be computed from whatever the
*actual current* column count is.

`useGridCols()` is a small `useSyncExternalStore` hook that reads the
live `--grid-cols` custom property back out of `document.documentElement`
or width and re-reads on `resize`/`orientationchange`. It doesn't
duplicate `GridEngineClient`'s own debounced resize handling — it reads
*after* GridEngineClient has already written the new value, with its own
180ms delay (strictly longer than `GridEngineClient`'s 120ms debounce) so
it never reads a stale number mid-resize. `computeSpans(cols, fractions)`
(`src/lib/gridSpans.ts`) then turns width fractions like `[0.5, 0.25,
0.25]` into integer spans that always sum exactly to `cols` (largest-
remainder rounding, the standard method for "integers that must sum to a
fixed total") — this matters because independently rounding each
fraction can leave a 1-column gap or overflow depending on whether
`cols` divides evenly, which would either leave a visible gap in the row
or silently push the last item onto an unwanted second line.

`src/components/WorkGrid.tsx`'s `<GridRow fractions={[...]}>`/`<GridCell>`
are the reusable primitives built on top of this — genuinely reusable,
not homepage-specific: no homepage copy, case data, or row sequencing
lives in that file, only the span math + the `whileInView` stagger
(`staggerChildren: 0.04`, ~40ms per item, collapsing to a 0.15s opacity-
only fade under reduced motion, mirroring `Reveal.tsx`'s existing
pattern/hook choice). **Phase C's Work index page can import `<GridRow>`/
`<GridCell>` directly** rather than re-deriving the span math — this was
built with that reuse in mind. The specific 6-row §6.1 sequence (which
rows get which fractions, which slots are video vs image, the manifesto/
CTA placement) lives in `src/app/page.tsx` itself and is homepage
content, not part of the reusable layer.

### Homepage empty-state treatment — the real design decision

All 8 seed cases are `status: "pending-approval"`, so `getLiveCases()`
returns `[]` today and every media slot in rows 1/3/4/5 has no real case
to show. Two options were on the table: collapse the whole grid to one
`<CasesEmptyState>`-style block (the existing "CASES IN REVIEW" pattern
used on `/` pre-Phase-B and on `/work`), or keep the full row rhythm and
render an honest placeholder in each cell.

**Chose the latter, per-cell placeholders** — not just because the brief
suggested considering it, but because §6.1 states outright that the grid
*rhythm itself* (half/quarter/full-width proportions, video mixed with
stills across a row) is "the highest-priority visual proof point," and
that proof is exactly as valid before real cases exist as after —
collapsing eight cells into one static "check back soon" panel would
throw away the one thing this phase was specifically asked to
demonstrate. Each empty cell:

- Renders a real procedural placeholder (`<ScenePlaceholder>`/`<SceneVideo>`),
  category chosen by rotating through the full ten-category set
  (`archiveIndex % SCENE_CATEGORIES.length`) purely for cell-to-cell
  visual variety — the category carries no meaning about which real case
  will eventually occupy that slot.
- Carries an honest `[ CASE PENDING APPROVAL ]` label (`<Bracket>`,
  reusing the same device as `<CatalogueBracket>`) instead of a
  fabricated client/title pair — never a real case's `client`/`title`
  rendered as if live, which would violate "pending never renders
  publicly" even in a decorative/placeholder-adjacent context.
- Is not a link (no `/work/[slug]` destination exists yet for it),
  unlike a real slot, which wraps in `<Link href={`/work/${item.slug}`}>`.

**Fully data-driven, not hardcoded**: `buildSlots()` zips `getLiveCases()`
1:1 against the 8 slots in archive order (rows 1/3/4/5, left to right,
top to bottom) — the moment cases start clearing approval, each one
fills the next slot automatically, `CatalogueBracket`'s index tracks its
real position in the whole archive, and the exact same row/fraction
layout renders with zero code changes. The 8-slot/8-seed-case count
lining up exactly is coincidental to this seed set, not a hardcoded
assumption — `buildSlots` degrades gracefully (real cases fill from slot
0, remaining slots stay placeholder) for any count above or below 8.

**Caption legibility at extreme mobile widths**: found via this phase's
own Playwright/screenshot pass — at the narrowest mobile band (6 cols),
a "quarter" cell can round down to a single ~48px-wide column, and the
placeholder's internal overlay caption (`"PLACEHOLDER — REPLACE WITH …"`,
a full sentence) was wrapping unbounded and visually dominating the tiny
cell. Fixed by clamping both the internal overlay caption
(`ScenePlaceholder.tsx`/`SceneVideo.tsx`) and the per-cell label under
each grid item (`CatalogueBracket`/the `CASE PENDING APPROVAL` line in
`page.tsx`) to `line-clamp-2`, with the full text still available via
`role="img" aria-label` (already existing) and a new `title` attribute
on the overlay span. No DOM-level overlap existed at any point (verified
via `getBoundingClientRect()` on every grid cell before this fix too) —
this was a text-legibility issue inside a correctly-laid-out cell, not a
layout bug, but a real one worth fixing since a caption that becomes
unreadable mush undermines the "grid rhythm is part of the proof" point
above.

### §6.1 — the exact row structure `src/app/page.tsx` implements

One continuous `<ThemeSection theme="auto">` (this is the first real use
of the `"auto"` theme the previous phase built and flagged as unused —
it's the correct fit for "the page's default reading surface," per that
section's own framing) wraps rows 1 through 5; the closing CTA is a
separate `<ThemeSection theme="republic">` via the existing, unmodified
`<CtaBand>`, per §6.1's "styled as a colour field, not media" requirement.

| row | layout | content today | content once live |
|---|---|---|---|
| 1 | half + half | 2 empty-state cells (image, video) | 1st 2 archive cases (image, video) |
| 2 | full width | `<ManifestoLine>` word-by-word `whileInView` stagger + "All work →"/"Our services →" | unchanged — never media |
| 3 | half + quarter + quarter | 3 empty-state cells (video, image, image) | archive cases 3-5 |
| 4 | full width | 1 empty-state cell (video) | archive case 6, hero-weight |
| 5 | half + half | 2 empty-state cells (image, video) | archive cases 7-8 |
| final | full width, Republic Blue field | `<CtaBand>`, unchanged | unchanged |

`<ManifestoLine>` (new) does the word-by-word stagger via a `motion`
`staggerChildren` container (not GSAP), reusing `<Bracket>` (not
`<BracketFill>`, which types in on a mount timer rather than a scroll
trigger — a different mechanism for a different trigger) for the
"CITIZENS" bracket-fill treatment. The two buttons beneath it
deliberately do *not* use `<MixBlendHover>` — that device is reserved for
exactly Nav links + the Start-a-project button + one primary CTA per page
(`CtaBand`) per the existing §4.6.7 rule documented in the Phase A/B
sections above; these are secondary links, styled like the homepage's
existing `mono-label … hover:text-republic` pattern instead.

### Verification run (this phase)

`npx tsc --noEmit`, `npx eslint src content scripts`, and `npm run build`
(Turbopack, Next 16.2.10) all clean. `npm run palette` re-run after the
case media video-budget change (adding video entries to each case) —
still produces 8 valid accents, all AA-passing against paper, confirming
the script's slug-hash approach is unaffected by media-array shape
changes (it never reads `media` at all).

`npm start` against the production build, driven with Playwright
(`chromium`, `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`):

- Grid cols at all five required breakpoints match the Phase A table
  exactly (6/8/13/14/16 at 360/768/1024/1440/1920) — the homepage's own
  `<GridRow>` doesn't recompute or override these, it only reads them.
- 4 real `<video>` elements present on `/` at 1440px (rows 1, 3, 4, 5's
  video slots), each with `autoplay`/`muted`/`loop`/`playsInline` true,
  `readyState: 4`, `paused: false`, `hasSrcObject: true` — genuinely
  playing, not styled placeholders.
- No horizontal overflow (`document.documentElement.scrollWidth <=
  clientWidth`) at 360/375/768/1024/1440/1920.
- `whileInView` stagger: under `page.emulateMedia({reducedMotion:'reduce'})`,
  the manifesto's first word and grid items resolve to `opacity: 1`
  near-instantly on scroll-into-view; under normal motion, same resolved
  end state after the transition completes — both verified via a real
  incremental `scrollTo` loop (not a single `fullPage` screenshot, which
  turned out to be a false-negative signal: Chromium's `fullPage`
  screenshot capture does not itself trigger `IntersectionObserver`
  entries the way scrolling through the viewport does, so a naive single-
  shot `fullPage` screenshot right after `networkidle` showed rows 3-5 as
  blank/uncomposited even though a real user scrolling down sees them
  render correctly — re-verified by manually `scrollTo`-ing in ~300-400px
  increments before capturing, which is the accurate test).
- No-JS (`javaScriptEnabled: false`): `/` returns 200, `--grid-cols`
  reads the static CSS fallback (`4` at 375px), real `<a href="/work">`
  anchors present — unchanged from Phase A, confirmed still true with
  the new homepage markup specifically (not just "in the abstract," per
  this phase's own instruction).
- `/`, `/work`, `/studio`, `/services`, `/contact`, `/legal/privacy` all
  200; `/studio` confirmed to contain none of "Budweiser"/"Guinness"/
  "NamPost"/"BEFORE THE REPUBLIC" post-edit, and to render both
  leadership bios' new Republic-only copy.
- `grep -rn "gsap\|ScrollTrigger"` — zero import/call sites (prose
  comments only, same as the Phase A baseline). `grep -rn "heritage"` —
  zero outside doc comments explaining the removal.
  `grep -rn "Guinness\|Budweiser\|NamPost"` — zero outside the one
  `studio/page.tsx` doc comment describing what was deleted. `grep -rn
  "purple"` — zero.

### Handoff to Phase C

- The Journal content API is `content/journal/index.ts`'s
  `getJournalEntries(type?)` — returns `[]` today by design, sorted
  newest-first when non-empty. `JournalEntry.body` is a markdown string;
  pick `react-markdown` or `next-mdx-remote` for rendering, nothing here
  assumes either.
- `<GridRow>`/`<GridCell>` (`src/components/WorkGrid.tsx`) are reusable —
  built with the Work index page specifically in mind. The homepage's
  specific row/fraction/slot sequence in `src/app/page.tsx` is not
  reusable as-is (it's homepage content), but the primitives underneath
  it are.
- `src/components/SceneVideo.tsx`'s `<CaseVideo>` (real, genuinely-
  playing `<video>` placeholder) is available anywhere a case's video
  media needs to render as an actual video element rather than
  `<ScenePlaceholder isVideo>`'s static SVG-with-badge treatment — the
  Work index page and case-detail template are both reasonable next
  call sites.
- `src/app/studio/page.tsx`'s heritage section is fully removed, not
  just stubbed — Phase C's Studio rebuild starts from a page with no
  heritage content to strip, only the remaining five sections (hero,
  three-line manifesto, method/laws, leadership, footprint) to work with.
- `content/clients.ts`'s `Client` type lost its `tier` field — any Phase
  C component reading client data should expect `{ name: string }` only.

## v3 Phase C — Work/Studio/Services/Journal/Contact finish, footer rebuild, full audit (this section, final)

Scope: §11 build order steps 7-12 — the last phase before handoff. Builds
on v3 Phase A (grid engine, appearance toggle, character-hover nav) and
Phase B (content layer, homepage flowing grid) to finish every remaining
page, rebuild the footer, and run the full audit pass.

Note on how this phase actually happened: this session ran concurrently
with another agent working the identical task against the same working
tree (not a hypothetical — `next build` genuinely collided mid-session,
and several files listed below were built/refactored by the other process
while this one was reading/reviewing them, most visibly `WorkArchive.tsx`
+ `CaseGridSlot.tsx` — the Home/Work shared grid-cell extraction — and
Studio's `HoverRevealText` manifesto wiring). Rather than duplicate that
work, this session deferred to it once verified consistent and focused on
the parts that stayed unclaimed: `content/work` sector/market taxonomy
below (confirmed already in place, reviewed rather than redone), the
Journal pages end-to-end, the footer rebuild, sitemap/OG additions for
Journal, and the final audit/build/push. Every file this section claims
credit for was independently verified against the spec before being left
alone or built.

### Sector/market taxonomy for the 8 seed cases (§6.2 filters)

`content/work/types.ts` gained `sector: string` / `market: string` —
structural classification metadata only, distinct from `results`/`quote`
(which stay empty/omitted, never fabricated). Sector/market are safe to
populate ahead of client sign-off because they're not a claim about
outcomes, just what industry and geography the real, publicly-known
client operates in — the same category of fact as `client: "Chivita"`
itself, already public via `content/clients.ts`'s "Trusted by" strip.

Assignment (inferred from each case's real client, sensibly, not
invented):

| case | sector | market |
|---|---|---|
| chivita-style-n-sips | FMCG & Beverage | Nigeria |
| pzl-you-matter | FMCG & Personal Care | Nigeria |
| zenith-homecoming | Financial Services | Nigeria |
| twisco-everyday-hero | FMCG & Beverage | Nigeria |
| cowbell-mumtales | FMCG & Beverage | Nigeria |
| i-invest-secure-the-bag | Fintech | Nigeria |
| sanlamallianz-live-with-confidence | Insurance | Pan-African |
| heirs-insurance-launch | Insurance | Nigeria |

All eight cases share `market: "Nigeria"` except Sanlam Allianz
("Pan-African" — the entity itself is a post-merger pan-African insurer,
not a single-market Nigerian brand, unlike the other seven clients) —
this is a real, honest reflection of the roster (every other client here
genuinely is a Nigeria-headquartered/Nigeria-market brand), not a
cosmetic attempt to manufacture filter diversity. `getWorkFacets()`
(`content/work/index.ts`) derives the /work filter pills from whatever's
actually present on the live case pool, so the pill list is never stale
against this table and never leaks a pending case's sector into the UI.

### /work filter semantics — OR within a facet, AND across facets

Three facets: service, sector, market. Selecting more than one pill
*within* one facet is OR ("Content & Social" OR "Brand & Creative" — an
archive browse where widening one axis should show more, not fewer,
results). Selecting pills *across* facets is AND (a case must match the
selected services AND the selected sectors AND the selected markets). An
empty selection in a facet imposes no constraint from that facet at all,
so the all-clear state (nothing picked anywhere) shows every live case —
this is the standard faceted-search reading and the one that keeps
"select everything" behaviourally identical to "select nothing" per
facet, which is the least surprising outcome for a first-time user
combining filters. Implemented in `WorkArchive.tsx`.

### Journal — build (`/journal`, `/journal/[slug]`)

`/journal`: H1 `[ PERSPECTIVES ]` via `<Bracket>`, intro copy per spec,
type filter (Perspective/Press/Recognition) that only renders pills for
types actually present in the live entry pool (mirrors `/work`'s
"never show a filter that filters nothing" pattern). Grid
(`src/components/JournalGrid.tsx`) reuses `<GridRow>` from
`WorkGrid.tsx` directly — same fluid engine as Home/Work, scaled down to
card size (three-per-row text cards rather than media tiles, since a
Journal entry has no hero image slot in the current schema). Empty state
is the real, required, on-brand `[ NOTHING PUBLISHED YET — CHECK BACK ]`
— `getJournalEntries()` returns `[]` today (see `content/journal/
index.ts`, v3 Phase B), and this is an honest current state, not a
placeholder waiting to be filled with invented press/award copy.

`/journal/[slug]`: title, date, type tag, body, optional linked-case
link (only rendered if `linkedCase` is set AND resolves to a *live* case
via `getLiveCaseBySlug` — never trust a stored slug alone to gate a
public link, same rule Services' `aiNativeCallout.caseSlug` already
follows). `generateStaticParams()` reads `getJournalEntries()`, so it
correctly produces zero routes today and will produce real ones the
moment a real entry is added — no code change needed at that point.

**Markdown-rendering approach**: a small hand-rolled paragraph/heading/
list splitter (`src/components/JournalBody.tsx`), not `react-markdown`.
`JournalEntry.body` (per v3 Phase B's schema) is always agency-authored
prose — paragraphs, occasional `## `/`# ` subheadings, occasional `- `
bullet lists — never arbitrary third-party markdown needing tables, code
fences, embedded HTML, or footnotes. A dependency-free ~40-line splitter
covers exactly that shape; pulling in a full CommonMark parser for a
content type this constrained would be more dependency than the actual
data justifies. It's a server component (no client JS at all for a page
that's pure text), unlike everything else added this phase that touches
interactivity. If a future entry's copy genuinely needs richer markdown
(tables, etc.), swap this one file for `react-markdown` — nothing about
the page or the content schema needs to change to make that swap, since
`body` was always stored as plain markdown text specifically to keep this
decision reversible.

### Footer rebuild — the four-element version, everywhere

`src/components/Footer.tsx` fully rebuilt (not patched) to exactly:
wordmark · `LAGOS · [live time]` · "New Business" → email (+ any
confirmed socials) · © + Privacy link. The old three-column v2 footer
(sitemap nav column, phone number, address block) is gone outright — a
page-closing footer that repeats the whole nav a user just saw in the
header adds nothing on a five-route site.

**Live Lagos time** (`src/components/LagosClock.tsx`): `Intl.
DateTimeFormat` with an explicit `timeZone: "Africa/Lagos"`, so the
displayed time is always Lagos local regardless of the visitor's own
timezone or system clock setting — `Intl` handles the UTC-offset/DST
math internally from the explicit IANA zone name, no manual offset
arithmetic. Updates every 60s via `setInterval` inside a mount effect.

Per spec's explicit pointer, this follows the repo's own established
"class of bug" fix rather than reinventing an approach: `Reveal.tsx`'s
doc comment documents a real, previously-hit hydration mismatch from a
value that's synchronously different between server and client
first-render (there: `motion/react`'s `useReducedMotion()` reading
`matchMedia` synchronously on the client with no server equivalent). A
clock is the same class of problem in a more literal form — the *value
itself* (not just a boolean) is only ever knowable client-side, and it
changes on its own schedule independent of any external store a
`useSyncExternalStore` pattern (the reducedMotion/appearance/grid-cols
convention elsewhere in this codebase) could subscribe to. The fix
applied is the same shape as Reveal's: render a fixed, deterministic
placeholder (`"--:--"`, identical in server HTML and the client's first
hydration pass — deliberately NOT a build-time-computed Lagos timestamp,
which would actually be a *second*, subtler source of the same bug, since
this app is statically prerendered and a build-time value would go stale
and diverge from a fresh `new Date()` call the moment the client's own
module evaluates at a genuinely different wall-clock moment than the
server did) and correct it to the real live value inside a post-mount
effect, deferred one tick via `setTimeout(..., 0)` before the first
`setState` call specifically to satisfy `eslint-plugin-react-hooks`'
`set-state-in-effect` rule — the same pattern Preloader.tsx already
established for its own post-mount session-gate write (see Phase A's
DECISIONS.md section). No-JS visitors see the static `LAGOS · --:--`
placeholder rather than a fake or stale live-looking value — an honest
degrade, not a silently-wrong one.

**Socials**: `Footer.tsx` maps `content/site.ts`'s `socials` array
directly — currently empty (no confirmed Instagram/LinkedIn URL), so
nothing renders in that slot today. Zero placeholder/invented URLs
shipped, per the standing rule already documented in `content/site.ts`
itself.

### Studio — finishing what Phase B started

Section order confirmed exactly per spec: Hero → Manifesto (hover-reveal)
→ Method/Reaction Standard (`id="method"`) → Team (leadership first, full
grid after) → Footprint (Lagos HQ, markets, Kigali gated). No heritage
section, no awkward gap where it used to sit — Phase B's removal was
already a clean full-section delete (confirmed by reading the page before
this phase touched it: five sections, no orphaned spacing/wrapper left
behind), so there was nothing to visually repair this phase.

The one real gap this phase closed: the manifesto section had regressed
to a plain scroll-`Reveal` (correct copy, all three lines, but no hover
interaction) after v3 Phase A's GSAP-era cleanup removed the standalone
`HoverReveal.tsx`/`HoverRevealText` components along with everything else
GSAP-adjacent, even though `HoverReveal.tsx` itself has no GSAP
dependency (it's plain `motion/react` + CSS) and was over-pruned in that
sweep. This phase re-wires Studio's three manifesto lines through
`HoverRevealText` (one key word per line — CLARITY / SYSTEMS / OUTCOMES —
each opening a small placeholder-scene popover on hover/focus/tap),
restoring the "hover-reveal, retained from v2" behaviour the spec calls
for, on top of `HoverReveal.tsx`'s already-built, already-reduced-motion-
aware mechanism (see Phase B's DECISIONS.md section for its
implementation details) — no new component needed, just wiring a real
call site back onto one that had gone unused after the cleanup.

### SEO/OG — Journal routes

`src/app/journal/opengraph-image.tsx` and `src/app/journal/[slug]/
opengraph-image.tsx` added, both built on the shared `renderOgImage()`
helper (`src/lib/og.tsx`) every other route already uses — "blue field,
mono type, per-page title," `[ THE REPUBLIC ]` eyebrow, no visual
divergence from the rest of the site's OG images. The `[slug]` variant's
`generateStaticParams()` mirrors the case-template OG image's own
pattern: reads `getJournalEntries()`, so it correctly produces zero
prerendered images today and picks up real ones automatically the moment
an entry is added. `sitemap.ts` now includes `/journal` and, once real
entries exist, `/journal/[slug]` for each (`lastModified` sourced from
the entry's own `date` field rather than "now", so the sitemap reflects
actual publish dates instead of every entry appearing simultaneously
"updated" on whatever day this ran). `robots.ts` already excluded `/dev`
from Phase A; unchanged, still correct.

### Verification (this session)

- `npx tsc --noEmit` — clean, zero errors.
- `npm run lint` (ESLint) — clean, zero warnings/errors.
- `npm run build` — clean, all 24 routes compiled (Home, Work, Work
  case-template ×2 static params today would be 0 since all 8 seeds are
  still pending-approval, Studio, Services, Journal, Journal entry
  template, Contact, legal/privacy, sitemap.xml, robots.txt, icon, four
  dev routes, nine opengraph-image routes).
- `npm start` against the real production build, hit with `curl`: `/`,
  `/work`, `/studio`, `/services`, `/journal`, `/contact`,
  `/legal/privacy` all `200`; an unknown path `404`s through
  `not-found.tsx`; a case slug (`/work/chivita-style-n-sips`) correctly
  `404`s since every seed case is still `pending-approval`; `/dev/
  placeholders` correctly `404`s in the production build (Phase A's
  `NODE_ENV === "production"` gate); `/journal` correctly renders the
  `NOTHING PUBLISHED YET — CHECK BACK` empty state in the actual served
  HTML; the footer's `LAGOS ·`, `New Business`, and `© 2026 The
  Republic.` strings all present in the served markup; `/journal` present
  in nav markup (5-item nav confirmed: Work/Studio/Services/Journal/
  Contact).
- Forbidden-content grep (`gsap`/`ScrollTrigger`, emoji, lorem ipsum,
  purple, Guinness/Budweiser/NamPost, "Submit" button copy) — all
  remaining hits are prose comments describing their *absence/removal*,
  never live code paths or rendered copy. No `status: "live"` seed case.
- Reduced-motion / no-JS: audited by code review (no Playwright browser
  available in this sandbox session) — every animated pattern sits behind
  either `usePrefersReducedMotion()`/`prefersReducedMotion()`
  (`@/lib/reducedMotion`) or `motion/react`'s own `useReducedMotion()`,
  per the established per-Phase convention, and every static no-JS
  fallback (grid engine's CSS-only baseline, nav's plain `<Link>` markup,
  footer's static placeholder clock) was confirmed to render real,
  navigable content with zero script execution.

### Final TODO punch-list (consolidated, from all phases)

Real, outstanding, non-code work needed before this site can be
considered client-ready — nothing on this list is a code defect, all of
it is confirmation/asset/sign-off work outside an engineering session's
ability to resolve:

1. **Leadership titles** — confirm "Chairman & Co-Founder" / "Managing
   Director & Co-Founder" (`content/site.ts`, `content/team.ts`) are the
   exact, final titles Daniel wants public.
2. **Real socials** — confirm and add real Instagram/LinkedIn (and any
   other) URLs to `content/site.ts`'s `socials` array; currently empty by
   design (no placeholder/invented links shipped) so the footer and
   Organisation JSON-LD's `sameAs` both stay quiet until this happens.
3. **Case results** — every one of the 8 seed cases ships `results: []`
   and no `quote`; real, client-approved numbers/quotes needed before any
   case can show more than "Results under NDA — ask us."
4. **Kigali confirmation** — `content/site.ts`'s `flags.showKigali` stays
   `false` until the Rwanda footprint is publicly confirmable; flip the
   one flag when it is, no other code change needed.
5. **Canonical six Reaction Standard laws** — `content/laws.ts` has 2
   live, 4 slotted `[ LAW PENDING ]`; pull the canonical six from the
   master doc.
6. **Client logo display rights** — `content/clients.ts`'s 8-name roster
   is text-only; confirm which clients grant logo display rights before
   any logo imagery is added.
7. **Case copy sign-off** — every case's `brief`/`idea` copy carries a
   `// TODO: verify with Daniel` comment; needs a real approval pass
   before any case can flip `status: "live"`.
8. **Talent releases** — any case media eventually featuring real people
   (the creator-led Chivita/Cowbell/PZ Cussons cases especially) needs
   signed releases before real photography/video replaces the procedural
   placeholders.
9. **Wordmark/R-mark SVG** — every "The Republic" wordmark instance
   sitewide (nav, footer, OG images, favicon) is still set type
   (`display-type` class) or a placeholder `/icon` route, not a
   designed logotype/mark; commission and swap in once available — see
   `src/app/icon.tsx`.
10. **Expanded per-case shot list** — per spec, 2-3 grid-weight loops +
    8-12 stills + 1 detail sequence per case; today each case has exactly
    8 `Media` entries (1 hero, 1 wide, 2 gallery-pair, 3 carousel, 1
    ticker-chip) — real photography/video needs a materially larger shot
    list per case than the placeholder system currently models.
11. **Team photography** — every team member (leadership and wider roster
    alike) renders `<Avatar>`'s initial-monogram placeholder; a real B/W,
    grain, consistent-crop shoot is needed before real photography can
    replace it (AI-generated portraits remain forbidden regardless).
12. **Client logos** — see #6; once display rights are confirmed, actual
    logo files are still needed (none exist in this repo today).
13. **Confirmed social URLs** — see #2; listed separately here since it's
    also referenced by the Organisation JSON-LD's `sameAs`, not just the
    footer.

### v3 Phase C — follow-up: grid horizontal-overflow fix (post-audit)

A post-commit Playwright audit (full `document.scrollWidth` check at
360/768/1024/1440/1920 across every page) surfaced real horizontal
overflow on `/work` (360/768/1024) and `/journal` (360) — not present on
Home, which uses wider per-row cells. Two independent, complementary
causes, both now fixed:

1. **CSS grid blowout.** `<GridRow>` used `repeat(var(--grid-cols), 1fr)`.
   An `fr` track's implicit minimum is `auto` (its content's min-width),
   so an archive/journal row packing three cells against the large
   `--grid-gutter` at a narrow viewport refused to shrink below the widest
   cell's intrinsic content and pushed the grid past its container. Fixed
   canonically: `repeat(var(--grid-cols), minmax(0, 1fr))` on the track
   plus `min-width: 0` on each `<GridCell>`, so tracks can shrink and
   content clamps (line-clamp) inside the cell instead of forcing width.
   `<Bracket>` was also made shrink/wrap-safe (`max-w-full flex-wrap`,
   `min-w-0 shrink basis-0 grow break-words`) so a bracketed label inside
   a very narrow cell wraps rather than setting a large min-width. Home is
   unaffected (its cells were always wide enough) — this is a pure
   robustness fix on the shared primitives.
2. **Nav width at tablet.** Adding the fifth nav item (Journal) widened
   the desktop nav row past the 768px tablet width. Moved the desktop-nav
   breakpoint from `sm:` to `lg:` (nav row shows at ≥1024px; the mobile
   overlay menu covers 768–1023px), which the five-item nav needs. The
   `<AppearanceToggle>` remains reachable in both the desktop nav and the
   mobile overlay, so nothing is lost below `lg`.

Re-verified in Playwright: zero horizontal overflow on Home/Work/Journal/
Studio/Services/Contact at all five breakpoints, and the nav correctly
shows the mobile menu at 768 and the desktop nav at 1024.
