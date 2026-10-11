// 「会う日の服」型（docs/sns/series/au-hi-no-fuku.md）。1080x1920 の1枚を書き出す。
//   生成画像（2:3・2段×3列の服6着）を段ごとに切り分け、段の上に文字だけの帯を挟む（雑誌の版面）。
//   服の上に文字を重ねない。
//   node render-coord.js <画像> <出力.png> '<json>'
//   json = {"title":"2回目なのに、もうだいぶ好きな日",
//           "colors":[{"name":"Burgundy","hex":"#7A2430"},{"name":"Cream","hex":"#EFE3CF"}],
//           "rows":[[40,808],[816,1536]], // 生成画像の1段目・2段目の上端と下端の y（元画像の座標）。段の境目の余計な物を切る
//           "cols":[0.22,0.5,0.81], // 各列の服の中心（画像幅に対する割合）
//           "labels":["…","…","…","…","…","…"]}   // 左上から順に6つ。12字まで
//   任意："bg"（地色）・"width"（画像の幅・既定860）・"top"（1本目の帯の y・既定430）・"strip"（帯の高さ・既定84）・"size"（ラベル字の大きさ・既定22）
//   ラベルは番号を上・言葉を下の2行にして、列ごとに読めるようにする（1行に3つ並べると1つの文に見えた）
//   色の名前は、その色そのもので書く。地色に溶ける淡い色は、相手の色の札に抜く。
//   フォントは実行ディレクトリに置く：notoserif300.woff2 / cormorant-it300.woff2 / cormorant-it500.woff2
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const [,,img,out,json]=process.argv;
const d=JSON.parse(json);
if(!d.title||!Array.isArray(d.colors)||d.colors.length!==2) throw new Error('title・colors(2色) が要る');
if(!Array.isArray(d.labels)||d.labels.length!==6) throw new Error('labels は6つ');
for(const t of d.labels) if([...t].length>12) throw new Error('ラベルは12字まで: '+t);
const cols=d.cols||[0.22,0.5,0.81], W=d.width||860, top=d.top||430, strip=d.strip||84;
const {execSync}=require('child_process');
const [iw,ih]=execSync(`python3 -c "from PIL import Image;print(*Image.open('${img}').size)"`).toString().trim().split(' ').map(Number);
const k=W/iw, left=(1080-W)/2;
const [[a1,b1],[a2,b2]]=d.rows||[[0,Math.round(ih*0.53)],[Math.round(ih*0.53),ih]];
const r1h=Math.round((b1-a1)*k), r2h=Math.round((b2-a2)*k);
const y1=top+strip, y2=y1+r1h+strip;
if(y2-strip/2>1480) throw new Error('2本目の帯がキャプションに隠れる。width か top を小さく');
const lum=h=>{const n=parseInt(h.slice(1),16);return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255;};
const [c1,c2]=d.colors;
const word=(c,o)=>lum(c.hex)>0.75
  ? `<span class="w pill" style="color:${c.hex};background:${o.hex}">${c.name}</span>`
  : `<span class="w" style="color:${c.hex}">${c.name}</span>`;
const nums='①②③④⑤⑥';
const row=(y,h,sy)=>`<div class="row" style="top:${y}px;height:${h}px"><img src="./_plate${path.extname(img)}" style="top:${-Math.round(sy*k)}px"></div>`;
const labs=(y,o)=>cols.map((c,i)=>`<div class="l" style="left:${Math.round(left+c*W)}px;top:${y}px"><b>${nums[o+i]}</b>${d.labels[o+i]}</div>`).join('');
fs.copyFileSync(img,'./_plate'+path.extname(img));
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"NSJ";src:url("./notoserif300.woff2") format("woff2");font-weight:300;font-display:block}
@font-face{font-family:"Corm";src:url("./cormorant-it300.woff2") format("woff2");font-weight:300;font-style:italic;font-display:block}
@font-face{font-family:"Corm";src:url("./cormorant-it500.woff2") format("woff2");font-weight:500;font-style:italic;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:${d.bg||'#EFE7DB'};font-family:"NSJ",serif;color:#2E2620}
.row{position:absolute;left:${left}px;width:${W}px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 calc(100% - 22px),transparent);mask-image:linear-gradient(#000 calc(100% - 22px),transparent)}
.row img{position:absolute;left:0;width:${W}px;height:auto;display:block}
.head{position:absolute;left:0;right:0;top:${d.headTop||165}px;text-align:center}
.kick{font-family:"Corm";font-style:italic;font-weight:300;font-size:30px;letter-spacing:.18em;color:#9A8676}
.colors{margin-top:2px;font-family:"Corm";font-style:italic;font-weight:500;font-size:84px;line-height:1.1;letter-spacing:.01em}
.w.pill{display:inline-block;padding:0 26px 6px;border-radius:999px;font-size:.86em;vertical-align:.06em}
.amp{font-weight:300;font-size:.62em;color:#B08D57;margin:0 .22em;vertical-align:.1em}
.rule{width:56px;height:1px;background:#B9A796;margin:20px auto 16px}
h1{margin:0;font-weight:300;font-size:40px;letter-spacing:.14em}
.l{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;font-weight:300;font-size:${d.size||22}px;letter-spacing:.06em;text-align:center;line-height:1.35}
.l b{display:block;font-weight:300;color:${c1.hex};font-size:1.05em}
</style>
<div class="head"><div class="kick">today's color</div>
<div class="colors">${word(c1,c2)}<span class="amp">&amp;</span>${word(c2,c1)}</div>
<div class="rule"></div><h1>${d.title}</h1></div>
${labs(top+strip/2,0)}${row(y1,r1h,a1)}${labs(y2-strip/2,3)}${row(y2,r2h,a2)}`;
fs.writeFileSync('_coord.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_coord.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
const hit=await p.evaluate(()=>{const r=[...document.querySelectorAll('.l')].map(e=>[e.textContent,e.getBoundingClientRect()]);
  const o=[];for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++){const a=r[i][1],c=r[j][1];
  if(a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom)o.push(r[i][0]+' × '+r[j][0]);}return o;});
if(hit.length){await b.close(); throw new Error('ラベルが重なっている: '+hit.join(' / '));}
await p.screenshot({path:out}); await b.close(); fs.unlinkSync('./_plate'+path.extname(img)); console.log('->',out);})();
