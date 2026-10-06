# 2:3 の生成画像を「切らずに」9:16（1080×1920）にする。上に空を足して、文字の置き場を作る。
# 夜の窓（木曜の1枚リール）用。左右の窓が端に寄っていて、9:16 に切ると窓枠が切れる絵に使う。
#
#   python3 prep-sky.py <生成画像.png> plate-xxx.png [縮小率=0.97] [空の帯の高さ=140]
#
# - 画像を縮小率で縮め、下端を画面の下にそろえる
# - 上の空き地は、元画像の最上部の帯（空だけの部分）を上下反転しながら積んで埋める。
#   引き伸ばすと空の粒が縦の筋になる（2026-09-23 に踏んだ）
# - 左右の足りない幅は、端の数十px を左右反転して埋める（壁の続きに見える）
# 吹き出しは render-kotosan.js omote（y=380..531）で載せる。屋根の線が y=560 より下に来ることを確認する
import sys
from PIL import Image, ImageOps

src, out = sys.argv[1], sys.argv[2]
k    = float(sys.argv[3]) if len(sys.argv) > 3 else 0.97
band = int(sys.argv[4])   if len(sys.argv) > 4 else 140

im = Image.open(src).convert("RGB")
W, H = round(im.width * k), round(im.height * k)
im = im.resize((W, H), Image.LANCZOS)
top = 1920 - H
assert top >= 0, "縮小率が大きすぎる（高さが 1920 を超える）"

strip = im.crop((0, 0, W, band))
inner = Image.new("RGB", (W, 1920))
y, flip = top + band, True
while y > 0:
    y -= band
    inner.paste(ImageOps.flip(strip) if flip else strip, (0, y))
    flip = not flip
inner.paste(im.crop((0, band, W, H)), (0, top + band))

plate = Image.new("RGB", (1080, 1920))
off = (1080 - W) // 2
r = 1080 - W - off
plate.paste(inner, (off, 0))
if off: plate.paste(ImageOps.mirror(inner.crop((0, 0, off, 1920))), (0, 0))
if r:   plate.paste(ImageOps.mirror(inner.crop((W - r, 0, W, 1920))), (off + W, 0))
plate.save(out)
print(f"-> {out}  scale={k} image={W}x{H} sky+{top}px side={off}/{r}px")
