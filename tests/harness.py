"""Shared Playwright harness for The Republic site.

Serve the built site first:  python3 -m http.server 8765 --directory public   (from the repo root)
BASE is the home page; other pages are at BASE + 'work.html' etc. (Vercel serves them as /work). Three.js and the Google Fonts are served locally from
tests/vendor so the tests run offline and match production rendering.
"""
import os
from playwright.async_api import async_playwright  # noqa: F401  (re-exported for scripts)

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = 'http://127.0.0.1:8765/'
os.makedirs(os.path.join(HERE, 'shots'), exist_ok=True)
THREE = open(os.path.join(HERE, 'vendor', 'three-r128.min.js'), 'rb').read()
F = 'http://fonts.test/'
FONTCSS = f'''@font-face{{font-family:'Handjet';src:url({F}Handjet%5BELGR%2CELSH%2Cwght%5D.ttf);font-weight:100 900}}
@font-face{{font-family:'Schibsted Grotesk';src:url({F}SchibstedGrotesk%5Bwght%5D.ttf);font-weight:400 900;font-style:normal}}
@font-face{{font-family:'Schibsted Grotesk';src:url({F}SchibstedGrotesk-Italic%5Bwght%5D.ttf);font-weight:400 900;font-style:italic}}'''


async def page(p, w, h, mobile):
    """Launch Chromium with software WebGL; returns (browser, page, errors)."""
    b = await p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=mobile, has_touch=mobile)
    pg = await ctx.new_page(); errs = []
    pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERROR: ' + str(e)))

    async def route(r):
        u = r.request.url
        if 'cdnjs.cloudflare.com' in u: await r.fulfill(body=THREE, content_type='application/javascript')
        elif 'fonts.googleapis' in u: await r.fulfill(body=FONTCSS, content_type='text/css')
        elif u.startswith(F): await r.fulfill(body=open(os.path.join(HERE, 'vendor', 'fonts', __import__('urllib.parse').parse.unquote(u[len(F):])), 'rb').read(), content_type='font/ttf')
        else: await r.continue_()
    await pg.route('**/*', route)
    return b, pg, errs
