# 甘やかしキャラ（なまけものママ）用：ASMR ふうの環境音を焼き込む（2026-10-04）。
# 音楽ではなく「夜の部屋の音」で温かさを出す。全部 numpy で合成するので権利の心配なし。
#
#   python3 add_asmr.py <in.mp4> <out.mp4> [preset]
#
# 音：room（部屋の空気）／bugs（秋の虫・遠く）／cloth（布のこすれ）／bowl（お椀を置くコトッ）
#     steam（湯気）／bath（お湯がたまる音）／plink（しずく）
# IG 側で曲を足すなら、この音を残して曲の音量を 20〜30% に下げる。
import sys, subprocess, wave
import numpy as np, imageio_ffmpeg

SR = 44100
R = np.random.RandomState(7)

def noise(dur):
    return R.randn(int(SR * dur))
def band(x, lo, hi):                       # FFT で帯域だけ残す
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))
def brown(dur):
    b = np.cumsum(noise(dur)); b -= np.convolve(b, np.ones(4410) / 4410, "same")
    return b / (np.abs(b).max() + 1e-9)
def fade(x, a, d):                          # a 秒で入って d 秒で抜ける
    n = len(x); t = np.arange(n) / SR; T = n / SR
    return x * np.clip(t / max(a, 1e-3), 0, 1) * np.clip((T - t) / max(d, 1e-3), 0, 1)
def norm(x):
    return x / (np.abs(x).max() + 1e-9)

def room(dur):  return norm(band(brown(dur), 30, 400)) * .09
def bugs(dur):                              # 鈴虫ふう：4.2kHz の短いトリルを間をあけて
    n = int(SR * dur); out = np.zeros(n); t0 = .3
    while t0 < dur - .6:
        m = int(SR * .45); t = np.arange(m) / SR
        tr = np.sin(2 * np.pi * 4200 * t) * (np.sin(2 * np.pi * 38 * t) > 0) * np.sin(np.pi * t / .45)
        i = int(SR * t0); out[i:i + m] += tr[: n - i]
        t0 += R.uniform(.9, 1.6)
    return out * .022
def cloth(dur=.7):  return fade(norm(band(noise(dur), 1500, 6000)) * (1 + .6 * np.sin(np.linspace(0, 9, int(SR * dur)))), .15, .35) * .07
def bowl():
    n = int(SR * .5); t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * 180 * t) * np.exp(-t / .03)
    ring = (np.sin(2 * np.pi * 1180 * t) + .5 * np.sin(2 * np.pi * 2710 * t)) * np.exp(-t / .07)
    return (thump * .5 + ring * .25) * .5
def steam(dur):  return fade(norm(band(noise(dur), 3000, 9000)), .8, .9) * .025
def bath(dur):
    x = norm(band(noise(dur), 150, 1800))
    t = np.arange(len(x)) / SR
    gurgle = 1 + .35 * np.sin(2 * np.pi * 3.1 * t) * np.sin(2 * np.pi * .7 * t)
    return fade(x * gurgle, .6, .8) * .09
def plink():
    n = int(SR * .18); t = np.arange(n) / SR
    f = 900 + 1400 * t / .18
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .04) * .08

# mama4 のカット開始：0 / 2.7 / 5.4 / 7.5（0.5 秒のディゾルブ込み）・全長 11.6 秒
PRESETS = {
  "mama01": dict(total=11.6, events=[
      (0.00, lambda: fade(room(11.6), 1.2, 2.0)),
      (0.00, lambda: fade(bugs(11.6), 2.0, 2.5)),
      (0.35, lambda: cloth(.8)),                # のぞきこむ
      (3.05, bowl),                              # 豚汁を置く
      (3.00, lambda: steam(2.6)),                # 湯気
      (5.50, lambda: bath(2.6)),                 # お湯がたまる
      (6.30, plink), (6.95, plink), (7.40, plink),
      (7.75, lambda: cloth(1.1)),                # 両腕をひろげる
  ]),
}

src, dst = sys.argv[1], sys.argv[2]
P = PRESETS[sys.argv[3] if len(sys.argv) > 3 else "mama01"]
mix = np.zeros(int(SR * P["total"]))
for t0, make in P["events"]:
    s = make(); i = int(SR * t0); e = min(len(mix), i + len(s))
    mix[i:e] += s[: e - i]
mix = mix / (np.abs(mix).max() + 1e-9) * .85     # いちばん大きい音（お椀）を -1.4dB にそろえる
pcm = (np.stack([mix, mix], 1) * 32767).astype("<i2")
with wave.open("_asmr.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
FF = imageio_ffmpeg.get_ffmpeg_exe()
r = subprocess.run([FF, "-y", "-i", src, "-i", "_asmr.wav", "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", dst], capture_output=True, text=True)
print("exit", r.returncode, "->", dst)
if r.returncode: print(r.stderr[-2000:])
