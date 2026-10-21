"""Every address from the old Wix site must still land on a real page: either a built page with the same address, or a 301 in vercel.json."""
import asyncio, json, os
from harness import page, BASE
from playwright.async_api import async_playwright
ROOT = os.path.join(os.path.dirname(__file__), '..')
WIX = 'home portfolio studio contact chivita-12-days-of-christmas chivita-2-campaign chivita-hollandia-ramadan chivita-style-n-sips cowbell-ramadan-your-first-taste heirs-insurance-launch i-invest-secure-the-bag onga-taste-of-home prudential-zenith-empowering-tomorrow prudential-zenith-social-content prudential-zenith-we-do-dreams prudential-zenith-you-matter sanlam-allianz-live-with-confidence spruce-dulux-digital-launch torrista-see-for-yourself twisco-everyday-hero zenith-bank-35th-anniversary zenith-bank-homecoming'.split()
async def main():
    red = {r['source'].lstrip('/'): r['destination'] for r in json.load(open(os.path.join(ROOT, 'vercel.json')))['redirects']}
    async with async_playwright() as p:
        b, pg, errs = await page(p, 1280, 800, False)
        bad = []
        for s in WIX:
            target = red.get(s, '/' + s).lstrip('/') or 'index'
            f = os.path.join(ROOT, 'public', target + '.html')
            if not os.path.exists(f): bad.append((s, 'no page for ' + target)); continue
            await pg.goto(BASE + target + '.html'); await pg.wait_for_timeout(700)
            t = await pg.title(); h1 = await pg.evaluate("document.querySelectorAll('h1').length")
            if 'not found' in t.lower() or h1 != 1: bad.append((s, t, h1))
        print(len(WIX), 'old Wix addresses checked;', 'all land on real pages' if not bad else bad)
        print('\n'.join(errs) or 'no errors'); await b.close()
asyncio.run(main())
