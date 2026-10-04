# 甘やかしキャラの台紙に「灯りの下」の温かみを足す（2026-10-04）。
#   python3 warm.py plate-1.png wplate-1.png   # 文字を載せる前の台紙にかける（吹き出しの白は動かさない）
# 温かみ：上から灯りが落ちているような淡い暖色の光だまり＋ごく弱い暖色寄せ（背景色は大きく動かさない）
import sys; from PIL import Image; import numpy as np
src,dst=sys.argv[1],sys.argv[2]
a=np.asarray(Image.open(src).convert('RGB')).astype(float)/255
H,W,_=a.shape; y,x=np.mgrid[0:H,0:W]
cx,cy=W*0.5,H*0.62; r=np.sqrt(((x-cx)/(W*0.62))**2+((y-cy)/(H*0.42))**2)
glow=np.clip(1-r,0,1)**2                      # 中心ほど 1
warm=np.array([1.0,0.80,0.55])                 # 灯りの色
a=a*(1-0.16*glow[...,None])+warm*0.16*glow[...,None]*1.0+a*0.0
a=a*np.array([1.025,1.0,0.955])                # 全体をほんの少し暖色へ
edge=np.clip(r-0.9,0,1)                        # 四隅をわずかに落とす
a=a*(1-0.06*edge[...,None])
Image.fromarray((np.clip(a,0,1)*255).astype('uint8')).save(dst)
