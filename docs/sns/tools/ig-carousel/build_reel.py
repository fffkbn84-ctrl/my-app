# フレーム（f*.png）を MP4 に組む。H.264 / yuv420p / 30fps / 無音AAC入り。音楽は IG 側で足す。
#
#   python3 build_reel.py                      # 既定＝連載・つくる日記（従来どおり）
#   python3 build_reel.py pair      out.mp4
#   python3 build_reel.py kotosan4  out.mp4    # ことさん・軽い回（4カット）
#   python3 build_reel.py kotosan5  out.mp4    # ことさん・救いのある回（5カット）
#
# SEGS は (frame, 尺, ズーム開始, ズーム終了, 静止)。
#   静止 = 尺の最後の何秒をズームを止めて見せるか。ことさんは 3カット目の末尾 0.5 秒が
#   「飲み込む間」になる（kotosan-reel.md §2）
# XFS は各カット間のクロスディゾルブの秒数。ことさんは 3→4 だけ 0.15（オチの切れ味）
import subprocess, sys, imageio_ffmpeg

FF  = imageio_ffmpeg.get_ffmpeg_exe()
FPS = 30

PRESETS = {
  # 連載・つくる日記（従来の値。変えない）
  "pair": (
    [("f1.png",3.5,1.00,1.00,0.0),
     ("f2.png",4.0,1.00,1.04,0.0),
     ("f3.png",4.5,1.00,1.04,0.0),
     ("f4.png",4.5,1.00,1.04,0.0),
     ("f5.png",3.0,1.04,1.07,0.0)],
    [0.4,0.4,0.4,0.4]),

  # ことさん・軽い回（kotosan-reel.md §2）
  "kotosan4": (
    [("f1.png",3.5,1.00,1.00,0.0),   # 場面。ズームなし・状況を読ませる
     ("f2.png",3.5,1.00,1.03,0.0),   # 表の言葉
     ("f3.png",3.5,1.00,1.03,0.5),   # 本音。末尾 0.5 秒は静止＝飲み込む間
     ("f4.png",2.5,1.00,1.08,0.0)],  # （ごくん）。ここだけ強く寄る
    [0.35,0.35,0.15]),               # 3→4 だけ 0.15

  # ことさん・救いのある回
  "kotosan5": (
    [("f1.png",3.5,1.00,1.00,0.0),
     ("f2.png",3.5,1.00,1.03,0.0),
     ("f3.png",3.5,1.00,1.03,0.5),
     ("f4.png",2.5,1.00,1.08,0.0),
     ("f5.png",3.0,1.00,1.03,0.0)],  # 救い
    [0.35,0.35,0.15,0.35]),
}

preset = sys.argv[1] if len(sys.argv) > 1 else "pair"
out    = sys.argv[2] if len(sys.argv) > 2 else "kinda-ig-reel.mp4"
if preset not in PRESETS:
    sys.exit(f"unknown preset: {preset}  (choose from {', '.join(PRESETS)})")
SEGS, XFS = PRESETS[preset]
assert len(XFS) == len(SEGS)-1, "XFS はカット数-1 個"

ins, filt = [], []
for i,(f,d,z0,z1,hold) in enumerate(SEGS):
    ins += ["-loop","1","-framerate",str(FPS),"-t",f"{d}","-i",f]
    if z0 == z1:
        z = f"{z0}"
    else:
        m = max(2, int(round((d-hold)*FPS)))          # ズームを終える位置
        z = f"min({z0}+{z1-z0:.4f}*on/{m-1},{z1})"    # そのあとは z1 のまま静止
    filt.append(
      f"[{i}:v]scale=2160:3840:flags=lanczos,"
      f"zoompan=z='{z}':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps={FPS},"
      f"setsar=1[v{i}]")

prev, length = "v0", SEGS[0][1]
for i in range(1,len(SEGS)):
    xf  = XFS[i-1]
    off = length - xf
    filt.append(f"[{prev}][v{i}]xfade=transition=fade:duration={xf}:offset={off:.3f}[x{i}]")
    length = length + SEGS[i][1] - xf
    prev = f"x{i}"
filt.append(f"[{prev}]format=yuv420p[vout]")
print(f"{preset}: {len(SEGS)}カット / total {length:.2f}s -> {out}")

cmd = [FF,"-y",*ins,"-f","lavfi","-i","anullsrc=r=44100:cl=stereo",
       "-filter_complex",";".join(filt),
       "-map","[vout]","-map",f"{len(SEGS)}:a","-shortest",
       "-c:v","libx264","-profile:v","high","-level","4.0","-crf","18","-preset","slow",
       "-pix_fmt","yuv420p","-r",str(FPS),"-c:a","aac","-b:a","128k",
       "-movflags","+faststart",out]
r = subprocess.run(cmd, capture_output=True, text=True)
print("exit", r.returncode)
if r.returncode: print(r.stderr[-3000:])
