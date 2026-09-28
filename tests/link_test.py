import asyncio
from harness import page
from playwright.async_api import async_playwright
async def run():
    async with async_playwright() as p:
        b,pg,errs=await page(p,1440,900,False)
        for h in ['studio/daniel-emeka','onga-taste-of-home','twisco-everyday-hero','portfolio','spruce-dulux-digital-launch','studio/not-a-person']:
            await pg.goto('http://127.0.0.1:8765/public/index.html#'+h); await pg.wait_for_timeout(3500)
            r=await pg.evaluate("[document.body.dataset.route, document.title, document.getElementById('dossier').hidden ? '' : document.querySelector('#ds-name .dsn').textContent, location.hash]")
            print(h,'->',r)
        await pg.goto('http://127.0.0.1:8765/public/index.html#studio'); await pg.wait_for_timeout(3000)
        await pg.evaluate("document.querySelectorAll('#lineup .ln')[4].click()"); await pg.wait_for_timeout(600)
        print('open person hash:', await pg.evaluate("location.hash"))
        await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(300); print('next hash:', await pg.evaluate("location.hash"))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300); print('closed hash:', await pg.evaluate("location.hash"))
        print(errs[:5]); await b.close()
asyncio.run(run())
