# 「ふたり」用。2:3（1024×1536）の生成画像を 9:16（1080×1920）の台紙にする。
# 横幅いっぱいに拡大し、上端を y=TOP に置く。上下に足りない分は元画像の端の帯を上下反転して積む
# （背景のわずかなグラデーションを保つため。単色で塗ると継ぎ目が出る）。
#
#   python3 prep-futari.py <生成画像.png> plate-xxx.png [上端 y=260]
import sys
from PIL import Image, ImageOps

src, out = sys.argv[1], sys.argv[2]
top = int(sys.argv[3]) if len(sys.argv) > 3 else 260

im = Image.open(src).convert("RGB")
k = 1080 / im.width
im = im.resize((1080, round(im.height * k)), Image.LANCZOS)
canvas = Image.new("RGB", (1080, 1920))
canvas.paste(im, (0, top))

band = im.crop((0, 0, 1080, 200))           # 上の帯（空の背景）
y, flip = top, True
while y > 0:
    y -= 200
    canvas.paste(ImageOps.flip(band) if flip else band, (0, y))
    flip = not flip

bottom = top + im.height
if bottom < 1920:
    band = im.crop((0, im.height - 120, 1080, im.height))
    y, flip = bottom, True
    while y < 1920:
        canvas.paste(ImageOps.flip(band) if flip else band, (0, y))
        y += 120
        flip = not flip
canvas.save(out)
print(f"-> {out}  scale={k:.3f} top={top} bottom={bottom}")
