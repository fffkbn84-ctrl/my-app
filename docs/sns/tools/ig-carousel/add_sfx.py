# リールに効果音を焼き込む（音楽は入れない。音楽は IG／Edits 側で足す）。
# 効果音は numpy で合成するので著作権の問題がない。
#
#   python3 add_sfx.py <in.mp4> <out.mp4> <preset>
#
# 合成できる音：
#   pop   吹き出しが出る「ポン」      slide 力の抜ける下がり笛「ひゅ〜ん」
#   clack 真顔の「カッ」（拍子木）     ping  固まる「ピキーン」       drip 汗の「ぽた」
#   kira  眼鏡が光る「キラッ」         gulp  飲み込む「ごくん」
#   pico  ゲームのカーソル「ピコ」     over  ゲームオーバー（下がる3音）  lvup レベルアップ（上がる4音）
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
def sq(freq, dur, d=.08):      # ファミコンふうの矩形波
    n = int(SR * dur); t = np.arange(n) / SR
    return np.sign(np.sin(2*np.pi*freq*t)) * env(n, a=.002, d=d)
def seq(notes, step, d):       # 音を順に並べる
    return np.concatenate([sq(f, step, d) for f in notes])
SFX = {
  "pop":   lambda: sweep(380, 950, .09, .035) * .8,
  "slide": lambda: sweep(1300, 420, .75, .5, vib=25) * .35,
  "clack": lambda: (sweep(1250, 1180, .12, .018) + .6*sweep(2600, 2500, .12, .012)
                    + .25*np.random.RandomState(1).randn(int(SR*.12))*env(int(SR*.12), d=.006)) * .7,
  "ping":  lambda: (sweep(2350, 2400, .5, .16) + .7*sweep(3150, 3200, .5, .12)) * .35,
  "drip":  lambda: sweep(1500, 520, .11, .05) * .6,
  "kira":  lambda: (sweep(2800, 3600, .35, .12) + .6*sweep(4200, 5000, .35, .08)) * .25,
  "gulp":  lambda: (sweep(420, 140, .22, .09) + .5*sweep(210, 90, .22, .12)) * .9,
  "pico":  lambda: sq(1320, .06, .03) * .18,
  "over":  lambda: seq([392, 330, 262, 196], .28, .25) * .16,
  "lvup":  lambda: seq([523, 659, 784, 1047], .11, .09) * .16,
}
# 「ふたり」第1回（cut 開始 0 / 2.5 / 5.3 / 7.6）
PRESETS = {
  "futari01": [(0.05,"pop"), (2.55,"pop"), (2.9,"slide"),
               (5.30,"clack"), (5.55,"pop"),
               (7.60,"ping"), (7.95,"pop"), (8.35,"drip")],
  # ことさん v2 #3（kotosanv2：cut 開始 0 / 2.5 / 4.4 / 6.1）
  # 「ふたり」ゲームオーバー回（futari-go6：cut 開始 0 / 2.4 / 4.3 / 6.7 / 8.4 / 10.3）
  "futari-go": [(0.40,"pico"), (0.90,"pico"), (2.45,"pop"), (4.30,"over"),
                (6.80,"pico"), (7.30,"pico"), (8.45,"pop"), (10.35,"lvup")],
  "kotosan03": [(0.05,"pop"), (2.50,"pop"), (4.40,"gulp"), (6.10,"kira"), (6.30,"pop")],
  # ことさん v2・救いのある回（kotosanv2s：cut 開始 0 / 2.5 / 4.4 / 6.1 / 8.7）。救いは音を足さない
  "kotosan06": [(0.05,"pop"), (2.50,"pop"), (4.40,"gulp"), (6.10,"kira"), (6.30,"pop")],
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
