import asyncio
from harness import page, BASE
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b, pg, errs = await page(p, 1440, 900, False)
        for path, tag in (('', 'home'), ('onga', 'onga'), ('twisco-everyday-hero', 'twisco'), ('work', 'work')):
            await pg.goto(BASE + (path + '.html' if path else '')); await pg.wait_for_timeout(4500)
            await pg.screenshot(path=f'shots/direct-{tag}.png')
        print('\n'.join(errs) or 'no errors'); await b.close()
asyncio.run(main())
