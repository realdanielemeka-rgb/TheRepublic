import asyncio
from harness import page, BASE
from playwright.async_api import async_playwright
async def run(w, h, tag, mobile=False):
    async with async_playwright() as p:
        b, pg, errs = await page(p, w, h, mobile)
        for path, name in (('services.html', 'hub'), ('services/experiences.html', 'exp')):
            await pg.goto(BASE + path); await pg.wait_for_timeout(2500)
            await pg.screenshot(path=f'shots/svc-{tag}-{name}-top.png')
            await pg.evaluate("window.scrollTo(0, innerHeight*1.0)"); await pg.wait_for_timeout(900)
            await pg.screenshot(path=f'shots/svc-{tag}-{name}-2.png')
            await pg.evaluate("window.scrollTo(0, innerHeight*2.0)"); await pg.wait_for_timeout(900)
            await pg.screenshot(path=f'shots/svc-{tag}-{name}-3.png')
        await pg.goto(BASE); await pg.wait_for_timeout(2500)
        await pg.evaluate("window.scrollTo(0, 6*innerHeight*1.15+4)"); await pg.wait_for_timeout(2500)
        await pg.screenshot(path=f'shots/svc-{tag}-home6.png')
        print(tag, '\n'.join(errs) or 'no errors'); await b.close()
asyncio.run(run(1440, 900, 'd')); asyncio.run(run(1024, 768, 't')); asyncio.run(run(390, 844, 'm', True))
