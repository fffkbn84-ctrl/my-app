# スクリーンショット（1170幅）の一部を、角丸・影つきでリールの台紙（1080×1920・#F5EEE6）に置く。
# 文字ブロック（y=1120〜）に被らないよう、画面は y=90〜1090 に収める。
#   python3 prep-screen.py <入力> <出力> <切り出し上y> <切り出し下y> <表示幅>
# 実績（10/8 薄日）：質問 273 1723 760／結果 481 2057 720（どちらも 3倍の座標）
import sys
from PIL import Image, ImageDraw, ImageFilter
src, out, y0, y1, w = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
im = Image.open(src).convert('RGB').crop((0, y0, 1170, y1))
h = round(im.height * w / 1170); im = im.resize((w, h), Image.LANCZOS)
cx, r = 540, 36
top = max(90, min(round(600 - h / 2), 1090 - h))
bg = Image.new('RGB', (1080, 1920), '#F5EEE6')
mask = Image.new('L', (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255)
sh = Image.new('L', (1080, 1920), 0)
ImageDraw.Draw(sh).rounded_rectangle((cx - w // 2, top + 14, cx + w // 2, top + h + 14), r, fill=70)
bg = Image.composite(Image.new('RGB', (1080, 1920), '#B8A592'), bg, sh.filter(ImageFilter.GaussianBlur(28)))
bg.paste(im, (cx - w // 2, top), mask)
ImageDraw.Draw(bg).rounded_rectangle((cx - w // 2, top, cx + w // 2 - 1, top + h - 1), r, outline='#E2D6C8', width=2)
bg.save(out); print(out, top, h)
