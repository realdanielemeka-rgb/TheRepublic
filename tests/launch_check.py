"""Pre-launch check: no prototype/draft wording anywhere a visitor can reach, forms hand off to email."""
import asyncio, re
from harness import page, BASE
from playwright.async_api import async_playwright
BAD = re.compile(r'prototype|design study|not the live site|placeholder|draft|before launch|at launch|to be confirmed|once verified|as published|not yet in force|legal review', re.I)
ROUTES = ['', 'work', 'studio', 'studio/daniel-emeka', 'method', 'journal', 'contact', 'privacy', 'onga-case', 'zenith-case', 'twisco-case', 'youmatter-case', 'cowbell-case', 'spruce-case', 'pzl-case']
async def main():
    async with async_playwright() as p:
        b, pg, errs = await page(p, 1440, 900, False)
        await pg.goto(BASE); await pg.wait_for_timeout(2500)
        hits = []
        for r in ROUTES:
            await pg.evaluate(f"location.hash={r!r}"); await pg.wait_for_timeout(900)
            t = await pg.evaluate("document.body.innerText")
            for m in BAD.finditer(t): hits.append((r, t[max(0, m.start()-50):m.end()+40].replace('\n', ' ')))
        await pg.evaluate("document.querySelector('#essay-open') && document.querySelector('#essay-open').click()")
        t = await pg.evaluate("document.body.innerText")
        hits += [('essay', t[max(0, m.start()-50):m.end()+40]) for m in BAD.finditer(t)]
        print('visible prototype/draft wording:', hits or 'none')
        await pg.evaluate("location.hash='contact'"); await pg.wait_for_timeout(800)
        await pg.screenshot(path='shots/launch-contact.png', full_page=True)
        await pg.evaluate("location.hash='privacy'"); await pg.wait_for_timeout(800)
        await pg.screenshot(path='shots/launch-privacy.png')
        await pg.evaluate("location.hash='journal'"); await pg.wait_for_timeout(800)
        await pg.screenshot(path='shots/launch-journal.png')
        await pg.evaluate("location.hash='studio/daniel-emeka'"); await pg.wait_for_timeout(2200)
        await pg.screenshot(path='shots/launch-dossier.png')
        print('\n'.join(errs) or 'no errors'); await b.close()
asyncio.run(main())
