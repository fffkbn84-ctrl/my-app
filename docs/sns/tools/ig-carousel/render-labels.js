// 「ぎっしり情景」型（docs/sns/series/gisshiri-jokei.md）。1080x1920 の1枚を書き出す。
//   生成画像を全面に敷き（はみ出しは左右を切る）、上に題の帯、人形ごとに短いラベルを置く。
//   node render-labels.js <画像> <出力.png> '<json>'
//   json = {"title":"待ち合わせ10分前の駅前","sub":"あなたは、どの人？",
//           "labels":[{"t":"30分前に着いた","x":300,"y":700}, …]}
//   "fit":"width","top":300 を足すと、全面に敷かず幅1080に合わせて y=top から置く（左右を切らない。上の空きは地色）。
//   画面の端まで人形がいる絵はこちら。2:3 なら 1080x1620 で y=300〜1920 に収まる
//   "size":24,"alpha":0.75 でラベルを小さく・薄くできる（既定 30px・0.92。絵を主役にしたい回に）
//   x,y は出力（1080x1920）上の座標で、ラベルの中心。人形の頭のすぐ上に置く。
//   y は 360〜1480 の範囲だけ（上は IG のヘッダー、下はキャプションとボタンに隠れる）
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const [,,img,out,json]=process.argv;
const d=JSON.parse(json);
if(!d.title||!Array.isArray(d.labels)) throw new Error('title と labels が要る');
for(const l of d.labels){
  if([...l.t].length>12) throw new Error('ラベルは12字まで: '+l.t);
  if(l.y<360||l.y>1480) throw new Error(`y=${l.y} は隠れる（360〜1480）: ${l.t}`);
  if(l.x<90||l.x>990) throw new Error(`x=${l.x} は端に寄りすぎ（90〜990）: ${l.t}`);
}
const src='./_plate'+path.extname(img); fs.copyFileSync(img,src);
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Shippori Mincho";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#F5EEE6;font-family:"Shippori Mincho",serif;color:#2E2620}
img{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;display:block}
img.w{inset:auto;left:0;top:${d.top||0}px;height:auto}
.band{position:absolute;left:0;right:0;top:170px;padding:26px 0 24px;text-align:center;background:rgba(245,238,230,.97);box-shadow:0 3px 10px rgba(46,38,32,.10)}
.band h1{margin:0;font-weight:400;font-size:54px;letter-spacing:.08em;line-height:1.3}
.band p{margin:8px 0 0;font-size:34px;letter-spacing:.1em;color:#8A6A5E}
.l{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;font-size:${d.size||30}px;letter-spacing:.04em;
   padding:${d.size?'3px 10px 4px':'4px 14px 5px'};border-radius:999px;background:rgba(255,252,248,${d.alpha||.92});box-shadow:0 2px 6px rgba(46,38,32,.18)}
</style><img src="${src}"${d.fit==='width'?' class="w"':''}><div class="band"><h1>${d.title}</h1>${d.sub?`<p>${d.sub}</p>`:''}</div>
${d.labels.map(l=>`<div class="l" style="left:${l.x}px;top:${l.y}px">${l.t}</div>`).join('')}`;
fs.writeFileSync('_labels.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_labels.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
// ラベル同士の重なりを検出して止める
const hit=await p.evaluate(()=>{const r=[...document.querySelectorAll('.l')].map(e=>[e.textContent,e.getBoundingClientRect()]);
  const o=[];for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++){const a=r[i][1],c=r[j][1];
  if(a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom)o.push(r[i][0]+' × '+r[j][0]);}return o;});
if(hit.length){await b.close(); throw new Error('ラベルが重なっている: '+hit.join(' / '));}
await p.screenshot({path:out}); await b.close(); fs.unlinkSync(src); console.log('->',out);})();
