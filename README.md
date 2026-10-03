# The Republic

The website of The Republic, an independent creative and marketing agency in Lagos: an immersive, scroll-driven 3D site built with Three.js.

- **Build:** `python3 scripts/build.py` after editing `src/site.html` or `public/assets/*` (writes one HTML page per address)
- **Run locally:** `python3 -m http.server 8765 --directory public`, then open http://127.0.0.1:8765/
- **Deploy:** static, via Vercel's Git integration (see `vercel.json`). Commit the built pages; Vercel does not build.
- **Test:** `tests/run_all.sh` (see `CLAUDE.md`)

`CLAUDE.md` covers the architecture, editorial rules and launch checklist.

© The Republic Studios Ltd · RC 7371417
