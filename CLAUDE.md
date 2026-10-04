# The Republic — website

The Republic's agency website (therepublic.agency), rebuilt as an immersive 3D storytelling site to replace the Wix site. The brief: visitors should feel they are entering a different world, and the site must show that The Republic is strategy-driven and creative, with the work as proof.

This branch (`immersive-site`) supersedes the earlier Next.js rebuild, which remains on `claude/republic-nextjs-migration-d1kjey`.

## Layout

- `src/site.html`: the page template (all markup for every page; head metadata is written per page by the build).
- `public/assets/app.css`, `public/assets/app.js`: the stylesheet and the app. Edit these directly.
- `scripts/build.py` (+ `scripts/routes.py`, `scripts/services.py`, `scripts/LASTMOD`): writes one pre-rendered HTML file per address into `public/` (`index.html`, `work.html`, `onga-taste-of-home.html`, `services/brand-and-creative.html`, ..., `404.html`), plus `public/assets/routes.js`, `public/sitemap.xml`, `public/robots.txt` and `public/llms.txt`. **Run `python3 scripts/build.py` after any edit**, and commit the output; Vercel does not build.
- `scripts/services.py`: copy, search metadata and proof cases for `/services` and the six service pages (the pages that target "advertising agency in Nigeria" and similar searches). Its keys must match `SVC_PAGES` in `app.js`; the build checks. `scripts/og_cards.py` draws their share cards.
- `public/img/` (WebP), `public/films/` (H.264 MP4 + JPG posters), `public/og/` (1200×630 share cards), favicons.
- `vercel.json`: static deploy (`framework: null`, output `public/`, clean URLs), 301s for `/home` and `/portfolio`, a rewrite so `/studio/<person>` serves the Studio page, headers.
- `tests/`: Playwright regression suite (Python), SEO checks and an axe-core audit.

## How the page works

- Three.js r128 from cdnjs drives one WebGL canvas behind DOM overlays. Fonts are Handjet (`--sign`) and Schibsted Grotesk (`--display`) from Google Fonts.
- Every page has a real address. `scripts/routes.py` maps route keys to paths; case pages keep their old Wix slugs (e.g. `/onga-taste-of-home`) so existing rankings carry over. The build writes the map, titles, descriptions and share images into `public/assets/routes.js` as `window.SEO`; the app's router (`parseRoute()`, `routeFromPath()`, `go()`, `pathOf()`) uses the History API, and old `#route` links are converted to clean paths on load. `/studio/<slug>` opens a person.
- Each built page shows its own section in the raw HTML, carries its own title, description, canonical link, Open Graph and Twitter tags and JSON-LD (ProfessionalService, WebSite, WebPage with breadcrumbs, plus CreativeWork, BlogPosting or the team list where relevant), and has exactly one `h1`. Page headings carry `data-ph`; `setH1(route)` keeps one `h1` in the live DOM as visitors move around. The 9 case files are pre-filled from `CASEFILES` so crawlers see their text. Six flagship worlds (Onga, Cowbell, Chivita, Spruce, Prudential Zenith, Zenith Bank) each have a world route and a hand-written case article in `src/site.html`; `FLAG` sets their order.
- `<base href="/">` is set, so asset paths (`img/...`, `films/...`) resolve from the root on nested addresses. Use root-relative URLs in CSS.
- Global state lives in `S`, and the frame loop is `update(dt)`. Scroll position maps to `S.p` on the home page and `S.q` inside worlds and pages. `BEATS` sets each route's scroll length.
- Home ("the Gate"), `BEATS.gate = 6`:
  - 0: the face.
  - 1: the hands and the spark.
  - 2: Creating Tomorrow.
  - 3–5.5: "How we work", in four acts driven by `strategyFrame(p)`: title card, the question reel over restless ground (`uNoise`), one summit rising (`uPeak`), then rings and a shock front (`uRing`, `uShock`).
  - 6: the City of Work.
  - Camera: `KG` covers beats 0–3 and `KGS` (keyed by `at`) covers 3–6.
- Data:
  - Case studies and worlds: `CASEFILES`, `WORLDS`. A case file can name a flagship it belongs to with `part`. Style N' Sips and 12 Days of Christmas were folded into What's Your Chivita? and We Do Dreams was retired (October 2026); their old addresses 301 in `vercel.json`.
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

## SEO rules

- New page: add its route to `scripts/routes.py`, its title (60 characters or fewer) and description (110–160 characters) to `scripts/build.py`, a 1200×630 share card in `public/og/`, then build. The build refuses duplicate titles or descriptions and more than one `h1`.
- Bump `scripts/LASTMOD` when content changes, so the sitemap dates move.
- `tests/seo_test.py` checks every page as a crawler and as a visitor.
- Service pages may only cite cases published on the site, and only for disciplines the case records show (`SVC` in `app.js`). Never claim "best", rankings or awards on the site without a public source; that standing comes from third parties (directories, reviews, awards, press).
- `robots.txt` welcomes AI crawlers and `llms.txt` gives AI assistants a plain summary; both are generated, so edit the build, not the files.

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
python3 scripts/build.py               # always build first
tests/run_all.sh                       # build check, routes, nav, films, old Wix URLs, SEO, launch wording, reduced motion, axe (desktop + phone)
cd tests && python3 gate_test.py gate 3,4,5,6 m   # screenshots of the home sequence into tests/shots/
```

The harness serves `public/` as the site root and substitutes local copies of Three.js and the fonts (`tests/vendor/`), so runs are offline and deterministic. Locally, pages are at `/work.html` etc. (Vercel serves them as `/work`). Headless Chromium cannot decode H.264, so film tests check that the player opens, not playback.

## Deploy

**Production is Namecheap shared hosting (cPanel, LiteSpeed) on server220.web-hosting.com, web IP 198.54.116.164.** DNS is Namecheap BasicDNS (Advanced DNS in the Namecheap account): `@` A → 198.54.116.164, `www` CNAME → `therepublic.agency.`. The MX, `mail`, `autoconfig`, `autodiscover`, SPF, DKIM and DMARC records belong to the email on the same hosting; never touch them.

To ship: commit the built output and fast-forward `main`. A cPanel cron job (every 15 minutes, added 3 October 2026 with the MD's approval) pulls `main` into `~/repositories/therepublic` and, when the commit has changed, copies `public/` into `public_html`; each publish is logged in `~/autodeploy.log`. To publish at once, use cPanel → Git Version Control → therepublic → Manage → Pull or Deploy → "Update from Remote", then "Deploy HEAD Commit". `.cpanel.yml` copies `public/` into `public_html` (it adds and overwrites, never deletes; remove retired files by hand). `public/.htaccess` is generated by the build from `vercel.json` and carries the canonical https://www redirect, clean URLs, redirects, the `/studio/<person>` rewrite, headers and caching. SSL is a Namecheap Standard SSL (SSL.com, ID 4402669, covers the bare domain and www), issued and installed manually on 3 October 2026 and valid to 19 April 2027 (certificates are now capped at 200 days; the subscription runs to October 2027). Reissue before expiry from Namecheap → SSL Certificates → 4402669 (manual, HTTP file validation in `public_html/.well-known/pki-validation/`), then install in cPanel → SSL/TLS → Install with the CA bundle. cPanel AutoSSL is not available on this plan.

The old WordPress site that sat in `public_html` was moved intact to `~/wordpress-archive-2026-10-03` on 3 October 2026 (its database is untouched).

Vercel still builds every push (`main` → the-republic-weld.vercel.app; other branches → previews behind Vercel login). Use it as a preview, not as production.

The site is public and indexable (`robots.txt` allows all, `sitemap.xml` lists every page). The contact form, contact drawer and newsletter sign-up hand off to the visitor's email app (mailto) because the site has no backend.

## After launch

1. Submit https://www.therepublic.agency/sitemap.xml in Google Search Console and Bing Webmaster Tools.
2. Legal review of the privacy notice (retention wording, NDPC registration status).
3. Optional: a form backend (Vercel function with an email service) to replace the mailto hand-off, and a real newsletter list.
4. Captions (WebVTT) for films with dialogue.
5. Real-device performance pass on mid-range Android and iPhone.
6. Absolute share-image URLs per route. Only the home page's are absolute; the rest are set client-side.
