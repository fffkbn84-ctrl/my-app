import sys, json, numpy as np
from PIL import Image, ImageFilter

TARGET = np.array([0xF5,0xEE,0xE6], dtype=np.float64)
MOTIF_SIZE = 340     # geometric mean of the motif bbox -- same visual weight everywhere
MOTIF_CY   = 500     # motif optical centre
CANVAS     = (1080, 1350)
MAX_W, MAX_H = 640, 380

def prep(src, out, motif_size=MOTIF_SIZE, motif_cy=MOTIF_CY, canvas=CANVAS):
    W, H = canvas
    im = Image.open(src).convert('RGB')
    a = np.asarray(im).astype(np.float64)
    h, w, _ = a.shape

    # 1) white-balance the plate so the field is exactly #F5EEE6
    b = max(8, h//50)
    border = np.concatenate([a[:b].reshape(-1,3), a[-b:].reshape(-1,3),
                             a[:,:b].reshape(-1,3), a[:,-b:].reshape(-1,3)])
    a = np.clip(a * (TARGET/np.median(border, axis=0)), 0, 255)

    # 2) flatten the field (kills the vignette / noise, keeps object + its shadow)
    diff = np.abs(a - TARGET).max(axis=2)
    alpha = np.clip((diff - 2.0)/8.0, 0, 1)[..., None]
    a = TARGET*(1-alpha) + a*alpha

    # 3) object bbox from EDGES -- the soft cast shadow has no edges, so it is ignored
    g = Image.fromarray(a.astype('uint8')).convert('L').filter(ImageFilter.GaussianBlur(1.2))
    e = np.asarray(g.filter(ImageFilter.FIND_EDGES)).astype(np.float64)
    e[:6]=0; e[-6:]=0; e[:,:6]=0; e[:,-6:]=0
    m = e > 12
    cols = np.where(m.sum(axis=0) >= 6)[0]
    rows = np.where(m.sum(axis=1) >= 6)[0]
    x0,x1,y0,y1 = cols.min(), cols.max(), rows.min(), rows.max()
    ow, oh = x1-x0, y1-y0
    ocx, ocy = (x0+x1)/2, (y0+y1)/2

    # 4) same visual weight for every motif, whatever its proportions
    s = motif_size / (ow*oh) ** 0.5
    s = min(s, MAX_W/ow, MAX_H/oh)

    im2 = Image.fromarray(a.astype('uint8')).resize((round(w*s), round(h*s)), Image.LANCZOS)
    out_im = Image.new('RGB', (W,H), tuple(TARGET.astype(int)))
    out_im.paste(im2, (round(W/2 - ocx*s), round(motif_cy - ocy*s)))
    out_im.save(out)
    print(json.dumps({'src_bbox':[int(x0),int(y0),int(x1),int(y1)],
                      'placed_w':round(ow*s), 'placed_h':round(oh*s),
                      'canvas':[W,H], 'out':out}))

if __name__ == '__main__':
    args = sys.argv[1:]
    src, out = args[0], args[1]
    size = int(args[2]) if len(args) > 2 else MOTIF_SIZE
    cy   = int(args[3]) if len(args) > 3 else MOTIF_CY
    cv   = (int(args[4]), int(args[5])) if len(args) > 5 else CANVAS
    prep(src, out, size, cy, cv)
