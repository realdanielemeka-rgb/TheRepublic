"""Every old Wix URL must land on a real page (vercel.json turns /slug into /#slug)."""
import asyncio, json, os
from harness import page, BASE
from playwright.async_api import async_playwright
CFG = json.load(open(os.path.join(os.path.dirname(__file__), '..', 'vercel.json')))
async def main():
    async with async_playwright() as p:
        b, pg, errs = await page(p, 1280, 800, False)
        await pg.goto(BASE); await pg.wait_for_timeout(2500)
        bad = []
        for r in CFG['redirects']:
            h = r['destination'].split('#', 1)[1] if '#' in r['destination'] else ''
            await pg.evaluate(f"location.hash = {json.dumps(h)}"); await pg.wait_for_timeout(600)
            t = await pg.title()
            if 'not found' in t.lower(): bad.append((r['source'], t))
        print(len(CFG['redirects']), 'legacy URLs checked;', 'all resolve' if not bad else bad)
        print('\n'.join(errs) or 'no errors'); await b.close()
asyncio.run(main())
