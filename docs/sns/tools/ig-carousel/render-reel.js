// 入口リール（土曜枠）用。1080x1920 のフレームを書き出す。
//   hook : 58px（1秒目・topics.ts の ask）
//   body : 48px（2カット目以降）
const {chromium}=require('playwright'); const fs=require('fs');
const [,,kind,plate,out,json]=process.argv;
const lines=JSON.parse(json);
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
</style><img src="./${plate}"><div class="t">${lines.map(l=>`<span>${l}</span>`).join('')}</div>`;
fs.writeFileSync('_reel.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_reel.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({path:out}); await b.close(); console.log('->',out);})();
