// ことさん（水・金枠）用。1080x1920 のフレームを書き出す。
// 版面の正は docs/sns/series/kotosan-reel.md §3。ここを勝手に変えない。
//
//   scene : カット1。場面画像＋シリーズ名＋状況（白い吹き出し・44px）
//   omote : カット2。表の言葉（白い吹き出し・48px）
//   honne : カット3。飲み込んだ本音（薄茶の透ける吹き出し・44px）
//   gokun : カット4。（ごくん）だけ・88px・吹き出しなし
//   sukui : カット5。救い（白い吹き出し・44px）※重さのある回のみ
//
//   node render-kotosan.js <kind> <plate|none> <out.png> '["行1","行2"]' [シリーズ番号]
const {chromium} = require('playwright');
const fs = require('fs');

const [,,kind, plate, out, json, num] = process.argv;
if (!kind || !plate || !out || !json) {
  console.error("usage: node render-kotosan.js <scene|omote|honne|gokun|sukui> <plate|none> <out.png> '[\"行1\"]' [番号]");
  process.exit(2);
}
const lines = JSON.parse(json);

// 版面（kotosan-reel.md §3）。size は px、max は1行の字数上限
const L = {
  scene: {size:44, max:17, bubble:'white', top:380, label:true },
  omote: {size:48, max:16, bubble:'white', top:380, label:false},
  honne: {size:44, max:17, bubble:'tint',  top:380, label:false},
  gokun: {size:88, max:8,  bubble:'none',  top:null, label:false}, // 天地中央
  sukui: {size:44, max:17, bubble:'white', top:380, label:false},
}[kind];
if (!L) { console.error('unknown kind:', kind); process.exit(2); }

// 1行の字数上限を破ると吹き出しが画面から出る。黙って出さずに落とす
const over = lines.filter(t => [...t].length > L.max);
if (over.length) {
  console.error(`[${kind}] 1行 ${L.max} 字まで。超えている行:`);
  over.forEach(t => console.error(`  ${[...t].length}字  ${t}`));
  process.exit(1);
}
// gokun はシリーズの目印。空で書き出させない
if (kind === 'gokun' && !lines.join('').trim()) {
  console.error('gokun が空。「（ごくん）」を省かない（kotosan-reel.md §6）');
  process.exit(1);
}

const BG   = '#F5EEE6';
const INK  = '#2E2620';
const TINT = 'rgba(212,160,144,.20)';   // #D4A090 20%
const PAD_V = Math.round(L.size * 0.75);
const PAD_H = Math.round(L.size * 1.00);
const LH    = 1.65;
const LS    = '.06em';

const bubbleCss =
  L.bubble === 'white' ? `background:#fff;`
: L.bubble === 'tint'  ? `background:${TINT};`
: `background:none;`;

// 天地中央（gokun）か、上部 y=380 か
const posCss = L.top === null
  ? `top:0;bottom:0;display:flex;align-items:center;justify-content:center;`
  : `top:${L.top}px;display:flex;justify-content:center;`;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Shippori Mincho";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;background:${BG}}
img{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;display:block}
.wrap{position:absolute;left:0;right:0;${posCss}}
.b{${bubbleCss}border-radius:${L.bubble==='none'?0:36}px;
   padding:${L.bubble==='none'?0:`${PAD_V}px ${PAD_H}px`};
   max-width:${1080-160}px;box-sizing:border-box;
   font-family:"Shippori Mincho",serif;color:${INK};font-weight:400;
   font-size:${L.size}px;line-height:${LH};letter-spacing:${LS};margin-right:-${LS};
   text-align:center}
.b span{display:block;white-space:nowrap}
.label{position:absolute;left:0;right:0;top:268px;text-align:center;
   font-family:"Shippori Mincho",serif;color:${INK};opacity:.55;
   font-size:28px;letter-spacing:.14em;margin-right:-.14em}
</style>
${plate === 'none' ? '' : `<img src="./${plate}">`}
${L.label ? `<div class="label">ことさんは、飲み込んだ。${num ? '#'+num : ''}</div>` : ''}
<div class="wrap"><div class="b">${lines.map(l => `<span>${l || '&nbsp;'}</span>`).join('')}</div></div>`;

const tmp = `_kotosan_${kind}.html`;
fs.writeFileSync(tmp, html);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({viewport:{width:1080,height:1920}, deviceScaleFactor:1});
  await p.goto('file://' + process.cwd() + '/' + tmp);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);

  // 文字は y=1500 より下に置かない（IG の UI に隠れる）。出たら書き出さずに落とす
  const box = await p.evaluate(() => {
    const r = document.querySelector('.b').getBoundingClientRect();
    return {top:Math.round(r.top), bottom:Math.round(r.bottom),
            left:Math.round(r.left), right:Math.round(r.right)};
  });
  if (box.bottom > 1500) {
    console.error(`吹き出しの下端が y=${box.bottom}。1500 を超えている（kotosan-reel.md §3）。行数を減らす`);
    await b.close(); process.exit(1);
  }
  if (box.left < 40 || box.right > 1040) {
    console.error(`吹き出しが左右にはみ出している（left=${box.left} right=${box.right}）`);
    await b.close(); process.exit(1);
  }

  await p.screenshot({path: out});
  await b.close();
  console.log(`-> ${out}  [${kind}] ${L.size}px  y=${box.top}..${box.bottom}`);
})();
