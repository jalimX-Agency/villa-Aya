import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

OUT = sys.argv[1]
AMBER, BLUE = "#d9953a", "#1d4fa8"
THEMES = {"dark": ("#efe6d8", "#d9953a"), "light": ("#14100c", "#a8661a")}  # (text, accent) on dark bg / light bg

def text_path(fontfile, s, size, tracking, x0, y0, anchor="start"):
    f = TTFont(fontfile); gs = f.getGlyphSet(); cmap = f.getBestCmap()
    upm = f["head"].unitsPerEm; sc = size / upm
    adv = []
    for ch in s:
        g = cmap[ord(ch)]; adv.append((g, gs[g].width * sc))
    total = sum(a for _, a in adv) + tracking * (len(s) - 1)
    x = x0 - (total / 2 if anchor == "middle" else 0)
    d = ""
    for g, a in adv:
        pen = SVGPathPen(gs, ntos=lambda v: ("%.1f" % v).rstrip("0").rstrip("."))
        gs[g].draw(TransformPen(pen, (sc, 0, 0, -sc, x, y0)))
        d += pen.getCommands()
        x += a + tracking
    return d, total

def icon(ox, oy, k, accent, text):
    # 100x100 design grid, scaled by k, placed at ox,oy
    def P(x, y): return f"{ox + x*k:.2f} {oy + y*k:.2f}"
    s = [f'<path d="M{P(8,58)} L{P(50,16)} L{P(92,58)}" fill="none" stroke="{accent}" stroke-width="{5*k:.2f}" stroke-linecap="square" stroke-linejoin="miter"/>']
    for x in (26, 38, 50, 62, 74):
        roof_y = 66 - x if x <= 50 else x - 34
        s.append(f'<line x1="{ox+x*k:.2f}" y1="{oy+(roof_y+10)*k:.2f}" x2="{ox+x*k:.2f}" y2="{oy+86*k:.2f}" stroke="{text}" stroke-width="{4.5*k:.2f}"/>')
    return "".join(s)

SERIF = "C:/Windows/Fonts/GARA.TTF"; MONO = "C:/Windows/Fonts/consola.ttf"

def svg(w, h, body, bg=None):
    b = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img"><title>Villa Aya</title>{b}{body}</svg>'

def write(name, s): open(f"{OUT}/{name}.svg", "w", encoding="utf-8").write(s)

for t, (txt, acc) in THEMES.items():
    bg = "#14100c" if t == "dark" else None
    # icon only
    write(f"logo-icon-{t}", svg(100, 100, icon(0, 0, 1, acc, txt)))
    # vertical
    d1, w1 = text_path(SERIF, "VILLA AYA", 34, 9, 160, 210, "middle")
    d2, _ = text_path(MONO, "AHFIR · OUJDA", 11, 4, 160, 238, "middle")
    body = icon(110, 20, 1.0, acc, txt) + f'<path d="{d1}" fill="{txt}"/><path d="{d2}" fill="{acc}"/>'
    write(f"logo-vertical-{t}", svg(320, 270, body))
    # horizontal
    d1, w1 = text_path(SERIF, "VILLA AYA", 34, 9, 120, 62, "start")
    d2, _ = text_path(MONO, "AHFIR · OUJDA", 10.5, 4, 121, 86, "start")
    body = icon(0, 0, 1.0, acc, txt) + f'<path d="{d1}" fill="{txt}"/><path d="{d2}" fill="{acc}"/>'
    write(f"logo-horizontal-{t}", svg(int(120 + w1 + 10), 100, body))
# favicon: amber roof + cream lines on dark rounded square
fav = '<rect width="100" height="100" rx="18" fill="#14100c"/>' + icon(0, 0, 1, AMBER, "#efe6d8")
write("favicon", svg(100, 100, fav))
print("ok")
