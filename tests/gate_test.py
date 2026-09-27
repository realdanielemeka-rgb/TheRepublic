"""Screenshot the home page at chosen scroll stops, e.g.  python3 gate_test.py gate 3,4,5,6 m
(one stop = one screen of scroll; add a third argument to also shoot the phone layout)."""
import asyncio, sys
from harness import page
from playwright.async_api import async_playwright
async def gate(w,h,tag,stops,mobile=False):
    async with async_playwright() as p:
        b,pg,errs=await page(p,w,h,mobile)
        await pg.goto('http://127.0.0.1:8765/public/index.html'); await pg.wait_for_timeout(3500)
        if not mobile:
            await pg.mouse.move(w*.58,h*.4); await pg.wait_for_timeout(300); await pg.mouse.move(w*.6,h*.42); await pg.wait_for_timeout(1500)
        sh=await pg.evaluate('innerHeight*1.15')
        for v in stops:
            await pg.evaluate(f'window.scrollTo(0,{v}*{sh})'); await pg.wait_for_timeout(2600)
            await pg.screenshot(path=f'shots/{tag}-g{str(v).replace(".","_")}.png')
        tot=await pg.evaluate('document.documentElement.scrollHeight')
        await pg.evaluate(f'window.scrollTo(0,6*{sh}+innerHeight*0.9)'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'shots/{tag}-after1.png')
        await pg.evaluate(f'window.scrollTo(0,6*{sh}+innerHeight*2.0)'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'shots/{tag}-after2.png')
        await pg.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'shots/{tag}-after3.png')
        print(tag,'\n'.join(errs[:20]) or 'no errors'); await b.close()
async def work(w,h,tag,mobile=False):
    async with async_playwright() as p:
        b,pg,errs=await page(p,w,h,mobile)
        await pg.goto('http://127.0.0.1:8765/public/index.html#work'); await pg.wait_for_timeout(5000)
        await pg.screenshot(path=f'shots/{tag}-w0.png')
        await pg.mouse.move(w*0.3,h*0.55); await pg.wait_for_timeout(800)
        await pg.screenshot(path=f'shots/{tag}-w1.png')
        await pg.evaluate("document.querySelector('[data-filter=\"fin\"]') && document.querySelector('[data-filter=\"fin\"]').click()"); await pg.wait_for_timeout(2500)
        await pg.screenshot(path=f'shots/{tag}-w2.png')
        await pg.evaluate("document.querySelector('#v-list') && document.querySelector('#v-list').click()"); await pg.wait_for_timeout(700)
        await pg.screenshot(path=f'shots/{tag}-w3.png')
        await pg.evaluate("document.querySelector('[data-case=\"onga\"]') && document.querySelector('[data-case=\"onga\"]').click()"); await pg.wait_for_timeout(2800)
        await pg.screenshot(path=f'shots/{tag}-w4.png')
        print(tag,'\n'.join(errs[:20]) or 'no errors'); await b.close()
if __name__!='__main__': mode=None
else: mode=sys.argv[1]
if mode=='gate':
    stops=[float(x) for x in sys.argv[2].split(',')]
    asyncio.run(gate(1440,900,'d',stops))
    if len(sys.argv)>3: asyncio.run(gate(390,844,'m',stops,True))
elif mode=='work':
    asyncio.run(work(1440,900,'d'))
    if len(sys.argv)>2: asyncio.run(work(390,844,'m',True))

async def cowbell(w,h,tag,mobile=False):
    async with async_playwright() as p:
        b,pg,errs=await page(p,w,h,mobile)
        await pg.goto('http://127.0.0.1:8765/public/index.html#cowbell'); await pg.wait_for_timeout(4000)
        sh=await pg.evaluate('innerHeight*1.15')
        for v in (0,1,2,3,4):
            await pg.evaluate(f'window.scrollTo(0,{v}*{sh})'); await pg.wait_for_timeout(2600)
            if v==3:
                await pg.click('#cb-thank'); await pg.wait_for_timeout(700)
            await pg.screenshot(path=f'shots/{tag}-c{v}.png')
            if v==2:
                await pg.keyboard.down('s'); await pg.wait_for_timeout(900)
                await pg.screenshot(path=f'shots/{tag}-clens.png'); await pg.keyboard.up('s'); await pg.wait_for_timeout(400)
        await pg.evaluate("location.hash='cowbell-case'"); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'shots/{tag}-ccase.png',full_page=True)
        await pg.evaluate("location.hash='work'"); await pg.wait_for_timeout(3000)
        await pg.evaluate("document.querySelector('#v-list').click()"); await pg.wait_for_timeout(500)
        await pg.evaluate("document.querySelector('[data-case=\"cowbell\"]').click()"); await pg.wait_for_timeout(2500)
        await pg.screenshot(path=f'shots/{tag}-ccard.png')
        print(tag,'\n'.join(errs[:20]) or 'no errors'); await b.close()
if __name__=='__main__' and sys.argv[1]=='cowbell':
    asyncio.run(cowbell(1440,900,'d'))
    if len(sys.argv)>2: asyncio.run(cowbell(390,844,'m',True))
