"""Build the site's HTML: one pre-rendered page per address, each with its own title, description,
canonical link, share card and structured data, and exactly one h1.

Edit src/site.html (markup), public/assets/app.css and public/assets/app.js, then run:
    python3 scripts/build.py          # writes public/*.html, public/404.html, public/assets/routes.js, public/sitemap.xml
    python3 scripts/build.py --check  # fails if the committed output is out of date
"""
import datetime, hashlib, html, json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from routes import ROOT, DOMAIN, paths  # noqa: E402
import services as SV  # noqa: E402

PUB = os.path.join(ROOT, 'public')
# sitemap lastmod: scripts/LASTMOD (bump it when content changes), so the output is the same on every machine
_LM = os.path.join(ROOT, 'scripts', 'LASTMOD')
TODAY = os.environ.get('BUILD_DATE') or (open(_LM).read().strip() if os.path.exists(_LM) else datetime.date.today().isoformat())

TITLES = {
    'gate': 'Creative & Advertising Agency in Lagos, Nigeria | The Republic',
    'work': 'Advertising & Creative Work in Nigeria | The Republic',
    'studio': 'About Our Lagos Creative Agency | The Republic',
    'method': 'How We Work: Strategy First | The Republic',
    'journal': 'Journal: Articles and Case Films | The Republic',
    'contact': 'Contact The Republic | Marketing Agency in Lagos',
    'privacy': 'Privacy Notice | The Republic',
    'lost': 'Page not found | The Republic',
    'onga': 'Onga Taste of Home: Interactive World | The Republic',
    'cowbell': 'Cowbell Your First Taste: Interactive | The Republic',
    'spruce': 'Spruce by Dulux True Colours: Interactive | The Republic',
    'pzl': 'Prudential Zenith Tomorrow: Interactive | The Republic',
    'zenith': 'Zenith Bank Homecoming: Interactive | The Republic',
    'onga-case': 'Onga Taste of Home Campaign Case Study | The Republic',
    'cowbell-case': 'Cowbell Ramadan Social Media Campaign | The Republic',
    'spruce-case': 'Spruce by Dulux: Digital Launch Case Study | The Republic',
    'pzl-case': 'Prudential Zenith: Empowering Tomorrow | The Republic',
    'zenith-case': 'Zenith Bank Homecoming Strategy | The Republic',
}
DESCRIPTIONS = {
    'gate': 'Independent creative and advertising agency in Lagos, Nigeria. Strategy-led campaigns, content, digital work and experiences for African and global brands.',
    'work': 'Advertising campaigns, films and digital work by The Republic for Promasidor, CHI, Prudential Zenith, Zenith Bank and Dulux. Every case, by district.',
    'studio': 'Meet The Republic, an independent creative and advertising agency at 10 Onisiwo Road, Ikoyi, Lagos: the team, our story and the clients we build for.',
    'method': 'How The Republic works: three commitments, six questions on every brief and five steps from problem to proof. Strategy first, and the work must prove it.',
    'journal': 'Articles and case films from The Republic, a creative and marketing agency in Lagos. Read Write for the reply, and watch the work behind our campaigns.',
    'contact': 'Start a conversation with The Republic, a creative and marketing agency in Ikoyi, Lagos. Email office@therepublic.agency or call +234 700 700 5252.',
    'privacy': 'How The Republic Studios Ltd collects, uses and protects personal data from this website, and the rights you have under the Nigeria Data Protection Act 2023.',
    'lost': 'This page does not exist or has moved. Explore the work of The Republic, an independent creative and marketing agency in Lagos.',
    'onga': "Step into Onga Taste of Home: an interactive world built on the question behind The Republic's campaign for Promasidor Nigeria: what does home mean to you?",
    'cowbell': "Move from Suhoor to Iftar in Cowbell Your First Taste, an interactive world from The Republic's Ramadan campaign about who cares before the first taste.",
    'spruce': 'Who decided a colour had one meaning? Paint the room in Spruce by Dulux Show Your True Colours, an interactive world from The Republic.',
    'pzl': "Drive to 2066 in Prudential Zenith Life's Empowering Tomorrow, an interactive world from The Republic's campaign that made the next 40 years personal.",
    'zenith': "Land in Lagos with Zenith Bank's See Homecoming Differently, an interactive world from The Republic's strategy for Nigerians coming home every December.",
    'onga-case': "Onga Taste of Home case study: how The Republic asked Nigerians what home means and built Promasidor's digital platform for Onga around their answers.",
    'cowbell-case': "Cowbell Your First Taste case study: The Republic's Nigerian digital and social execution of Cowbell's Ramadan campaign, honouring who cares first.",
    'spruce-case': 'Spruce by Dulux case study: how The Republic amplified the Show Your True Colours launch with creators, social distribution and digital visualisation.',
    'pzl-case': "Empowering Tomorrow case study: The Republic's integrated campaign that helped Prudential Zenith Life make the next 40 years personal and planning practical.",
    'zenith-case': "See Homecoming Differently: The Republic's strategy and creative platform for Zenith Bank, built for Nigerians in the diaspora coming home every December.",
}
CAPABILITIES = ['Communication Strategy', 'Brand & Creative', 'Content & Social', 'Integrated Marketing', 'Digital & Performance', 'Experiences']
WORLDS = ['onga', 'cowbell', 'spruce', 'pzl', 'zenith']
ESSAY = {'headline': 'Write for the reply.', 'description': 'Good brand work gives people a reason to bring their own lives into the story.', 'date': '2026-10-03'}


def js_value(js, name):
    """Evaluate a top-level `const NAME = <literal>` from app.js with node and return it as Python data."""
    i = js.index(f'const {name} = ') + len(f'const {name} = ')
    depth, j, q = 0, i, None
    while True:
        ch = js[j]
        if q:
            if ch == '\\': j += 2; continue
            if ch == q: q = None
        elif ch in '\'"`': q = ch
        elif ch in '{[': depth += 1
        elif ch in '}]':
            depth -= 1
            if depth == 0: break
        j += 1
    out = subprocess.run(['node', '-e', 'process.stdout.write(JSON.stringify(' + js[i:j + 1] + '))'], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def esc(x):
    return html.escape(str(x), quote=True)


def pick(cands, lo=110, hi=160):
    ok = [c for c in cands if lo <= len(c) <= hi]
    return ok[0] if ok else min(cands, key=lambda c: abs(len(c) - (lo + hi) / 2))


def htaccess():
    """Apache configuration for the cPanel host (Namecheap), mirroring vercel.json: one canonical https://www address,
    clean URLs, the same redirects and rewrites, security headers and caching."""
    vc = json.load(open(os.path.join(ROOT, 'vercel.json')))
    host = DOMAIN.split('://', 1)[1]                      # www.therepublic.agency
    bare = host[4:] if host.startswith('www.') else host
    esc_re = lambda s: re.sub(r'([.\-])', r'\\\1', s)
    red = '\n'.join(f'RewriteRule ^{r["source"].lstrip("/")}$ https://{host}{r["destination"]} [R=301,L]' for r in vc['redirects'])
    rw = '\n'.join(f'RewriteRule ^{re.sub(r":[a-z]+", "[^/]+", r["source"].lstrip("/"))}$ {r["destination"].lstrip("/")} [L]' for r in vc['rewrites'])
    return f'''# The Republic: Apache configuration for the cPanel host.
# Written by scripts/build.py from vercel.json; edit the build, not this file.

Options -Indexes -MultiViews
DirectoryIndex index.html
DirectorySlash Off
ErrorDocument 404 /404.html
AddDefaultCharset utf-8
AddType image/webp .webp
AddType video/mp4 .mp4
AddType text/plain .txt

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# certificate checks, Namecheap's SSL manager and server paths pass straight through
RewriteRule ^(\\.well-known|cgi-bin)(/|$) - [L]
RewriteRule ^ssl-manager\\.php$ - [L]

# one address for the site: https://{host}
RewriteCond %{{HTTP_HOST}} ^{esc_re(bare)}$ [NC]
RewriteRule ^ https://{host}%{{REQUEST_URI}} [R=301,L]
RewriteCond %{{HTTP_HOST}} ^{esc_re(host)}$ [NC]
RewriteCond %{{HTTPS}} !=on
RewriteCond %{{HTTP:X-Forwarded-Proto}} !=https
RewriteRule ^ https://{host}%{{REQUEST_URI}} [R=301,L]

# clean addresses: /index.html -> /, /work.html -> /work, /work/ -> /work
RewriteCond %{{THE_REQUEST}} \\s/+index\\.html[\\s?]
RewriteRule ^ https://{host}/ [R=301,L]
RewriteCond %{{THE_REQUEST}} \\s/+([^\\s?]+?)\\.html[\\s?]
RewriteRule ^ https://{host}/%1 [R=301,L]
RewriteCond %{{REQUEST_URI}} ^(/.+)/+$
RewriteRule ^ https://{host}%1 [R=301,L]

# redirects carried over from the old site
{red}

# rewrites (a person on the Studio page, e.g. /studio/daniel-emeka)
{rw}

# serve /work from work.html, /services/experiences from services/experiences.html
RewriteCond $1 !^404$
RewriteCond $1 !\\.html$
RewriteCond %{{REQUEST_FILENAME}} !-f
RewriteCond %{{REQUEST_FILENAME}}.html -f
RewriteRule ^(.+)$ $1.html [L]
</IfModule>

<IfModule mod_headers.c>
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
<FilesMatch "\\.(html|txt|xml)$">
Header set Cache-Control "public, max-age=0, must-revalidate"
</FilesMatch>
<FilesMatch "\\.(webp|jpg|jpeg|png|mp4|ico|svg)$">
Header set Cache-Control "public, max-age=604800, stale-while-revalidate=86400"
</FilesMatch>
<FilesMatch "\\.(css|js)$">
Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/xml application/javascript text/javascript application/json image/svg+xml
</IfModule>
'''


def main(check=False):
    js = open(os.path.join(PUB, 'assets', 'app.js')).read()
    css = open(os.path.join(PUB, 'assets', 'app.css')).read()
    tpl = open(os.path.join(ROOT, 'src', 'site.html')).read()
    CF, CASES, TEAM = js_value(js, 'CASEFILES'), js_value(js, 'CASES'), js_value(js, 'TEAM')
    byId = {c['id']: c for c in CASES}
    P = paths(js)
    meta = {}
    for r, p in P.items():
        if r == 'services' or r.startswith('svc-'): continue
        k = r[:-5] if r.endswith('-case') else r
        if r.endswith('-case') and k in CF:
            f = CF[k]
            t = f['seo']
            client = f['facts'][0][1]
            d = pick([f"{f['title']}: {f['line']} A case study by The Republic, a creative and marketing agency in Lagos, for {client}.",
                      f"{f['title']}: {f['line']} A case study by The Republic, the Lagos creative agency, for {client}.",
                      f"{f['title']} for {client}: {f['line']} A case study by The Republic, an independent creative and marketing agency in Lagos, Nigeria.",
                      f"{f['title']}: {f['line']} A case study by The Republic for {client}, from our Lagos studio."])
            og = f'/og/og-{k}-case.jpg'
        else:
            t, d = TITLES[r], DESCRIPTIONS[r]
            og = f'/og/og-{k}.jpg' if k in WORLDS else ('/og/og-home.jpg' if r == 'gate' else f'/og/og-{r}.jpg')
        assert os.path.exists(os.path.join(PUB, og.lstrip('/'))), og
        meta[r] = {'p': p, 't': t, 'd': d, 'o': og}
    for sv in [dict(SV.HUB, key='services')] + SV.SERVICES:
        meta[sv['key']] = {'p': sv['path'], 't': sv['title'], 'd': sv['description'], 'o': f"/og/og-{sv['key'] if sv['key'] != 'services' else 'services'}.jpg"}
        assert os.path.exists(os.path.join(PUB, meta[sv['key']]['o'].lstrip('/'))), meta[sv['key']]['o']
    meta['lost'] = {'p': '/404', 't': TITLES['lost'], 'd': DESCRIPTIONS['lost'], 'o': '/og/og-home.jpg'}

    routes_js = '// generated by scripts/build.py: every page\'s address, title, description and share card\nwindow.SEO = ' + json.dumps(
        {'domain': DOMAIN, 'paths': {**P, 'lost': None}, 'meta': meta}, ensure_ascii=False, separators=(',', ':')) + ';\n'
    ver = lambda b: hashlib.sha1(b.encode()).hexdigest()[:10]
    css_tag = f'<link rel="stylesheet" href="/assets/app.css?v={ver(css)}">'
    js_tag = f'<script src="/assets/routes.js?v={ver(routes_js)}"></script>\n<script src="/assets/app.js?v={ver(js)}"></script>'

    org = {
        '@type': 'ProfessionalService', '@id': DOMAIN + '/#org', 'name': 'The Republic', 'legalName': 'The Republic Studios Ltd',
        'url': DOMAIN + '/', 'logo': {'@type': 'ImageObject', 'url': DOMAIN + '/img/logo.png'}, 'image': DOMAIN + '/og/og-home.jpg',
        'description': DESCRIPTIONS['gate'], 'email': 'office@therepublic.agency', 'telephone': '+234 700 700 5252',
        'address': {'@type': 'PostalAddress', 'streetAddress': '10 Onisiwo Road', 'addressLocality': 'Ikoyi', 'addressRegion': 'Lagos', 'addressCountry': 'NG'},
        'founder': [{'@type': 'Person', 'name': 'Ola Olowu'}, {'@type': 'Person', 'name': 'Daniel Emeka'}],
        'knowsAbout': CAPABILITIES + ['Advertising', 'Brand strategy', 'TV commercials', 'Social media marketing', 'Influencer marketing', 'Digital marketing', 'Experiential marketing'],
        'slogan': 'Creating Tomorrow', 'areaServed': {'@type': 'Country', 'name': 'Nigeria'},
        'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Services', 'itemListElement': [
            {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': sv['name'], 'url': DOMAIN + sv['path']}} for sv in SV.SERVICES]},
        'sameAs': re.findall(r"\['[^']+', '(https://[^']+)'\]", js[js.index('const SOCIALS'):js.index('const SOCIALS') + 800]),
    }
    website = {'@type': 'WebSite', '@id': DOMAIN + '/#website', 'url': DOMAIN + '/', 'name': 'The Republic', 'inLanguage': 'en-GB', 'publisher': {'@id': DOMAIN + '/#org'}}

    def crumbs(r):
        items = [('Home', '/')]
        if r == 'gate': return None
        if r.endswith('-case') or r in WORLDS: items.append(('Work', '/work'))
        if r.startswith('svc-'): items.append(('Services', '/services'))
        name = meta[r]['t'].split(' | ')[0]
        items.append((name, meta[r]['p']))
        return {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': DOMAIN + (u if u != '/' else '/')} for i, (n, u) in enumerate(items)]}

    def ld(r):
        m, url = meta[r], DOMAIN + (meta[r]['p'] if meta[r]['p'] != '/' else '/')
        typ = {'gate': 'WebPage', 'work': 'CollectionPage', 'studio': 'AboutPage', 'contact': 'ContactPage', 'services': 'CollectionPage'}.get(r, 'WebPage')
        page = {'@type': typ, '@id': url + '#webpage', 'url': url, 'name': m['t'], 'description': m['d'], 'inLanguage': 'en-GB',
                'isPartOf': {'@id': DOMAIN + '/#website'}, 'about': {'@id': DOMAIN + '/#org'}, 'primaryImageOfPage': {'@type': 'ImageObject', 'url': DOMAIN + m['o']}}
        b = crumbs(r)
        if b: page['breadcrumb'] = b
        g = [org, website, page]
        k = r[:-5] if r.endswith('-case') else r
        if r.endswith('-case') or r in WORLDS:
            name = CF[k]['title'] if k in CF else m['t'].split(' | ')[0].split(':')[0]
            client = CF[k]['facts'][0][1] if k in CF else (byId.get(k) or {}).get('c')
            work = {'@type': 'CreativeWork', '@id': url + '#work', 'name': name, 'description': m['d'], 'url': url, 'image': DOMAIN + m['o'],
                    'creator': {'@id': DOMAIN + '/#org'}, 'inLanguage': 'en-GB'}
            if client: work['sourceOrganization'] = {'@type': 'Organization', 'name': client}
            page['mainEntity'] = {'@id': url + '#work'}
            g.append(work)
        if r.startswith('svc-'):
            sv = next(x for x in SV.SERVICES if x['key'] == r)
            g.append({'@type': 'Service', '@id': url + '#service', 'name': sv['name'], 'serviceType': sv['name'], 'description': sv['description'], 'url': url,
                      'provider': {'@id': DOMAIN + '/#org'}, 'areaServed': {'@type': 'Country', 'name': 'Nigeria'}, 'image': DOMAIN + m['o']})
            page['mainEntity'] = {'@id': url + '#service'}
        if r == 'services':
            g.append({'@type': 'FAQPage', '@id': url + '#faq', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in SV.FAQ]})
        if r == 'journal':
            g.append({'@type': 'BlogPosting', 'headline': ESSAY['headline'], 'description': ESSAY['description'], 'datePublished': ESSAY['date'],
                      'author': {'@type': 'Person', 'name': 'Daniel Emeka', 'jobTitle': 'Managing Director & Co-Founder', 'worksFor': {'@id': DOMAIN + '/#org'}},
                      'publisher': {'@id': DOMAIN + '/#org'}, 'mainEntityOfPage': url, 'image': DOMAIN + m['o'], 'inLanguage': 'en-GB'})
        if r == 'studio':
            g.append({'@type': 'ItemList', 'name': 'The Republic team', 'itemListElement': [
                {'@type': 'ListItem', 'position': i + 1, 'item': {'@type': 'Person', 'name': p['n'], 'jobTitle': p['r'], 'worksFor': {'@id': DOMAIN + '/#org'}}}
                for i, p in enumerate(sorted(TEAM, key=lambda p: (p['d'] != 'lead', p['n'])))]})
        return json.dumps({'@context': 'https://schema.org', '@graph': g}, ensure_ascii=False, separators=(',', ':'))

    def head(r):
        m = meta[r]
        url = DOMAIN + (m['p'] if m['p'] != '/' else '/')
        out = [f'<title>{esc(m["t"])}</title>', f'<meta name="description" content="{esc(m["d"])}">']
        if r == 'lost':
            out.append('<meta name="robots" content="noindex">')
        else:
            out.append(f'<link rel="canonical" href="{url}">')
        out += ['<meta property="og:site_name" content="The Republic">', '<meta property="og:locale" content="en_GB">',
                f'<meta property="og:type" content="{"article" if r == "journal" else "website"}">',
                f'<meta property="og:title" content="{esc(m["t"])}">', f'<meta property="og:description" content="{esc(m["d"])}">',
                f'<meta property="og:image" content="{DOMAIN}{m["o"]}">', '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">']
        if r != 'lost': out.append(f'<meta property="og:url" content="{url}">')
        out += ['<meta name="twitter:card" content="summary_large_image">', '<meta name="twitter:site" content="@TheRepHQ">',
                f'<meta name="twitter:title" content="{esc(m["t"])}">', f'<meta name="twitter:description" content="{esc(m["d"])}">', f'<meta name="twitter:image" content="{DOMAIN}{m["o"]}">']
        if r != 'lost': out.append(f'<script type="application/ld+json">{ld(r)}</script>')
        return '\n'.join(out)

    def prerender_case(s, k):
        """Fill the case-file template with the case's own text so the raw HTML carries it (the app re-renders the same on load)."""
        f, c = CF[k], byId[k]
        def fill(sid, inner):
            nonlocal s
            pat = re.compile(r'(<(\w+)[^>]*\bid="' + sid + r'"[^>]*>)(.*?)(</\2>)', re.S)
            s, n = pat.subn(lambda mm: mm.group(1) + inner + mm.group(4), s, count=1)
            assert n == 1, sid
        fill('cf-k', esc(c.get('b') or f['facts'][0][1]))
        fill('cf-h', esc(f['title']))
        fill('cf-line', esc(f['line']))
        fill('cf-facts', ''.join(f'<div><dt>{esc(a)}</dt><dd>{esc(b)}</dd></div>' for a, b in f['facts']))
        fill('cf-story-b', ''.join(f'<p class="big" style="font-size:clamp(28px,3.2vw,48px)">{esc(p)}</p>' if i == 0 else f'<p class="p">{esc(p)}</p>' for i, p in enumerate(f['story'])))
        fill('cf-steps', ''.join(f'<li><span><b>{esc(a)}.</b> {esc(b)}</span></li>' for a, b in f['steps']))
        if f.get('stats'):
            fill('cf-stats', ''.join(f'<div class="stat"><span class="n">{esc(a)}</span><p>{esc(b)}</p></div>' for a, b in f['stats']))
        if f.get('hero'):
            s = re.sub(r'(<img[^>]*\bid="cf-img")', lambda mm: mm.group(1) + f' src="img/{esc(f["hero"])}" alt="{esc(f.get("cap", f["title"]))}"', s, count=1)
        return s

    def case_item(k):
        if k in SV.FLAGSHIP:
            client, title, line = SV.FLAGSHIP[k]; path = P[k + '-case']
        else:
            f = CF[k]; client, title, line, path = f['facts'][0][1] + (' · ' + byId[k]['b'] if byId[k].get('b') and byId[k]['b'] != f['facts'][0][1] else ''), f['title'], f['line'], P[k + '-case']
        return f'<li><a href="{path}"><span class="k">{esc(client)}</span><b>{esc(title)}</b><span>{esc(line)}</span></a></li>'

    def services_markup():
        # the app routes the same six pages; keep its list in step with services.py
        mm = re.search(r"const SVC_PAGES = \[([^\]]*)\]", js)
        assert mm and re.findall(r"'([^']+)'", mm.group(1)) == [sv['key'] for sv in SV.SERVICES], 'SVC_PAGES in app.js does not match scripts/services.py'
        assert '<!--SERVICES-->' in tpl, 'src/site.html is missing <!--SERVICES-->'
        h = SV.HUB
        cards = ''.join(f'<li><a href="{sv["path"]}"><span class="num">{i + 1:02d}</span><b>{esc(sv["name"])}</b><span>{esc(sv["h1"])}</span><i aria-hidden="true">→</i></a></li>' for i, sv in enumerate(SV.SERVICES))
        faq = ''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in SV.FAQ)
        out = [f'''<div class="pscrim" data-for="services" hidden aria-hidden="true"></div>
<article class="page" data-for="services" aria-labelledby="services-h" hidden>
  <section class="ssec pg0"><div class="sin svcin">
    <p class="eyebrow">{esc(h['eyebrow'])}</p>
    <h1 data-ph class="mega svch" id="services-h" tabindex="-1">{esc(h['h1'])}</h1>
    <p class="lead">{esc(h['lead'])}</p>
  </div></section>
  <section class="ssec"><div class="pgpanel">
    <p class="eyebrow">Six disciplines · One team</p>
    <h2 class="big">What we do.</h2>
    <ul class="svcgrid">{cards}</ul>
  </div></section>
  <section class="ssec"><div class="pgpanel">
    <p class="eyebrow">Questions · Answered plainly</p>
    <h2 class="big">About The Republic.</h2>
    <div class="faq">{faq}</div>
    <div class="row"><a class="btn primary" href="/contact">Start a conversation →</a><a class="btn outline" href="/work">See the work →</a></div>
  </div></section>
  <div data-foot="full"></div>
</article>''']
        for sv in SV.SERVICES:
            k = sv['key']
            cov = ''.join(f'<div><p class="num">{"I" * (i + 1) if i < 3 else i + 1}</p><h3>{esc(a)}</h3><p>{esc(b)}</p></div>' for i, (a, b) in enumerate(sv['covers']))
            work = ''.join(case_item(c) for c in sv['cases'])
            others = ''.join(f'<a class="btn link" href="{o["path"]}">{esc(o["name"])} →</a>' for o in SV.SERVICES if o['key'] != k)
            out.append(f'''<div class="pscrim" data-for="{k}" hidden aria-hidden="true"></div>
<article class="page" data-for="{k}" aria-labelledby="{k}-h" hidden>
  <section class="ssec pg0"><div class="sin svcin">
    <p class="eyebrow"><a href="/services">Services</a> · {esc(sv['name'])}</p>
    <h1 data-ph class="mega svch" id="{k}-h" tabindex="-1">{esc(sv['h1'])}</h1>
    <p class="lead">{esc(sv['lead'])}</p>
  </div></section>
  <section class="ssec"><div class="pgpanel">
    <p class="eyebrow">What it covers</p>
    <h2 class="big">{esc(sv['name'])}, done properly.</h2>
    <div class="pgcols three">{cov}</div>
  </div></section>
  <section class="ssec"><div class="pgpanel">
    <p class="eyebrow">The proof · Selected work</p>
    <h2 class="big">Work that shows it.</h2>
    <ul class="svcwork">{work}</ul>
    <div class="row"><a class="btn primary" href="/contact">Start a conversation →</a><a class="btn outline" href="/method">How we work →</a></div>
  </div></section>
  <section class="ssec"><div class="pgpanel">
    <p class="eyebrow">Other services</p>
    <div class="svcmore">{others}</div>
  </div></section>
  <div data-foot="full"></div>
</article>''')
        return '\n'.join(out)
    SVC_HTML = services_markup()

    def page(r):
        key = 'file' if (r.endswith('-case') and r[:-5] in CF) else r
        s = tpl.replace('<!--SERVICES-->', SVC_HTML).replace('<!--SEO-->', head(r)).replace('<!--CSS-->', css_tag).replace('<!--JS-->', js_tag)
        # show this page's section in the raw HTML and hide the rest (the app does the same on load)
        def vis(mm):
            tag, fk = mm.group(0), mm.group(1)
            tag = re.sub(r'\shidden(?=[\s>])', '', tag)
            return tag if fk == key else tag[:-1] + ' hidden>'
        s = re.sub(r'<(?:section|article|div)[^>]*\bdata-for="([^"]+)"[^>]*>', vis, s)
        # one h1: this page's heading; every other page heading becomes h2
        out, last, pos = [], None, 0
        for mm in re.finditer(r'<(?:section|article|div)[^>]*\bdata-for="([^"]+)"[^>]*>|<h1 data-ph([^>]*)>(.*?)</h1>', s, re.S):
            if mm.group(1): last = mm.group(1); continue
            lvl = 'h1' if last == key else 'h2'
            out.append(s[pos:mm.start()]); out.append(f'<{lvl} data-ph{mm.group(2)}>{mm.group(3)}</{lvl}>'); pos = mm.end()
        out.append(s[pos:]); s = ''.join(out)
        if key == 'file': s = prerender_case(s, r[:-5])
        return s

    outputs = {}
    for r in list(P) + ['lost']:
        fn = '404.html' if r == 'lost' else ('index.html' if P[r] == '/' else P[r].lstrip('/') + '.html')
        outputs[fn] = page(r)
    outputs['assets/routes.js'] = routes_js
    flag = [('onga', 'Promasidor Nigeria')] + [(k, c) for k, c in [('cowbell', 'Promasidor Nigeria'), ('spruce', 'CAP Plc'), ('pzl', 'Prudential Zenith Life Insurance'), ('zenith', 'Zenith Bank')]]
    work_lines = [f"- [{SV.FLAGSHIP[k][1]}]({DOMAIN}{P[k + '-case']}): {SV.FLAGSHIP[k][0]}. {SV.FLAGSHIP[k][2]}" for k, _ in flag]
    work_lines += [f"- [{f['title']}]({DOMAIN}{P[k + '-case']}): {f['facts'][0][1]}. {f['line']}" for k, f in CF.items()]
    outputs['llms.txt'] = '\n'.join([
        '# The Republic', '',
        '> Independent creative and advertising agency in Lagos, Nigeria (The Republic Studios Ltd, RC 7371417). Strategy-led campaigns, content, digital work and brand experiences for African and global brands, including Promasidor, CHI, Prudential Zenith Life Insurance, Zenith Bank, Sanlam Allianz and CAP Plc (Spruce by Dulux).', '',
        'Address: 10 Onisiwo Road, Ikoyi, Lagos, Nigeria. Email: office@therepublic.agency. Telephone: +234 700 700 5252.',
        'Leadership: Ola Olowu (Chairman & Co-Founder), Daniel Emeka (Managing Director & Co-Founder), Aderoju Adeniji (Head of Operations & Client Service).',
        'How we work: strategy first. Every brief starts with questions about people and moves through five steps: the problem, the human truth, the idea, the system and the evidence.', '',
        '## Services', ''] + [f"- [{sv['name']}]({DOMAIN}{sv['path']}): {sv['description']}" for sv in SV.SERVICES] + [
        '', '## Selected work', ''] + work_lines + [
        '', '## About', '',
        f'- [Studio and team]({DOMAIN}/studio): who we are, our story and the clients we build for.',
        f'- [Method]({DOMAIN}/method): how a brief becomes work.',
        f'- [Journal]({DOMAIN}/journal): articles and case films.',
        f'- [Frequently asked questions]({DOMAIN}/services): plain answers about the agency.',
        f'- [Contact]({DOMAIN}/contact)', '']) 
    outputs['robots.txt'] = 'User-agent: *\nAllow: /\n\n# AI assistants and AI search are welcome to read this site\n' + ''.join(
        f'User-agent: {b}\nAllow: /\n\n' for b in ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']) + f'Sitemap: {DOMAIN}/sitemap.xml\n'
    urls = sorted(P.values(), key=lambda u: (u != '/', u))
    outputs['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        f'  <url><loc>{DOMAIN}{u if u != "/" else "/"}</loc><lastmod>{TODAY}</lastmod></url>\n' for u in urls) + '</urlset>\n'

    outputs['.htaccess'] = htaccess()

    # sanity: one h1 per page, unique titles and descriptions, sensible lengths
    titles, descs, warn = {}, {}, []
    for fn, s in outputs.items():
        if not fn.endswith('.html'): continue
        h1 = re.findall(r'<h1[\s>]', s)
        assert len(h1) == 1, (fn, len(h1))
        t = re.search(r'<title>(.*?)</title>', s).group(1); d = re.search(r'name="description" content="([^"]*)"', s).group(1)
        assert t not in titles, (fn, 'duplicate title', titles.get(t)); titles[t] = fn
        assert d not in descs, (fn, 'duplicate description', descs.get(d)); descs[d] = fn
        if len(html.unescape(t)) > 62: warn.append(f'{fn}: title {len(html.unescape(t))} chars')
        dl = len(html.unescape(d))
        if not 110 <= dl <= 160: warn.append(f'{fn}: description {dl} chars')

    stale = []
    for fn, s in outputs.items():
        path = os.path.join(PUB, fn)
        cur = open(path).read() if os.path.exists(path) else None
        if cur != s:
            stale.append(fn)
            if not check:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                open(path, 'w').write(s)
    print(f'{len([f for f in outputs if f.endswith(".html")])} pages, {len(urls)} sitemap URLs; ' + (f'{len(stale)} out of date' if check else f'{len(stale)} written'))
    for w in warn: print('  warning:', w)
    if check and stale:
        print('  out of date:', ', '.join(stale[:10])); sys.exit(1)


if __name__ == '__main__':
    main(check='--check' in sys.argv)
