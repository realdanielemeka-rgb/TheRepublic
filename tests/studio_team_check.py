import asyncio
from harness import page, BASE
from playwright.async_api import async_playwright
async def run(w,h,tag,mobile):
    async with async_playwright() as p:
        b,pg,errs=await page(p,w,h,mobile)
        await pg.goto(BASE+'#studio'); await pg.wait_for_timeout(3500)
        names=await pg.evaluate("[...document.querySelectorAll('#lineup .ln')].map(l=>l.textContent.replace(/\\s+/g,' ').trim().slice(0,60))")
        print(tag, len(names), names)
        await pg.evaluate("document.querySelector('#lineup').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'shots/{tag}-lineup.png')
        for s in ('oluwadoyinsola-iyiola','simi-lawal'):
            await pg.evaluate(f"location.hash='studio/{s}'"); await pg.wait_for_timeout(2600)
            await pg.screenshot(path=f'shots/{tag}-{s}.png')
        print(tag, '\n'.join(errs) or 'no errors'); await b.close()
asyncio.run(run(1440,900,'d',False)); asyncio.run(run(390,844,'m',True))
