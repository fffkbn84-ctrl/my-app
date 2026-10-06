// 入口リール（土曜枠）用。1080x1920 のフレームを書き出す。
//   hook : 58px（1秒目・topics.ts の ask）
//   body : 48px（2カット目以降）
//   list : 保存版カード（文字のみ・見出し44px＋番号つき5項目40px）。json は {"title":"…","items":[["1行目","2行目"],…]}
//          plate は none を渡す。止めて読ませる前提の詰めた版面（kinda-pair-28.md「実験」）
const {chromium}=require('playwright'); const fs=require('fs');
const [,,kind,plate,out,json]=process.argv;
const data=JSON.parse(json);
if(kind==='list') renderList(data); else renderLines(data);
function renderList(d){
if(plate!=='none') throw new Error('list は文字のみ。plate に none を渡す');
if(!d.title||!Array.isArray(d.items)||d.items.length<3||d.items.length>6) throw new Error('list は title と items（3〜6項目）が要る');
for(const it of d.items) for(const l of it) if([...l].length>18) throw new Error('1行18字まで: '+l);
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Shippori Mincho";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;background:#F5EEE6;font-family:"Shippori Mincho",serif;color:#2E2620;font-weight:400}
.w{position:absolute;left:150px;right:120px;top:400px}
h1{font-size:44px;font-weight:400;letter-spacing:.08em;margin:0 0 30px;padding-bottom:30px;border-bottom:1.5px solid #D4A090}
ol{list-style:none;margin:0;padding:0}
li{display:grid;grid-template-columns:62px 1fr;font-size:40px;line-height:1.75;letter-spacing:.06em;margin-top:34px}
li b{font-weight:400;color:#B07E6E}
li span{display:block}
</style><div class="w"><h1>${d.title}</h1><ol>${d.items.map((it,i)=>`<li><b>${i+1}</b><div>${it.map(l=>`<span>${l}</span>`).join('')}</div></li>`).join('')}</ol></div>`;
shoot(html, ()=>{const r=document.querySelector('.w').getBoundingClientRect(); return r.bottom;});
}
function renderLines(lines){
const L={ hook:{size:'58px', lh:'1.90', ls:'.07em'},
          body:{size:'48px', lh:'2.00', ls:'.08em'} }[kind];
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Shippori Mincho";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;background:#F5EEE6}
img{position:absolute;inset:0;width:1080px;height:1920px;display:block}
.t{position:absolute;left:0;right:0;top:1120px;text-align:center;
 font-family:"Shippori Mincho",serif;color:#2E2620;font-weight:400;
 font-size:${L.size};line-height:${L.lh};letter-spacing:${L.ls};margin-right:-${L.ls}}
.t span{display:block}
</style>${plate==='none'?'':`<img src="./${plate}">`}<div class="t">${lines.map(l=>`<span>${l}</span>`).join('')}</div>`;
shoot(html);
}
function shoot(html, measure){
fs.writeFileSync('_reel.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_reel.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
if(measure){const bottom=await p.evaluate(measure);
  // y=1500 より下は IG のキャプション・ボタンに隠れる
  if(bottom>1500){await b.close(); throw new Error(`文字の下端 y=${Math.round(bottom)} が 1500 を超えた。項目か行を減らす`);}}
await p.screenshot({path:out}); await b.close(); console.log('->',out);})();
}
