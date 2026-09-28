import asyncio
from harness import page
from playwright.async_api import async_playwright
R=['privacy','work','onga','cowbell','spruce','pzl','zenith','studio','method','journal','contact','onga-case','zenith-case','twisco-case','torrista-case','gate']
async def run(w,h,tag,mobile=False):
    async with async_playwright() as p:
        b,pg,errs=await page(p,w,h,mobile)
        await pg.goto('http://127.0.0.1:8765/public/index.html'); await pg.wait_for_timeout(3000)
        for r in R:
            await pg.evaluate(f"location.hash='{r}'"); await pg.wait_for_timeout(1800)
        await pg.evaluate("location.hash='work'"); await pg.wait_for_timeout(3000)
        await pg.screenshot(path=f'shots/rt-{tag}-work.png')
        print(tag,'\n'.join(errs[:20]) or 'no errors'); await b.close()
asyncio.run(run(1440,900,'d')); asyncio.run(run(390,844,'m',True))
