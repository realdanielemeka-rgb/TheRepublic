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
