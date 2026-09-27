# リールに効果音を焼き込む（音楽は入れない。音楽は IG／Edits 側で足す）。
# 効果音は numpy で合成するので著作権の問題がない。
#
#   python3 add_sfx.py <in.mp4> <out.mp4> <preset>
#
# 合成できる音：
#   pop   吹き出しが出る「ポン」      slide 力の抜ける下がり笛「ひゅ〜ん」
#   clack 真顔の「カッ」（拍子木）     ping  固まる「ピキーン」       drip 汗の「ぽた」
import sys, subprocess, wave
import numpy as np, imageio_ffmpeg

SR = 44100
def env(n, a=0.004, d=0.08):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)
def sweep(f0, f1, dur, d, vib=0):
    n = int(SR * dur); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * t / dur + vib * np.sin(2*np.pi*6*t)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, d=d)
SFX = {
  "pop":   lambda: sweep(380, 950, .09, .035) * .8,
  "slide": lambda: sweep(1300, 420, .75, .5, vib=25) * .35,
  "clack": lambda: (sweep(1250, 1180, .12, .018) + .6*sweep(2600, 2500, .12, .012)
                    + .25*np.random.RandomState(1).randn(int(SR*.12))*env(int(SR*.12), d=.006)) * .7,
  "ping":  lambda: (sweep(2350, 2400, .5, .16) + .7*sweep(3150, 3200, .5, .12)) * .35,
  "drip":  lambda: sweep(1500, 520, .11, .05) * .6,
}
# 「ふたり」第1回（cut 開始 0 / 2.5 / 5.3 / 7.6）
PRESETS = {
  "futari01": [(0.05,"pop"), (2.55,"pop"), (2.9,"slide"),
               (5.30,"clack"), (5.55,"pop"),
               (7.60,"ping"), (7.95,"pop"), (8.35,"drip")],
}
src, out, preset = sys.argv[1], sys.argv[2], sys.argv[3]
FF = imageio_ffmpeg.get_ffmpeg_exe()
dur = float(subprocess.run([FF, "-i", src], capture_output=True, text=True).stderr
            .split("Duration: ")[1].split(",")[0].split(":")[-1])
mix = np.zeros(int(SR * (dur + 1)))
for t, name in PRESETS[preset]:
    s = SFX[name](); i = int(t * SR); mix[i:i+len(s)] += s
mix = np.clip(mix[:int(SR*dur)], -1, 1)
pcm = (mix * 32767 * .9).astype(np.int16)
with wave.open("_sfx.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
subprocess.run([FF, "-y", "-i", src, "-i", "_sfx.wav", "-map", "0:v", "-map", "1:a",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-shortest", out], check=True,
               capture_output=True)
print(f"-> {out}  ({len(PRESETS[preset])} sfx, {dur:.2f}s)")
