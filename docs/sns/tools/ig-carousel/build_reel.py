# フレーム（f*.png）を MP4 に組む。H.264 / yuv420p / 30fps / 無音AAC入り。音楽は IG 側で足す。
#
#   python3 build_reel.py                      # 既定＝連載・つくる日記（従来どおり）
#   python3 build_reel.py pair      out.mp4
#   python3 build_reel.py pair-list out.mp4    # 連載・4カット目が保存版カード（5.0秒・ズームなし）。kinda-pair-28.md「実験」
#   python3 build_reel.py kotosan4  out.mp4    # ことさん・軽い回（4カット）
#   python3 build_reel.py kotosan5  out.mp4    # ことさん・救いのある回（5カット）
#   python3 build_reel.py one7      out.mp4    # 木曜の1枚リール（1枚・7秒・ズームなし）
#   python3 build_reel.py one10     out.mp4    # 「ぎっしり情景」（1枚・10秒・ズームなし）。ラベルを読み切る時間
#   python3 build_reel.py iinikui3  out.mp4    # 土曜「言いにくい気持ち」（3カット・13.0秒）
#   python3 build_reel.py futari4   out.mp4    # 「ふたり」（4カット・約10秒・ズームなし・ほぼカット切り）
#   python3 build_reel.py futari-go6 out.mp4   # 「ふたり」ゲームオーバー回（6カット・12.5秒）
#   python3 build_reel.py kotosanv2 out.mp4    # ことさん v2（#3 から・黒帯・4カット・9.1秒・ほぼカット切り）
#   python3 build_reel.py narabe4   out.mp4    # 並べる型・肯定の型（4カット・各2.3秒・ズームなし・カット切り）
#   python3 build_reel.py mama4     out.mp4    # 甘やかしキャラ（ナマケモノ・4カット・約11.6秒・ゆっくり溶ける）
#   python3 build_reel.py noteday4  out.mp4    # 「今日の天気、つけてみた」（本物の画面・4カット・約12秒）
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

  # 連載の実験回（kinda-pair-28.md「実験：後半に保存版の1カットを置く」）。
  # 4カット目は止めて読ませる文字のカードなので、5.0 秒・ズームなし（寄ると行が画面端に近づく）
  "pair-list": (
    [("f1.png",3.5,1.00,1.00,0.0),
     ("f2.png",4.0,1.00,1.04,0.0),
     ("f3.png",4.5,1.00,1.04,0.0),
     ("f4.png",5.0,1.00,1.00,0.0),
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

  # 土曜「言いにくい気持ち」（iinikui-kimochi.md §3-b）。0〜4.5／4.5〜9.5／9.5〜13.0
  "iinikui3": (
    [("f1.png",4.9,1.00,1.00,0.0),   # 1カット目はズームなし
     ("f2.png",5.4,1.00,1.04,0.0),
     ("f3.png",3.5,1.00,1.04,0.0)],
    [0.4,0.4]),

  # 「ふたり」（packs/2026-09-27-ig-reel-futari-01.md）。黒帯を動かさないためズームなし。
  # 表情の切り替えで笑わせるので、つなぎは 0.1 秒のほぼカット切り
  "futari4": (
    [("f1.png",2.6,1.00,1.00,0.0),
     ("f2.png",2.9,1.00,1.00,0.0),
     ("f3.png",2.4,1.00,1.00,0.0),   # 真顔
     ("f4.png",2.8,1.00,1.00,0.0)],  # ……はい。
    [0.1,0.1,0.1]),

  # 「ふたり」ゲームオーバー回（packs/ig-reel-futari-gameover.md）
  "futari-go6": (
    [("f1.png",2.5,1.00,1.00,0.0),   # 機嫌が悪い・▶そっとしておく
     ("f2.png",2.0,1.00,1.00,0.0),   # 3時間が たった
     ("f3.png",2.5,1.00,1.00,0.0),   # GAME OVER
     ("f4.png",1.8,1.00,1.00,0.0),   # もういちど・▶きいてみる
     ("f5.png",2.0,1.00,1.00,0.0),   # 「どうした？」
     ("f6.png",2.2,1.00,1.00,0.0)],  # すこし なおった！
    [0.1,0.1,0.1,0.1,0.1]),

  # ことさん v2（kotosan-reel.md §2-b・#3 から）。黒帯を動かさないためズームなし。
  # 本音を言いかける → その場で飲み込む → 建前、の順。つなぎは 0.1 秒のほぼカット切り
  "kotosanv2": (
    [("f1.png",2.6,1.00,1.00,0.0),   # 相手役の言葉
     ("f2.png",2.0,1.00,1.00,0.0),   # 真顔で本音を言いかける（途中で切れる）
     ("f3.png",1.8,1.00,1.00,0.0),   # （ごくん）＝言いかけた言葉を飲み込む
     ("f4.png",3.0,1.00,1.00,0.0)],  # 眼鏡が光る・建前（オチ）
    [0.1,0.1,0.1]),

  # 並べる型・肯定の型（docs/sns/ideas.md 案3・案4）。1カット＝1項目。
  # 帯と下の一言の位置を動かさないためズームなし。項目が切り替わる気持ちよさを出すため 0.1 秒のカット切り
  "narabe4": (
    [("f1.png",2.4,1.00,1.00,0.0),
     ("f2.png",2.3,1.00,1.00,0.0),
     ("f3.png",2.3,1.00,1.00,0.0),
     ("f4.png",2.6,1.00,1.00,0.0)],  # 最後だけ少し長く（ループ前に一呼吸）
    [0.1,0.1,0.1]),

  # 甘やかしキャラ（packs/2026-10-04-ig-reel-namakemono-mama-01.md）。ゆっくりでいい、を間で見せる。
  # 帯を動かさないためズームなし。つなぎは 0.5 秒のクロスディゾルブ（カット切りより温かく見える）
  "mama4": (
    [("f1.png",3.2,1.00,1.00,0.0),   # 暗い顔してるね
     ("f2.png",3.2,1.00,1.00,0.0),   # 豚汁
     ("f3.png",2.6,1.00,1.00,0.0),   # お風呂
     ("f4.png",4.1,1.00,1.00,0.0)],  # ママに話してごらん（ループ前に長めに）
    [0.5,0.5,0.5]),

  # 「今日の天気、つけてみた」（packs/2026-10-note-today.md §2）。素材は本物の画面のスクリーンショット。
  # 画面の文字を読ませたいので寄りは控えめ（1.03 まで）
  "noteday4": (
    [("f1.png",3.5,1.00,1.00,0.0),   # 1秒目：状況の言葉＋質問の画面
     ("f2.png",3.0,1.00,1.03,0.0),   # 選んだところ
     ("f3.png",3.6,1.00,1.03,0.0),   # 結果のカード
     ("f4.png",3.0,1.03,1.05,0.0)],  # 登録なしで
    [0.4,0.4,0.4]),

  # 「ぎっしり情景」（series/gisshiri-jokei.md）。ラベルが10前後あるので one7 より長く。
  # ズームするとラベルが端で切れるので、ズームなし
  "one10": (
    [("f1.png",10.0,1.00,1.00,0.0)],
    []),

  # 木曜の1枚リール（夜の窓など）。1枚・7秒・ズームなし。ループで見返させる
  "one7": (
    [("f1.png",7.0,1.00,1.00,0.0)],
    []),
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
