from PIL import Image, ImageDraw, ImageFont
import os

SRC = "/mnt/user-data/uploads/92537F00-8EC4-445B-A9D8-ABB9AC0C6404_1_102_o.jpeg"
OUT = "/mnt/user-data/outputs/badge"
os.makedirs(OUT, exist_ok=True)

PAPER = (245, 238, 230)
LINE  = (228, 213, 198)
DEEP  = (169, 107, 79)
INK   = (74, 59, 51)
FAINT = (138, 118, 104)

REG = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
MED = "/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc"
S = 6

icon = Image.open(SRC).convert("RGB").crop((112, 212, 832, 912))


def font(p, path=REG):
    return ImageFont.truetype(path, int(round(p * S)), index=0)


def tracked(d, xy, text, f, fill, sp):
    x, base = xy
    sp *= S
    for ch in text:
        d.text((x, base), ch, font=f, fill=fill, anchor="ls")
        x += d.textlength(ch, font=f) + sp


def tracked_w(d, text, f, sp):
    return sum(d.textlength(c, font=f) + sp * S for c in text) - sp * S


def build_wide():
    W, H = 260, 72
    img = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([S, S, W * S - S, H * S - S], radius=10 * S,
                        fill=PAPER, outline=LINE, width=int(1.5 * S))
    side = 56
    ic = icon.resize((side * S, side * S), Image.LANCZOS)
    img.paste(ic, (10 * S, 8 * S))
    d.line([(78 * S, 18 * S), (78 * S, 54 * S)], fill=LINE, width=S)
    tracked(d, (92 * S, 28 * S), "KINDA VOICES", font(9), DEEP, 1.7)
    tracked(d, (92 * S, 48 * S), "インタビュー掲載", font(14, MED), INK, 0.5)
    tracked(d, (92 * S, 62 * S), "kinda.jp", font(9), FAINT, 0.8)
    return img, W, H


def build_square():
    W, H = 200, 200
    img = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([S, S, W * S - S, H * S - S], radius=14 * S,
                        fill=PAPER, outline=LINE, width=int(1.5 * S))
    side = 96
    ic = icon.resize((side * S, side * S), Image.LANCZOS)
    img.paste(ic, (52 * S, 14 * S))
    d.line([(74 * S, 126 * S), (126 * S, 126 * S)], fill=LINE, width=int(1.2 * S))
    for text, f, fill, sp, base in [
        ("KINDA VOICES", font(10), DEEP, 2.0, 150),
        ("インタビュー掲載", font(15, MED), INK, 0.5, 173),
        ("kinda.jp", font(9.5), FAINT, 1.0, 189),
    ]:
        w = tracked_w(d, text, f, sp)
        tracked(d, (100 * S - w / 2, base * S), text, f, fill, sp)
    return img, W, H


def save(img, W, H, name):
    for m, sfx in ((1, ""), (2, "@2x")):
        o = img.resize((W * m, H * m), Image.LANCZOS)
        p = f"{OUT}/{name}{sfx}.png"
        o.save(p, "PNG", optimize=True)
        print(f"{os.path.getsize(p):>8,}  {p}")


save(*build_wide(), "voices-wide")
save(*build_square(), "voices-square")

# preview sheet
sheet = Image.new("RGB", (900, 300), (255, 255, 255))
sd = ImageDraw.Draw(sheet)
cap = ImageFont.truetype(REG, 12, index=0)
w1 = Image.open(f"{OUT}/voices-wide.png")
s1 = Image.open(f"{OUT}/voices-square.png")

sd.rectangle([24, 24, 24 + 300, 24 + 120], fill=(255, 255, 255), outline=(235, 235, 235))
sheet.paste(w1, (44, 48), w1)
sd.text((24, 152), "白背景", font=cap, fill=(140, 140, 140))

sd.rectangle([360, 24, 360 + 300, 24 + 120], fill=(250, 248, 245))
sheet.paste(w1, (380, 48), w1)
sd.text((360, 152), "淡色背景", font=cap, fill=(140, 140, 140))

sd.rectangle([690, 24, 690 + 186, 24 + 120], fill=(44, 42, 40))
ws = w1.resize((int(260 * 0.62), int(72 * 0.62)), Image.LANCZOS)
sheet.paste(ws, (706, 62), ws)
sd.text((690, 152), "濃色背景・縮小62%", font=cap, fill=(140, 140, 140))

sheet.paste(s1, (44, 184), s1)
sd.rectangle([360, 180, 360 + 208, 180 + 208], fill=(44, 42, 40))
sheet.paste(s1, (364, 184), s1)
sd.text((24, 176 + 210), "正方形（白背景 / 濃色背景）", font=cap, fill=(140, 140, 140))
sheet.save("/mnt/user-data/outputs/badge-final-preview.png")
print("preview saved")
