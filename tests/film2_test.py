import asyncio
from harness import page
from playwright.async_api import async_playwright
async def run(w,h,tag,mobile=False):
    async with async_playwright() as p:
        b,pg,errs=await page(p,w,h,mobile)
        for r,sec in (('pzl-case','pz-work'),('zenith-case','zb-work'),('zenith35-case','cf-work'),('sanlam-case','cf-work')):
            await pg.goto('http://127.0.0.1:8765/public/index.html#'+r); await pg.wait_for_timeout(2500)
            await pg.evaluate(f"(document.getElementById('{sec}')||document.querySelector('[data-for=\"{r}\"] .films')||document.body).scrollIntoView()"); await pg.wait_for_timeout(700)
            await pg.evaluate("(document.querySelector('.films')||document.querySelector('#cf-gal')).scrollIntoView({block:'center'})") if r.endswith('-case') else None
            await pg.wait_for_timeout(600)
            await pg.screenshot(path=f'shots/f2-{tag}-{r}.png')
            n=await pg.evaluate(f"document.querySelectorAll('[data-for=\"{r}\"] [data-film], #cf-gal [data-film]').length")
            await pg.evaluate("[...document.querySelectorAll('.vplay')].find(b=>b.offsetParent)?.click()"); await pg.wait_for_timeout(700)
            t=await pg.evaluate("[document.getElementById('filmx').hidden, document.getElementById('film-t').textContent, document.getElementById('filmx').className, document.getElementById('lb').hidden]")
            print(tag,r,'films:',n,'opened:',t)
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
        print(tag,'\n'.join(errs[:20]) or 'no errors'); await b.close()
asyncio.run(run(1440,900,'d')); asyncio.run(run(390,844,'m',True))
