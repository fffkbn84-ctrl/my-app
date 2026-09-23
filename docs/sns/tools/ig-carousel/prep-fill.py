# 背景が単色の 2:3 生成画像を、中身を大きくして 9:16（1080×1920）に組む。間取りなど「単色の背景に模型」の絵用。
# 夜の窓のように上が空の絵は prep-sky.py を使う。
#
#   python3 prep-fill.py <生成画像.png> plate-xxx.png <中身の左x> <中身の右x> <中身の上y> [中身の上端を置く y=580]
#
# - 中身（模型の外周）の左右が 1080 幅に収まる最大の倍率で拡大し、左右は中央に置く（余白 20px ずつ）
# - 中身の上端を y=580 に置く（吹き出し y=380..531 の下）。上に足りない分は、元画像の最上部の帯を上下反転して積む
#   （背景のわずかなグラデーションを保つため。単色で塗ると継ぎ目が出る）
import sys
from PIL import Image, ImageOps

src, out = sys.argv[1], sys.argv[2]
L, R, T = int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
top_at = int(sys.argv[6]) if len(sys.argv) > 6 else 580

im = Image.open(src).convert("RGB")
k = (1080 - 40) / (R - L)
im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
ox = round(540 - (L + R) / 2 * k)
oy = round(top_at - T * k)

canvas = Image.new("RGB", (1080, 1920))
canvas.paste(im, (ox, oy))
if oy > 0:
    band_h = min(round(T * k) - 20, oy)
    band = im.crop((-ox, 0, -ox + 1080, band_h))
    y, flip = oy, True
    while y > 0:
        y -= band_h
        canvas.paste(ImageOps.flip(band) if flip else band, (0, y))
        flip = not flip
canvas.save(out)
print(f"-> {out}  scale={k:.3f} offset=({ox},{oy})")
