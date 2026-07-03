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
