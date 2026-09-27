// ことさん v2（2026-09-27 改修・#3 から）。1080x1920 のフレームを書き出す。
// 版面の正は docs/sns/series/kotosan-reel.md §3-b。旧版（#1・#2）は render-kotosan.js のまま残す。
//
// 全カット共通：上に黒帯（その回の皮肉の題＋小さくシリーズ名）を出しっぱなし。
// 1カットに載せる文字は1つだけ。
//
//   say   : 口に出した言葉。白い吹き出し・縁あり・しっぽが話している側の頭を指す（48px）
//   think : 飲み込んだ本音。薄いローズの吹き出し・しっぽが小さな丸3つ（44px）
//   gokun : （ごくん）だけ。吹き出しなし・96px（シリーズの目印。空で出させない）
//   none  : 帯だけ（真顔を見せる間）
//
//   node render-kotosan-v2.js <plate.png> <out.png> '["題","シリーズ名"]' <say|think|gokun|none> <x> '["行1","行2"]'
//     x = しっぽの先を置く横位置（話している側の頭の上。ことさん≈400／相手役≈760）
const {chromium} = require('playwright');
const fs = require('fs');

const [,,plate, out, bandJson, kind, xArg, lineJson = '[]'] = process.argv;
if (!plate || !out || !bandJson || !kind) {
  console.error("usage: node render-kotosan-v2.js <plate> <out.png> '[題,シリーズ名]' <say|think|gokun|none> <x> '[行]'");
  process.exit(2);
}
const [title, series] = JSON.parse(bandJson);
const lines = JSON.parse(lineJson);
const tailX = Number(xArg) || 540;

const L = {
  say:   {size:48, max:12},
  think: {size:44, max:12},
  gokun: {size:96, max:6 },
  none:  {size:0,  max:0 },
}[kind];
if (!L) { console.error('unknown kind:', kind); process.exit(2); }

// 字数で落とす（黙って画面からはみ出させない）
const bad = [];
if ([...title].length > 13) bad.push(`題 ${[...title].length}字（13字まで） ${title}`);
lines.forEach(t => { if ([...t].length > L.max) bad.push(`${kind} ${[...t].length}字（${L.max}字まで） ${t}`); });
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
if (kind === 'gokun' && !lines.join('').trim()) {
  console.error('gokun が空。「（ごくん）」を省かない（kotosan-reel.md §6）'); process.exit(1);
}
if (kind === 'none' && lines.length) { console.error('none に文字は載せない'); process.exit(1); }

const INK = '#2E2620';
const THINK = '#F6E6DF';   // #D4A090 を白で薄めた色。透けさせると絵に負けるので不透明にする

const bubble = kind === 'say' ? `
.bub{background:#fff;border:5px solid ${INK};border-radius:60px;padding:26px 44px;
  font-family:N7;font-size:${L.size}px;line-height:1.45;color:${INK}}`
: kind === 'think' ? `
.bub{background:${THINK};border:4px solid ${INK};border-radius:80px;padding:26px 48px;
  font-family:N7;font-size:${L.size}px;line-height:1.45;color:${INK};letter-spacing:.04em}`
: `
.bub{background:none;padding:0;font-family:N9;font-size:${L.size}px;line-height:1.2;color:${INK};
  -webkit-text-stroke:0;text-shadow:0 0 18px #F5EEE6,0 0 8px #F5EEE6}`;

const tail = kind === 'say' ? `
<svg class="tail" id="t" width="70" height="70" viewBox="0 0 70 70" style="overflow:visible">
  <path d="M8 0 L35 58 L62 0" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="11" y="-6" width="48" height="9" fill="#fff"/>
</svg>`
: kind === 'think' ? `
<svg class="tail" id="t" width="70" height="90" viewBox="0 0 70 90" style="overflow:visible">
  <circle cx="35" cy="18" r="13" fill="${THINK}" stroke="${INK}" stroke-width="4"/>
  <circle cx="35" cy="50" r="9"  fill="${THINK}" stroke="${INK}" stroke-width="4"/>
  <circle cx="35" cy="75" r="5"  fill="${THINK}" stroke="${INK}" stroke-width="3.5"/>
</svg>` : '';

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:N9;src:url("./noto900.woff2") format("woff2");font-display:block}
@font-face{font-family:N7;src:url("./noto700.woff2") format("woff2");font-display:block}
html,body{margin:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#F5EEE6}
img{position:absolute;inset:0;width:1080px;height:1920px;display:block}
.band{position:absolute;left:50%;top:170px;transform:translateX(-50%);
  background:#141110;color:#fff;text-align:center;white-space:nowrap;padding:22px 48px 20px}
.band .t{font-family:N9;font-size:64px;line-height:1.25;letter-spacing:.02em}
.band .s{font-family:N7;font-size:30px;line-height:1.5;color:#E8B8A8;letter-spacing:.12em;margin-top:6px}
.bub{position:absolute;top:0;text-align:center;white-space:nowrap;box-sizing:border-box}
${bubble}
.tail{position:absolute}
</style>
${plate === 'none' ? '' : `<img src="./${plate}">`}
<div class="band"><div class="t">${title}</div>${series ? `<div class="s">${series}</div>` : ''}</div>
${kind === 'none' ? '' : `<div class="bub" id="b">${lines.map(l => `<div>${l}</div>`).join('')}</div>${tail}`}`;

const tmp = `_kotosan2_${Date.now()}.html`;
fs.writeFileSync(tmp, html);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://' + process.cwd() + '/' + tmp);
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(({tailX, kind}) => {
    const band = document.querySelector('.band').getBoundingClientRect();
    const bub = document.getElementById('b');
    if (!bub) return {bandBottom: Math.round(band.bottom), bandW: Math.round(band.width)};
    const w = bub.offsetWidth, h = bub.offsetHeight;
    const tailH = kind === 'think' ? 90 : kind === 'say' ? 55 : 0;
    // しっぽの先が頭の少し上（y≈780）に来るように。帯とは 50px 空ける
    const top = Math.max(band.bottom + 50, 780 - tailH - h);
    const left = kind === 'gokun' ? (1080 - w) / 2 : Math.min(Math.max(tailX - w / 2, 40), 1040 - w);
    bub.style.top = top + 'px'; bub.style.left = left + 'px';
    const t = document.getElementById('t');
    if (t) { t.style.left = (tailX - 35) + 'px'; t.style.top = (top + h - (kind === 'say' ? 5 : -6)) + 'px'; }
    return {bandBottom: Math.round(band.bottom), bandW: Math.round(band.width),
            top: Math.round(top), bottom: Math.round(top + h + tailH), left: Math.round(left), right: Math.round(left + w)};
  }, {tailX, kind});
  if (r.bandW > 1040) { console.error(`帯の幅 ${r.bandW}px が画面からはみ出す。題を短くする`); await b.close(); fs.unlinkSync(tmp); process.exit(1); }
  if (r.bottom > 1500) { console.error(`文字の下端が y=${r.bottom}。1500 を超えている（IG の UI に隠れる）`); await b.close(); fs.unlinkSync(tmp); process.exit(1); }
  await p.waitForTimeout(200);
  await p.screenshot({path: out});
  await b.close(); fs.unlinkSync(tmp);
  console.log(`-> ${out}  [${kind}] band..${r.bandBottom} w=${r.bandW}` + (r.top !== undefined ? `  text ${r.top}..${r.bottom} x ${r.left}..${r.right}` : ''));
})();
