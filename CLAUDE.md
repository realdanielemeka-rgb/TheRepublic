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
- No fabricated claims, metrics or credits. Figures carried over from the old site are shown as published there; any new figure needs a source.
- Name talent and creators only with documented consent. Captions stay generic otherwise. Credits list only confirmed roles; unconfirmed partner rows are left out, not marked "TBC".
- Show client logos only for relationships the MD has confirmed.
- Team portraits are AI-generated studio portraits. At launch (3 October 2026) the MD decided to show them without a label. New portraits: generate from the person's own photos in the same style (black backdrop, low-key light, all-black wardrobe, 3:4), and never use another team member's portrait as a pose reference, because the model borrows their face.
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

Vercel's Git integration deploys every push. **`main` is production**; every other branch gets a preview URL (behind Vercel login). Work on `immersive-site` (or a feature branch), check the preview, then fast-forward `main` to ship. The site is static, so there is nothing to build.

The site is public and indexable (`robots.txt` allows all, `sitemap.xml` lists the home page). The contact form, contact drawer and newsletter sign-up hand off to the visitor's email app (mailto) because the site has no backend.

## After launch

1. Point therepublic.agency at the Vercel project. Change only the website records (apex and `www`); leave the MX and other email records untouched so office@therepublic.agency keeps working.
2. Legal review of the privacy notice (retention wording, NDPC registration status).
3. Optional: a form backend (Vercel function with an email service) to replace the mailto hand-off, and a real newsletter list.
4. Captions (WebVTT) for films with dialogue.
5. Real-device performance pass on mid-range Android and iPhone.
6. Absolute share-image URLs per route. Only the home page's are absolute; the rest are set client-side.
