import asyncio
from harness import page
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b,pg,errs=await page(p,1440,900,False)
        await pg.emulate_media(reduced_motion='reduce')
        await pg.goto('http://127.0.0.1:8765/public/index.html'); await pg.wait_for_timeout(3000)
        sh=await pg.evaluate('innerHeight*1.15')
        for v in (3,4,5,6):
            await pg.evaluate(f'window.scrollTo(0,{v}*{sh}+2)'); await pg.wait_for_timeout(1500)
            await pg.screenshot(path=f'shots/rm-{v}.png')
        print('\n'.join(errs) or 'no errors'); await b.close()
asyncio.run(main())
