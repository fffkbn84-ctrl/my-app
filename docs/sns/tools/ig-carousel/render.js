const {chromium}=require('playwright');
const fs=require('fs');
const [,,plate,out,...lines]=process.argv;
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Shippori Mincho";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1350px;position:relative;background:#F5EEE6}
img{position:absolute;inset:0;width:1080px;height:1350px;display:block}
.t{position:absolute;left:0;right:0;top:800px;text-align:center;
 font-family:"Shippori Mincho",serif;color:#2E2620;font-weight:400;
 font-size:54px;line-height:1.95;letter-spacing:.08em;margin-right:-.08em}
.t span{display:block}
</style><img src="./${plate}"><div class="t">${lines.map(l=>`<span>${l}</span>`).join('')}</div>`;
fs.writeFileSync('_slide.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_slide.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({path:out}); await b.close(); console.log('->',out);})();
