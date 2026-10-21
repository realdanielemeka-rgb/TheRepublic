"""Screenshot the Chivita world at each beat and the case page:  python3 ch_shots.py [m]"""
import asyncio, sys
from harness import page, BASE
from playwright.async_api import async_playwright
async def run(w, h, tag, mobile=False):
    async with async_playwright() as p:
        b, pg, errs = await page(p, w, h, mobile)
        await pg.goto(BASE + 'chivita.html'); await pg.wait_for_timeout(5000)
        sh = await pg.evaluate('innerHeight*1.15')
        for v in (0, 1, 2, 3, 4, 5, 6):
            await pg.evaluate(f'window.scrollTo(0,{v}*{sh}+2)'); await pg.wait_for_timeout(3200)
            if v == 5:
                await pg.fill('#ch-in', "Sunday rice at Mum's"); await pg.press('#ch-in', 'Enter'); await pg.wait_for_timeout(1500)
            await pg.screenshot(path=f'shots/ch-{tag}-{v}.png')
            if v == 2 and not mobile:
                await pg.keyboard.down('s'); await pg.wait_for_timeout(900)
                await pg.screenshot(path=f'shots/ch-{tag}-lens.png'); await pg.keyboard.up('s'); await pg.wait_for_timeout(400)
        await pg.evaluate("location.hash='chivita-case'"); await pg.wait_for_timeout(2000)
        for y in range(0, 12000, 600): await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(120)
        await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(800)
        await pg.screenshot(path=f'shots/ch-{tag}-case.png', full_page=True)
        print(tag, '\n'.join(errs[:20]) or 'no errors'); await b.close()
asyncio.run(run(1440, 900, 'd'))
if len(sys.argv) > 1: asyncio.run(run(390, 844, 'm', True))
