"""One table for every page: its route key (as used by public/assets/app.js), its address, and its search metadata."""
import re, os, html as _html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMAIN = 'https://www.therepublic.agency'

# fixed pages and the five case worlds (case pages keep the old Wix addresses, so existing rankings carry over)
BASE = {
    'gate': '/', 'work': '/work', 'studio': '/studio', 'method': '/method', 'journal': '/journal', 'contact': '/contact', 'privacy': '/privacy',
    'onga': '/onga', 'cowbell': '/cowbell', 'spruce': '/spruce', 'pzl': '/prudential-zenith-life', 'zenith': '/zenith-bank',
    'onga-case': '/onga-taste-of-home', 'cowbell-case': '/cowbell-ramadan-your-first-taste', 'spruce-case': '/spruce-dulux-digital-launch',
    'pzl-case': '/prudential-zenith-empowering-tomorrow', 'zenith-case': '/zenith-bank-homecoming',
}


def casefiles(js=None):
    """The thirteen case files, read from the app's CASEFILES table: key, address slug, page title, title, one-line summary, client."""
    js = js or open(os.path.join(ROOT, 'public/assets/app.js')).read()
    out = {}
    for m in re.finditer(r"\n  (\w+): \{ seo: '((?:[^'\\]|\\.)*)', slug: '([^']*)', title: '((?:[^'\\]|\\.)*)',(?: eyebrowNote: '[^']*',)? line: '((?:[^'\\]|\\.)*)'.*?facts: \[\['Client', '([^']*)'\]", js, re.S):
        k, seo, slug, title, line, client = m.groups()
        out[k] = dict(seo=seo.replace("\\'", "'"), slug=slug, title=title.replace("\\'", "'"), line=line.replace("\\'", "'"), client=client)
    return out


def paths(js=None):
    p = dict(BASE)
    for k, c in casefiles(js).items():
        p[k + '-case'] = '/' + c['slug']
    return p
