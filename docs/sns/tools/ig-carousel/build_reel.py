import subprocess, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
FPS = 30
# (frame, 尺, ズーム開始, ズーム終了)  1カット目は動かさない（文字を読ませる時間）
SEGS = [("f1.png",3.5,1.00,1.00),
        ("f2.png",4.0,1.00,1.04),
        ("f3.png",4.5,1.00,1.04),
        ("f4.png",4.5,1.00,1.04),
        ("f5.png",3.0,1.04,1.07)]
XF = 0.4

ins, filt = [], []
for i,(f,d,z0,z1) in enumerate(SEGS):
    ins += ["-loop","1","-framerate",str(FPS),"-t",f"{d}","-i",f]
    n = int(round(d*FPS))
    z = f"{z0}" if z0==z1 else f"{z0}+{z1-z0:.4f}*on/{n-1}"
    filt.append(
      f"[{i}:v]scale=2160:3840:flags=lanczos,"
      f"zoompan=z='{z}':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps={FPS},"
      f"setsar=1[v{i}]")

prev, off, length = "v0", 0.0, SEGS[0][1]
for i in range(1,len(SEGS)):
    off = length - XF
    filt.append(f"[{prev}][v{i}]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}]")
    length = length + SEGS[i][1] - XF
    prev = f"x{i}"
filt.append(f"[{prev}]format=yuv420p[vout]")
print(f"total {length:.2f}s")

cmd = [FF,"-y",*ins,"-f","lavfi","-i","anullsrc=r=44100:cl=stereo",
       "-filter_complex",";".join(filt),
       "-map","[vout]","-map",f"{len(SEGS)}:a","-shortest",
       "-c:v","libx264","-profile:v","high","-level","4.0","-crf","18","-preset","slow",
       "-pix_fmt","yuv420p","-r",str(FPS),"-c:a","aac","-b:a","128k",
       "-movflags","+faststart","kinda-ig-0919-reel.mp4"]
r = subprocess.run(cmd, capture_output=True, text=True)
print("exit", r.returncode)
if r.returncode: print(r.stderr[-3000:])
