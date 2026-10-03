"""SEO checks on the built pages, as a crawler sees them (raw HTML) and as a visitor sees them (after the app runs)."""
import asyncio, glob, json, os, re, html
from harness import page, BASE
from playwright.async_api import async_playwright
ROOT = os.path.join(os.path.dirname(__file__), '..'); PUB = os.path.join(ROOT, 'public')
DOMAIN = 'https://www.therepublic.agency'
problems = []
pages = sorted(glob.glob(os.path.join(PUB, '*.html')))
built = {('/' + os.path.basename(f)[:-5]).replace('/index', '/') for f in pages if not f.endswith('404.html')}
redirects = {r['source'] for r in json.load(open(os.path.join(ROOT, 'vercel.json')))['redirects']}
titles, descs = {}, {}
for f in pages:
    s, name = open(f).read(), os.path.basename(f)
    want = '/' if name == 'index.html' else '/' + name[:-5]
    t = re.search(r'<title>([^<]+)</title>', s); d = re.search(r'<meta name="description" content="([^"]+)">', s)
    if not t or not d: problems.append((name, 'missing title or description')); continue
    titles.setdefault(t.group(1), []).append(name); descs.setdefault(d.group(1), []).append(name)
    if len(re.findall(r'<h1[\s>]', s)) != 1: problems.append((name, 'h1 count'))
    if name == '404.html':
        if 'name="robots" content="noindex"' not in s: problems.append((name, '404 must be noindex'))
        continue
    can = re.search(r'<link rel="canonical" href="([^"]+)">', s)
    if not can or can.group(1) != DOMAIN + want: problems.append((name, 'canonical', can and can.group(1)))
    for prop in ('og:title', 'og:description', 'og:image', 'og:url'):
        if f'property="{prop}"' not in s: problems.append((name, 'missing ' + prop))
    for blob in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try: json.loads(blob)
        except Exception as e: problems.append((name, 'bad JSON-LD', str(e)))
    for img in re.findall(r'<img(?![^>]*\balt=)[^>]*>', s): problems.append((name, 'img without alt'))
    for href in set(re.findall(r'<a [^>]*href="(/[^"#?]*)"', s)):
        h = href.rstrip('/') or '/'
        if h not in built and h not in redirects and not h.startswith('/studio/'): problems.append((name, 'internal link to nowhere', href))
for t, fs in titles.items():
    if len(fs) > 1: problems.append(('duplicate title', t, fs))
for d, fs in descs.items():
    if len(fs) > 1: problems.append(('duplicate description', d[:40], fs))
sm = re.findall(r'<loc>([^<]+)</loc>', open(os.path.join(PUB, 'sitemap.xml')).read())
for u in sm:
    if (u[len(DOMAIN):].rstrip('/') or '/') not in built: problems.append(('sitemap URL without a page', u))
if 'Sitemap: https://www.therepublic.agency/sitemap.xml' not in open(os.path.join(PUB, 'robots.txt')).read(): problems.append(('robots.txt has no sitemap',))
print(f'raw HTML: {len(pages)} pages, {len(sm)} sitemap URLs;', 'no problems' if not problems else problems)

async def live():
    """After the app runs: one h1, and it is the visible page's heading; client-side navigation keeps title, canonical and h1 in step."""
    bad = []
    async with async_playwright() as p:
        b, pg, errs = await page(p, 1280, 800, False)
        for path in ('index.html', 'work.html', 'studio.html', 'twisco-everyday-hero.html', 'onga-taste-of-home.html', 'onga.html', 'journal.html'):
            await pg.goto(BASE + path); await pg.wait_for_timeout(1500)
            r = await pg.evaluate("""() => { const h = [...document.querySelectorAll('h1')]; const c = document.querySelector('link[rel=canonical]');
                return { n: h.length, vis: h[0] ? !h[0].closest('[hidden]') : false, txt: h[0] ? h[0].textContent.trim().slice(0, 40) : '', can: c && c.href, path: location.pathname }; }""")
            if r['n'] != 1 or not r['vis'] or not r['txt']: bad.append((path, r))
        # move around inside the app
        for hop in ('/studio', '/prudential-zenith-you-matter', '/method'):
            await pg.evaluate(f"document.querySelector('a[href=\"{hop}\"]') ? document.querySelector('a[href=\"{hop}\"]').click() : history.pushState(null,'','{hop}') || dispatchEvent(new PopStateEvent('popstate'))"); await pg.wait_for_timeout(1400)
            r = await pg.evaluate("""() => ({ path: location.pathname, t: document.title, can: document.querySelector('link[rel=canonical]').href, n: document.querySelectorAll('h1').length, vis: !document.querySelector('h1').closest('[hidden]') })""")
            if r['path'] != hop or r['can'] != DOMAIN + hop or r['n'] != 1 or not r['vis']: bad.append((hop, r))
        await pg.goto(BASE + '#onga-case'); await pg.wait_for_timeout(1200)
        if await pg.evaluate('location.pathname') != '/onga-taste-of-home': bad.append(('old #link did not move to the clean address',))
        print('live DOM:', 'no problems' if not bad else bad)
        print('\n'.join(errs) or 'no errors'); await b.close()
asyncio.run(live())
