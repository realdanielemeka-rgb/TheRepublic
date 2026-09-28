import asyncio
from harness import page
from playwright.async_api import async_playwright
async def run(w,h,tag,mobile=False):
    async with async_playwright() as p:
        b,pg,errs=await page(p,w,h,mobile)
        await pg.goto('http://127.0.0.1:8765/public/index.html'); await pg.wait_for_timeout(3000)
        sh=await pg.evaluate('innerHeight*1.15')
        await pg.evaluate(f'window.scrollTo(0,2.2*{sh})'); await pg.wait_for_timeout(2200)
        if not mobile: await pg.mouse.move(w*.97,h*.5); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'shots/nv-{tag}-rail.png')
        if mobile:
            await pg.evaluate("document.getElementById('menubtn').click()"); await pg.wait_for_timeout(600)
            await pg.screenshot(path=f'shots/nv-{tag}-menu.png')
            await pg.evaluate("document.querySelector('.mlinks a[href=\"#studio\"]').click()"); await pg.wait_for_timeout(1500)
            print(tag,'after menu:',await pg.evaluate("location.hash"), await pg.evaluate("document.getElementById('menu').hidden"))
        else:
            await pg.evaluate("document.querySelector('#nav-work').click()"); await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'shots/nv-{tag}-wipe.png'); await pg.wait_for_timeout(2500)
            print(tag,'after wipe:',await pg.evaluate("location.hash"))
            await pg.mouse.move(w*.5,h*.6); await pg.wait_for_timeout(600)
            await pg.screenshot(path=f'shots/nv-{tag}-cursor.png')
        await pg.evaluate("location.hash='spruce'"); await pg.wait_for_timeout(2500)
        await pg.screenshot(path=f'shots/nv-{tag}-world.png')
        print(tag,'crumbs:',await pg.evaluate("[document.getElementById('crumb').hidden, document.getElementById('nextw').textContent, document.getElementById('nextw').getAttribute('href')]"))
        await pg.evaluate("location.hash='heirs-case'"); await pg.wait_for_timeout(1500)
        print(tag,'case crumbs:',await pg.evaluate("[document.getElementById('nextw').textContent, document.getElementById('nextw').getAttribute('href')]"))
        await pg.evaluate("window.scrollTo(0, 1500)"); await pg.wait_for_timeout(800)
        await pg.screenshot(path=f'shots/nv-{tag}-case.png')
        await pg.evaluate("location.hash='nowhere-street'"); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=f'shots/nv-{tag}-404.png')
        print(tag,'404 title:',await pg.evaluate("document.title"))
        print(tag,'\n'.join(errs[:20]) or 'no errors'); await b.close()
asyncio.run(run(1440,900,'d')); asyncio.run(run(390,844,'m',True))
