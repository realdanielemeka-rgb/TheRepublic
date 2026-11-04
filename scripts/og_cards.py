"""Share cards (1200x630) for the services hub and the six service pages, in the same style as the other cards in public/og/.

Run from the repo root: python3 scripts/og_cards.py
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
import services  # noqa: E402

W, H = 1200, 630
INK, PAPER, SMOKE, BLUE = (10, 10, 10), (244, 242, 238), (201, 201, 207), (31, 31, 255)
FONTS = os.path.join(ROOT, 'tests', 'vendor', 'fonts')
SG = os.path.join(FONTS, 'SchibstedGrotesk[wght].ttf')
HJ = os.path.join(FONTS, 'Handjet[ELGR,ELSH,wght].ttf')
IMG = os.path.join(ROOT, 'public', 'img')
OUT = os.path.join(ROOT, 'public', 'og')


def sg(size):
    f = ImageFont.truetype(SG, size)
    try:
        f.set_variation_by_axes([800])
    except Exception:
        pass
    return f


def hj(size):
    return ImageFont.truetype(HJ, size)


def wrap(d, text, f, maxw):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=f) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


logo = Image.open(os.path.join(IMG, 'logo.png')).convert('RGBA')
logo = logo.resize((64, int(64 * logo.height / logo.width)))


def card(key, eyebrow, title, img):
    c = Image.new('RGB', (W, H), INK)
    im = Image.open(os.path.join(IMG, img)).convert('RGB')
    tw, th = 620, H
    r = max(tw / im.width, th / im.height)
    im = im.resize((int(im.width * r) + 1, int(im.height * r) + 1), Image.LANCZOS)
    x0 = (im.width - tw) // 2
    y0 = max(0, int((im.height - th) * .3))
    c.paste(im.crop((x0, y0, x0 + tw, y0 + th)), (W - tw, 0))
    g = Image.new('L', (tw, 1))
    for x in range(tw):
        g.putpixel((x, 0), int(255 * max(0, 1 - x / 260)))
    c.paste(Image.new('RGB', (tw, H), INK), (W - tw, 0), g.resize((tw, H)))
    d = ImageDraw.Draw(c)
    c.paste(logo, (56, 50), logo)
    d.text((56, 150), eyebrow.upper(), font=hj(28), fill=SMOKE)
    size = 76 if len(title) < 40 else 62 if len(title) < 70 else 54
    ft = sg(size)
    y = 196
    for ln in wrap(d, title, ft, 640)[:4]:
        d.text((56, y), ln, font=ft, fill=PAPER)
        y += int(size * 1.02)
    d.rectangle((56, H - 78, 120, H - 72), fill=BLUE)
    d.text((136, H - 92), 'THEREPUBLIC.AGENCY', font=hj(26), fill=SMOKE)
    c.save(os.path.join(OUT, f'og-{key}.jpg'), quality=84, optimize=True, progressive=True)


if __name__ == '__main__':
    card('services', 'Creative & advertising agency · Lagos, Nigeria', services.HUB['h1'], 'lagos-collage.webp')
    for s in services.SERVICES:
        card(s['key'], 'Services · ' + s['name'], s['h1'], s['img'])
    print('ok', 1 + len(services.SERVICES), 'cards')
