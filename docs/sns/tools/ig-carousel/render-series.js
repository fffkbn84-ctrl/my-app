// 連載「ふたりの話題、ひとつずつ」用。3レイアウト。
//   hook  : モチーフ小(上) + 質問を大きく      -> 1枚目
//   body  : 文字のみ・天地中央                 -> 2〜4枚目
//   close : モチーフ小(上) + 本文 + CTA        -> 5枚目
const {chromium}=require('playwright'); const fs=require('fs');
const [,,kind,plate,out,json]=process.argv;
const lines=JSON.parse(json);               // ["行", ...]  close は {gap:true} を挟める
const span=l=>typeof l==='string'?`<span>${l}</span>`:`<span class="gap"></span>`;
const L={
  hook : {top:'690px', size:'62px', lh:'1.85', ls:'.06em'},
  body : {top:null,    size:'44px', lh:'2.05', ls:'.08em'},
  close: {top:'710px', size:'44px', lh:'2.05', ls:'.08em'},
}[kind];
const pos = L.top ? `top:${L.top};` : `top:50%;transform:translateY(-50%);`;
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Shippori Mincho";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1350px;position:relative;background:#F5EEE6}
img{position:absolute;inset:0;width:1080px;height:1350px;display:block}
.t{position:absolute;left:0;right:0;${pos}text-align:center;
 font-family:"Shippori Mincho",serif;color:#2E2620;font-weight:400;
 font-size:${L.size};line-height:${L.lh};letter-spacing:${L.ls};margin-right:-${L.ls}}
.t span{display:block}
.t span.gap{height:.7em}
</style>${plate==='none'?'':`<img src="./${plate}">`}<div class="t">${lines.map(span).join('')}</div>`;
fs.writeFileSync('_series.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_series.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({path:out}); await b.close(); console.log('->',out);})();
