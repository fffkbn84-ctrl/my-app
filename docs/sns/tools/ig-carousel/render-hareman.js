// 「晴れ間のひとこと」カード（X 用・4:5・1080x1350）。正は docs/sns/series/hareman-no-hitokoto.md
//   NODE_PATH=$(npm root -g) node render-hareman.js <雲の2体の画像> <出力.png> '<json>'
//   json = {"no":"01","scene":["行1","行2"],"sky":"くもり","why":["行1","行2"],"line":["行1","行2"],"note":"出典など（任意）"}
//   画像は設定画と同じ地色（#F5EEE6）の 2:3。下 58% を切り出して右下に置く。
//   文字は全部ここで入れる（画像に文字を描かせない）。字があふれたら止まる。
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const [,,img,out,json]=process.argv; const d=JSON.parse(json); const W=1080,H=1350;
const src='./_plate'+path.extname(img); fs.copyFileSync(img,src);
const br=a=>a.join('<br>');
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"S";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"S";src:url("./shippori700.woff2") format("woff2");font-weight:700;font-display:block}
html,body{margin:0}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:#F5EEE6;font-family:"S",serif;color:#2E2620}
.card{position:absolute;inset:44px;border-radius:28px;background:#FBF7F2;box-shadow:0 2px 14px rgba(46,38,32,.08)}
.head{position:absolute;left:84px;right:84px;top:84px;display:flex;justify-content:space-between;align-items:baseline;
  font-size:30px;letter-spacing:.14em;color:#8A6A5E;border-bottom:1.5px solid #D9C7B8;padding-bottom:18px}
.head b{font-weight:400;color:#B07A68}
.scene{position:absolute;left:84px;right:84px;top:178px;font-weight:700;font-size:50px;line-height:1.5;letter-spacing:.02em;white-space:nowrap}
.k{display:inline-block;font-size:26px;letter-spacing:.16em;color:#8A6A5E;border:1.5px solid #D9C7B8;border-radius:999px;padding:3px 18px 5px;margin-bottom:14px}
.sky{position:absolute;left:84px;right:84px;top:var(--skyTop)}
.sky p{margin:0;font-size:32px;line-height:1.8;white-space:nowrap}
.sky .w{font-weight:700;color:#7C8A99;margin-right:.5em}
.line{position:absolute;left:84px;width:560px;bottom:150px}
.line .k{border-color:#D4A090;color:#B07A68;background:#F7E7DF}
.line p{margin:0;font-weight:700;font-size:46px;line-height:1.6;color:#2E2620;white-space:nowrap}
.duo{position:absolute;right:52px;bottom:60px;width:360px;height:312px;overflow:hidden;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 55%,#000 62%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 55%,#000 62%,transparent 100%)}
.duo img{position:absolute;left:0;top:-${Math.round(360/1024*1536*0.42)}px;width:360px;display:block}
.foot{position:absolute;left:84px;bottom:88px;font-size:24px;letter-spacing:.12em;color:#A08A7E}
</style>
<div class="card"></div>
<div class="head"><span>晴れ間のひとこと</span><b>No.${d.no}</b></div>
<div class="scene" id="scene">${br(d.scene)}</div>
<div class="sky" id="sky"><span class="k">空模様</span><p><span class="w">${d.sky}</span>${br(d.why)}</p></div>
<div class="line" id="line"><span class="k">晴れ間のひとこと</span><p>${br(d.line)}</p></div>
<div class="duo"><img src="${src}"></div>
<div class="foot">${d.note?d.note+'　':''}Kinda</div>`;
fs.writeFileSync('_hareman.html',html);
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:W,height:H}});
await p.goto('file://'+process.cwd()+'/_hareman.html'); await p.evaluate(()=>document.fonts.ready);
const bad=await p.evaluate(()=>{const s=document.getElementById('scene').getBoundingClientRect();
  const sky=document.getElementById('sky'); sky.style.setProperty('--skyTop',(s.bottom+40)+'px');
  const k=sky.getBoundingClientRect(), l=document.getElementById('line').getBoundingClientRect(),
  du=document.querySelector('.duo').getBoundingClientRect(); const o=[];
  for(const e of document.querySelectorAll('.scene,.sky p,.line p')){const r=e.getBoundingClientRect(); if(r.right>996||e.scrollWidth>e.clientWidth+1) o.push('はみ出し: '+e.textContent.slice(0,12));}
  if(k.bottom>l.top-30) o.push('空模様と晴れ間が重なる');
  if(k.bottom>du.top-10 && k.right>du.left) o.push('空模様が雲の絵にかかる');
  if(l.right>du.left+20) o.push('晴れ間が雲の絵にかかる'); return o;});
await p.waitForTimeout(200);
if(bad.length){await b.close(); throw new Error(bad.join(' / '));}
await p.screenshot({path:out}); await b.close(); fs.unlinkSync(src); fs.unlinkSync('_hareman.html'); console.log('->',out);})();
