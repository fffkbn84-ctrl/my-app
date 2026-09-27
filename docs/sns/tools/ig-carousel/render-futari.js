// 「ふたり」用。1080x1920 のフレームを書き出す。
// 版面：上に黒帯（白・太ゴシック・全カット同じ）＋話している側の吹き出し（しっぽ付き）。
// 正は docs/sns/packs/2026-09-27-ig-reel-futari-01.md。
//
//   node render-futari.js <plate.png> <out.png> '["帯1","帯2","帯3"]' <A|B> '["セリフ1","セリフ2"]'
//     A = 左のキャラ（しっぽが左寄り）／ B = 右のキャラ
const {chromium} = require('playwright');
const fs = require('fs');

const [,,plate, out, bandJson, who, lineJson] = process.argv;
if (!plate || !out || !bandJson || !who || !lineJson) {
  console.error("usage: node render-futari.js <plate> <out.png> '[帯]' <A|B> '[セリフ]'");
  process.exit(2);
}
const band = JSON.parse(bandJson), lines = JSON.parse(lineJson);
const MAXB = 13, MAXL = 14;
const bad = [...band.filter(t => [...t].length > MAXB).map(t => `帯 ${t}`),
             ...lines.filter(t => [...t].length > MAXL).map(t => `セリフ ${t}`)];
if (bad.length) { console.error('字数オーバー（帯13・セリフ14）:\n  ' + bad.join('\n  ')); process.exit(1); }

const INK = '#2E2620';
const tailX = who === 'A' ? 300 : 740;   // 話している側の頭の上

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:N9;src:url("./noto900.woff2") format("woff2");font-display:block}
@font-face{font-family:N7;src:url("./noto700.woff2") format("woff2");font-display:block}
html,body{margin:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden}
img{position:absolute;inset:0;width:1080px;height:1920px;display:block}
.band{position:absolute;left:50%;top:170px;transform:translateX(-50%);
  background:#141110;color:#fff;font-family:N9;font-size:64px;line-height:1.28;
  padding:22px 44px;text-align:center;white-space:nowrap;letter-spacing:.02em}
.band .vs{font-size:52px;line-height:1.15;color:#E8B8A8}
.bub{position:absolute;top:0;background:#fff;border:5px solid ${INK};border-radius:60px;
  padding:26px 44px;font-family:N7;font-size:48px;line-height:1.45;color:${INK};
  text-align:center;white-space:nowrap;box-sizing:border-box}
.tail{position:absolute}
</style>
<img src="./${plate}">
<div class="band">${band.map(t => t === 'vs' ? `<div class="vs">vs</div>` : `<div>${t}</div>`).join('')}</div>
<div class="bub" id="b">${lines.map(l => `<div>${l}</div>`).join('')}</div>
<svg class="tail" id="t" width="70" height="70" viewBox="0 0 70 70" style="overflow:visible">
  <path d="M8 0 L${who==='A'?22:48} 58 L62 0" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="11" y="-6" width="48" height="9" fill="#fff"/>
</svg>`;
const tmp = `_futari_${Date.now()}.html`;
fs.writeFileSync(tmp, html);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://' + process.cwd() + '/' + tmp);
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(({tailX}) => {
    const band = document.querySelector('.band').getBoundingClientRect();
    const bub = document.getElementById('b');
    const w = bub.offsetWidth, h = bub.offsetHeight;
    const top = Math.max(band.bottom + 50, 700 - h);   // しっぽの先が頭の少し上（y≈760）に来るように
    let left = Math.min(Math.max(tailX - w / 2, 40), 1040 - w);
    bub.style.top = top + 'px'; bub.style.left = left + 'px';
    const t = document.getElementById('t');
    t.style.left = (tailX - 35) + 'px'; t.style.top = (top + h - 5) + 'px';
    return {bandBottom: Math.round(band.bottom), bubTop: top, bubBottom: top + h + 55, w};
  }, {tailX});
  await p.waitForTimeout(200);
  await p.screenshot({path: out});
  await b.close(); fs.unlinkSync(tmp);
  console.log(`-> ${out}  band..${r.bandBottom}  bubble ${r.bubTop}..${r.bubBottom} w=${r.w}`);
})();
