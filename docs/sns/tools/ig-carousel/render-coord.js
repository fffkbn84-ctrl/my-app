// 「会う日の服」型（docs/sns/series/au-hi-no-fuku.md）。1080x1920 の1枚を書き出す。
//   生成画像（2:3・服6着の一覧）を幅に合わせて置き、上に色の名前と題、服ごとに心の声のラベルを置く。
//   node render-coord.js <画像> <出力.png> '<json>'
//   json = {"title":"2回目なのに、もうだいぶ好きな日",
//           "colors":[{"name":"Burgundy","hex":"#7A2430"},{"name":"Cream","hex":"#EDE0CB"}],
//           "bg":"#EFE7DB","width":900,"top":430,
//           "labels":[{"t":"脚、ちょっと見せたい","x":240,"y":455}, …]}
//   色の名前は、その色そのもので書く。地色に溶ける淡い色は、相手の色の札の上に抜く。
//   ラベルの y は 360〜1480（上は IG のヘッダー、下はキャプションに隠れる）。12字まで。
//   フォントは実行ディレクトリに置く：notoserif200.woff2 / notoserif300.woff2 / cormorant-it300.woff2 / cormorant-it500.woff2
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const [,,img,out,json]=process.argv;
const d=JSON.parse(json);
if(!d.title||!Array.isArray(d.labels)||!Array.isArray(d.colors)||d.colors.length!==2) throw new Error('title・labels・colors(2色) が要る');
for(const l of d.labels){
  if([...l.t].length>12) throw new Error('ラベルは12字まで: '+l.t);
  if(l.y<360||l.y>1480) throw new Error(`y=${l.y} は隠れる（360〜1480）: ${l.t}`);
}
// 淡い色（地色と近い色）かどうか。淡い色は相手の色の札に抜く
const lum=h=>{const n=parseInt(h.slice(1),16);return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255;};
const [c1,c2]=d.colors;
const word=(c,other)=>lum(c.hex)>0.75
  ? `<span class="w pill" style="color:${c.hex};background:${other.hex}">${c.name}</span>`
  : `<span class="w" style="color:${c.hex}">${c.name}</span>`;
const nums='①②③④⑤⑥⑦⑧⑨';
const src='./_plate'+path.extname(img); fs.copyFileSync(img,src);
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"NSJ";src:url("./notoserif200.woff2") format("woff2");font-weight:200;font-display:block}
@font-face{font-family:"NSJ";src:url("./notoserif300.woff2") format("woff2");font-weight:300;font-display:block}
@font-face{font-family:"Corm";src:url("./cormorant-it300.woff2") format("woff2");font-weight:300;font-style:italic;font-display:block}
@font-face{font-family:"Corm";src:url("./cormorant-it500.woff2") format("woff2");font-weight:500;font-style:italic;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:${d.bg||'#EFE7DB'};font-family:"NSJ",serif;color:#2E2620}
img{position:absolute;left:${(1080-(d.width||900))/2}px;top:${d.top||430}px;width:${d.width||900}px;height:auto;display:block}
.head{position:absolute;left:0;right:0;top:${d.headTop||175}px;text-align:center}
.kick{font-family:"Corm";font-style:italic;font-weight:300;font-size:30px;letter-spacing:.18em;color:#9A8676}
.colors{margin-top:2px;font-family:"Corm";font-style:italic;font-weight:500;font-size:84px;line-height:1.1;letter-spacing:.01em}
.w.pill{display:inline-block;padding:0 26px 6px;border-radius:999px;font-size:.86em;vertical-align:.06em}
.amp{font-weight:300;font-size:.62em;color:#B08D57;margin:0 .22em;vertical-align:.1em}
.rule{width:56px;height:1px;background:#B9A796;margin:22px auto 18px}
h1{margin:0;font-weight:300;font-size:40px;letter-spacing:.14em}
.l{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;font-weight:300;font-size:${d.size||23}px;letter-spacing:.06em;
   padding:4px 14px 5px;border-radius:999px;background:rgba(250,246,240,.9);box-shadow:0 1px 5px rgba(46,38,32,.12)}
.l b{font-weight:300;color:${c1.hex};margin-right:.35em}
</style><img src="${src}">
<div class="head"><div class="kick">today's color</div>
<div class="colors">${word(c1,c2)}<span class="amp">&amp;</span>${word(c2,c1)}</div>
<div class="rule"></div><h1>${d.title}</h1></div>
${d.labels.map((l,i)=>`<div class="l" style="left:${l.x}px;top:${l.y}px"><b>${nums[i]}</b>${l.t}</div>`).join('')}`;
fs.writeFileSync('_coord.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_coord.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
const hit=await p.evaluate(()=>{const r=[...document.querySelectorAll('.l')].map(e=>[e.textContent,e.getBoundingClientRect()]);
  const o=[];for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++){const a=r[i][1],c=r[j][1];
  if(a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom)o.push(r[i][0]+' × '+r[j][0]);}return o;});
if(hit.length){await b.close(); throw new Error('ラベルが重なっている: '+hit.join(' / '));}
await p.screenshot({path:out}); await b.close(); fs.unlinkSync(src); console.log('->',out);})();
