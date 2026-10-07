// 「ぎっしり情景」型の X 用の静止画（4:5・1080x1350）。IG 版（render-labels.js）の座標をそのまま使える。
//   X のタイムラインは縦長画像を 4:5 前後で切るため、9:16 の IG 版をそのまま貼ると題の帯が切れる。
//   node render-x-labels.js <画像> <出力.png> '<json>'
//   json = IG 版と同じ {"title","sub","top","labels":[{"t","x","y"}]} に、"shift"（既定 300）を足せる。
//   画像は幅1080に合わせて y=top-shift から置き、ラベルの y も shift だけ上へずらす。
//   番号はラベルの頭に付ける（"1 遅れそうで走る"）。返信が「4です」の一言で済むように。
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const [,,img,out,json]=process.argv;
const d=JSON.parse(json); const W=1080,H=1350; const shift=d.shift??300; const top=(d.top||0)-shift;
const labels=d.labels.map(l=>({...l,y:l.y-shift}));
for(const l of labels){
  if(l.y<170||l.y>H-40) throw new Error(`y=${l.y} は帯か下端にかかる: ${l.t}`);
  if(l.x<90||l.x>990) throw new Error(`x=${l.x} は端に寄りすぎ: ${l.t}`);
}
const src='./_plate'+path.extname(img); fs.copyFileSync(img,src);
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Shippori Mincho";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
html,body{margin:0;padding:0}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:#F5EEE6;font-family:"Shippori Mincho",serif;color:#2E2620}
img{position:absolute;left:0;top:${top}px;width:${W}px;height:auto;display:block}
b{font-weight:400;color:#B07A68;margin-right:10px}
.band{position:absolute;left:0;right:0;top:0;padding:28px 0 24px;text-align:center;background:rgba(245,238,230,.97);box-shadow:0 3px 10px rgba(46,38,32,.10)}
.band h1{margin:0;font-weight:400;font-size:52px;letter-spacing:.08em;line-height:1.3}
.band p{margin:6px 0 0;font-size:32px;letter-spacing:.1em;color:#8A6A5E}
.l{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;font-size:30px;letter-spacing:.04em;
   padding:4px 14px 5px;border-radius:999px;background:rgba(255,252,248,.92);box-shadow:0 2px 6px rgba(46,38,32,.18)}
</style><img src="${src}"><div class="band"><h1>${d.title}</h1>${d.sub?`<p>${d.sub}</p>`:''}</div>
${labels.map(l=>`<div class="l" style="left:${l.x}px;top:${l.y}px">${l.t.replace(/^(\d+) /,'<b>$1</b>')}</div>`).join('')}`;
fs.writeFileSync('_xlabels.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_xlabels.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
const hit=await p.evaluate(()=>{const r=[...document.querySelectorAll('.l,.band')].map(e=>[e.textContent,e.getBoundingClientRect()]);
  const o=[];for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++){const a=r[i][1],c=r[j][1];
  if(a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom)o.push(r[i][0]+' × '+r[j][0]);}return o;});
if(hit.length){await b.close(); throw new Error('重なっている: '+hit.join(' / '));}
await p.screenshot({path:out}); await b.close(); fs.unlinkSync(src); fs.unlinkSync('_xlabels.html'); console.log('->',out);})();
