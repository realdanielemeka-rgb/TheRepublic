import asyncio
from harness import page, BASE
from playwright.async_api import async_playwright
async def run():
    async with async_playwright() as p:
        b,pg,errs=await page(p,1440,900,False)
        for h in ['studio/daniel-emeka','onga-taste-of-home','twisco-everyday-hero','portfolio','spruce-dulux-digital-launch','studio/not-a-person']:
            await pg.goto(BASE+'#'+h); await pg.wait_for_timeout(3500)
            r=await pg.evaluate("[document.body.dataset.route, document.title, document.getElementById('dossier').hidden ? '' : document.querySelector('#ds-name .dsn').textContent, location.hash]")
            print(h,'->',r)
        await pg.goto('http://127.0.0.1:8765/#studio'); await pg.wait_for_timeout(3000)
        await pg.evaluate("document.querySelectorAll('#lineup .ln')[4].click()"); await pg.wait_for_timeout(600)
        print('open person address:', await pg.evaluate("location.pathname"))
        await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(300); print('next address:', await pg.evaluate("location.pathname"))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300); print('closed address:', await pg.evaluate("location.pathname"))
        print(errs[:5]); await b.close()
asyncio.run(run())
