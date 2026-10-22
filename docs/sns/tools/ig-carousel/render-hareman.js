// 「晴れ間のひとこと」カード（X 用・4:5・1080x1350）。正は docs/sns/series/hareman-no-hitokoto.md
//   NODE_PATH=$(npm root -g) node render-hareman.js <雲の2体の画像> <出力.png> '<json>'
//   json = {"no":"01","place":"初対面のカフェで","title":["コーヒーには","[水]をそえる。"],"sky":"くもり","why":["行1","行2"],"note":"出典（任意）"}
//   title の [ ] で囲んだ語にローズの帯を引く。文字は全部ここで入れる（画像に文字を描かせない）。はみ出したら止まる。
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const [,,img,out,json]=process.argv; const d=JSON.parse(json); const W=1080,H=1350;
const src='./_plate'+path.extname(img); fs.copyFileSync(img,src);
const mark=t=>t.replace(/\[(.+?)\]/g,'<em>$1</em>');
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"S";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"S";src:url("./shippori800.woff2") format("woff2");font-weight:800;font-display:block}
html,body{margin:0}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:#F5EEE6;font-family:"S",serif;color:#2E2620}
.tag{position:absolute;left:80px;top:78px;display:flex;align-items:center;gap:18px;font-size:28px;letter-spacing:.14em;color:#B07A68}
.sun{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#F2C9A8,#D4A090);box-shadow:0 0 0 6px rgba(212,160,144,.18)}
.no{position:absolute;right:80px;top:80px;font-size:28px;letter-spacing:.1em;color:#B9A396}
.place{position:absolute;left:80px;top:196px;font-size:40px;letter-spacing:.08em;color:#6E5A50}
.title{position:absolute;left:72px;top:262px;font-weight:800;font-size:${d.size||104}px;line-height:1.32;letter-spacing:.01em;white-space:nowrap}
.title em{font-style:normal;background:linear-gradient(transparent 58%,rgba(212,160,144,.55) 58%,rgba(212,160,144,.55) 92%,transparent 92%)}
.sky{position:absolute;left:80px;width:560px;top:var(--skyTop)}
.sky .w{display:inline-block;font-size:26px;letter-spacing:.16em;color:#7C8A99;border:1.5px solid #B9C3CC;border-radius:999px;padding:2px 16px 4px;margin-bottom:14px}
.sky p{margin:0;font-size:32px;line-height:1.75;white-space:nowrap}
.duo{position:absolute;right:30px;bottom:40px;width:420px;height:364px;overflow:hidden;
  -webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 55%,#000 62%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 55%,#000 62%,transparent 100%)}
.duo img{position:absolute;left:0;top:-${Math.round(420/1024*1536*0.42)}px;width:420px;display:block}
.title small{font-size:.42em;font-weight:400;color:#B07A68;letter-spacing:.04em;margin-left:.3em;vertical-align:.5em}
.line{position:absolute;left:80px;width:560px;bottom:170px}
.line .k{display:inline-block;font-size:26px;letter-spacing:.16em;color:#B07A68;background:#F7E7DF;border:1.5px solid #D4A090;border-radius:999px;padding:2px 16px 4px;margin-bottom:14px}
.line p{margin:0;font-weight:800;font-size:40px;line-height:1.55;white-space:nowrap}
.foot{position:absolute;left:80px;bottom:76px;font-size:22px;letter-spacing:.08em;color:#A08A7E;line-height:1.6}
</style>
<div class="tag"><span class="sun"></span>晴れ間のひとこと</div><div class="no">No.${d.no}</div>
<div class="place">${d.place}</div>
<div class="title" id="title">${d.title.map(mark).join('<br>')}${d.kind?'<small>【'+d.kind+'】</small>':''}</div>
<div class="sky" id="sky"><span class="w">空模様　${d.sky}</span><p>${d.why.join('<br>')}</p></div>
${d.line?`<div class="line" id="line"><span class="k">晴れ間のひとこと</span><p>${d.line.join('<br>')}</p></div>`:''}
<div class="duo"><img src="${src}"></div>
<div class="foot">${d.note?d.note+'<br>':''}Kinda</div>`;
fs.writeFileSync('_hareman.html',html);
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:W,height:H}});
await p.goto('file://'+process.cwd()+'/_hareman.html'); await p.evaluate(()=>document.fonts.ready);
const bad=await p.evaluate(()=>{const t=document.getElementById('title').getBoundingClientRect();
  const sky=document.getElementById('sky'); sky.style.setProperty('--skyTop',(t.bottom+44)+'px');
  const o=[]; if(t.right>1010) o.push('題がはみ出す');
  const k=sky.getBoundingClientRect(), du=document.querySelector('.duo').getBoundingClientRect(), f=document.querySelector('.foot').getBoundingClientRect();
  for(const e of sky.querySelectorAll('p')) if(e.getBoundingClientRect().right>du.left+40 && k.bottom>du.top+60) o.push('理由が雲にかかる');
  const ln=document.getElementById('line'); const lim=ln?ln.getBoundingClientRect().top:f.top;
  if(k.bottom>lim-24) o.push('理由が下にかかる');
  if(ln&&ln.getBoundingClientRect().right>du.left+30) o.push('晴れ間が雲にかかる'); return o;});
await p.waitForTimeout(200);
if(bad.length){await b.close(); throw new Error(bad.join(' / '));}
await p.screenshot({path:out}); await b.close(); fs.unlinkSync(src); fs.unlinkSync('_hareman.html'); console.log('->',out);})();
