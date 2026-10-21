"""Phone audit: horizontal overflow and screenshots of every main page at phone widths (tests/shots/mob-*.png)."""
import asyncio, sys
from harness import page, BASE
from playwright.async_api import async_playwright
PAGES = ['studio.html', 'index.html', 'work.html', 'services.html', 'services/experiences.html', 'method.html', 'journal.html', 'contact.html', 'privacy.html', 'onga-taste-of-home.html', 'twisco-everyday-hero.html', 'onga.html', '404.html']
OVER = """() => { const W = document.documentElement.clientWidth, out = [];
  for (const el of document.querySelectorAll('body *')) { if (el.closest('[hidden]') || el.closest('canvas') ) continue; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
    const r = el.getBoundingClientRect(); if (r.width && (r.right > W + 1 || r.left < -1)) { let p = el.parentElement, clipped = false; while (p && p !== document.body) { const s = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) { const pr = p.getBoundingClientRect(); if (pr.right <= W + 1 && pr.left >= -1) { clipped = true; break; } } p = p.parentElement; }
      if (!clipped) out.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + [...el.classList].join('.')) + ' ' + Math.round(r.left) + '..' + Math.round(r.right)); } }
  return { W, sw: document.documentElement.scrollWidth, over: out.slice(0, 12) }; }"""
async def run(w, h, tag):
    async with async_playwright() as p:
        b, pg, errs = await page(p, w, h, True)
        for path in PAGES:
            await pg.goto(BASE + path); await pg.wait_for_timeout(1800)
            name = path.replace('/', '_').replace('.html', '')
            r = await pg.evaluate(OVER)
            print(tag, path, 'scrollWidth', r['sw'], '>', r['W'] if r['sw'] > r['W'] else 'ok', r['over'] or '')
            total = await pg.evaluate('document.documentElement.scrollHeight')
            n = 0
            for y in range(0, min(total, h * 8), int(h * .9)):
                await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(500)
                await pg.screenshot(path=f'shots/mob-{tag}-{name}-{n}.png'); n += 1
        # the person panel
        await pg.goto(BASE + 'studio.html'); await pg.wait_for_timeout(1800)
        await pg.evaluate("document.querySelector('#lineup button, #lineup [data-person], #lineup a') && document.querySelector('#lineup button, #lineup [data-person], #lineup a').click()"); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=f'shots/mob-{tag}-dossier.png')
        print(tag, 'dossier', await pg.evaluate(OVER))
        print(tag, '\n'.join(errs[:8]) or 'no errors'); await b.close()
for spec in (sys.argv[1:] or ['390x844']):
    w, h = map(int, spec.split('x')); asyncio.run(run(w, h, str(w)))
