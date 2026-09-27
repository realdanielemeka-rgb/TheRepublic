# The Republic — website

The Republic's agency website (therepublic.agency), rebuilt as an immersive 3D storytelling site to replace the Wix site. The brief: visitors should feel they are entering a different world, and the site must show that The Republic is strategy-driven and creative, with the work as proof.

This branch (`immersive-site`) supersedes the earlier Next.js rebuild, which remains on `claude/republic-nextjs-migration-d1kjey`.

## Layout

- `public/`: everything that is deployed. No build step.
  - `index.html`: the whole site in one file (CSS, markup, JS).
  - `img/` (WebP), `films/` (H.264 MP4 + JPG posters), `og/` (1200×630 share cards), `404.html`, `robots.txt`, favicons.
- `vercel.json`: static deploy (`framework: null`, output `public/`), 301s from the 22 old Wix URLs to their hash routes, headers.
- `tests/`: Playwright regression suite (Python) and axe-core audit.

## How the page works

- Three.js r128 from cdnjs drives one WebGL canvas behind DOM overlays. Fonts are Handjet (`--sign`) and Schibsted Grotesk (`--display`) from Google Fonts.
- Routing is by hash: `ROUTES`, `ALIAS` (old Wix slugs mapped to routes), `parseRoute()`, `applyRoute()`. `#studio/<slug>` opens a person. Page titles come from `TITLES` and `CASEFILES[k].seo`.
- Global state lives in `S`, and the frame loop is `update(dt)`. Scroll position maps to `S.p` on the home page and `S.q` inside worlds and pages. `BEATS` sets each route's scroll length.
- Home ("the Gate"), `BEATS.gate = 6`:
  - 0: the face.
  - 1: the hands and the spark.
  - 2: Creating Tomorrow.
  - 3–5.5: "How we work", in four acts driven by `strategyFrame(p)`: title card, the question reel over restless ground (`uNoise`), one summit rising (`uPeak`), then rings and a shock front (`uRing`, `uShock`).
  - 6: the City of Work.
  - Camera: `KG` covers beats 0–3 and `KGS` (keyed by `at`) covers 3–6.
- Data:
  - Case studies and worlds: `CASEFILES`, `WORLDS`.
  - Films: `FILMS`, with `[data-film]` and `openFilm()`.
  - People: `TEAM` and `LEAD`, which feed `PEOPLE`.
  - Clients: `CLIENTS` (logo marquee).
  - Socials: `SOCIALS` (verified accounts). `WHATSAPP` stays empty until a number is confirmed.
- Performance:
  - `TIER` (0–2) sets resolution and particle count, and resolution also adapts at runtime.
  - Textures load lazily and are released per world.
  - Images are WebP.
  - Keep new films as H.264 MP4 with a JPG poster, around 960px wide and a few MB each.
- Reduced motion (`RM`) is honoured everywhere. Every animated sequence needs a readable still state at whole-number scroll stops.

## Editorial rules (non-negotiable)

- Write in British English, at boardroom quality.
- No fabricated claims, metrics or credits. Results appear only with a source. Figures carried over from the old site keep the "As published on the current site" note until source records are attached.
- Name talent and creators only with documented consent. Captions stay generic otherwise.
- Show client logos only for relationships the MD has confirmed.
- Team portraits are AI placeholders and must stay labelled as such until real photography arrives.
- Add no awards, press or dates without a public proof link.
- Ola Olowu, Daniel Emeka and Aderoju Adeniji lead the Studio page. Everyone else is listed alphabetically with no hierarchy.

## Test

From the repo root:

```bash
python3 -m pip install playwright      # Chromium must be available to Playwright
(cd tests && npm install)              # axe-core
tests/run_all.sh                       # routes, nav, films, old Wix URLs, reduced motion, axe (desktop + phone)
cd tests && python3 gate_test.py gate 3,4,5,6 m   # screenshots of the home sequence into tests/shots/
```

The harness serves `public/index.html` locally and substitutes local copies of Three.js and the fonts (`tests/vendor/`), so runs are offline and deterministic. Headless Chromium cannot decode H.264, so film tests check that the player opens, not playback.

## Deploy

Vercel's Git integration deploys every push; this branch gets a preview URL. The site is static, so there is nothing to build.

Pre-launch safeguards to remove at launch:
- the `X-Robots-Tag: noindex` header in `vercel.json`;
- `Disallow: /` in `public/robots.txt`;
- the "Prototype · Design study" label (`.proto`).

## Launch checklist

1. Content sign-off: results sources, the privacy notice (legal), held-back logos, team roster.
2. Contact form and newsletter delivery. Both use mailto fallbacks today; add a Vercel function (for example with Resend).
3. Captions (WebVTT) for films with dialogue.
4. Real-device performance pass on mid-range Android and iPhone.
5. Remove the pre-launch safeguards above, set the production branch, and point therepublic.agency at Vercel.
6. Absolute share-image URLs per route. Only the home page's are absolute today; the rest are set client-side.
