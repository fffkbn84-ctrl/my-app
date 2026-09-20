// ハイライトに入れるストーリー画像。1080x1920。
//   lead : アイコン＋見出し 56px（各ハイライトの1枚目。アイコンはカバーと同じ記号）
//   body : 文字だけ 48px（2枚目以降）
//   note : 文字だけ 44px（補足・ことわり書き）
// 上下は IG の UI に隠れるので、中身は y=400〜1500 に収めている。
const {chromium}=require('playwright'); const fs=require('fs');
const {ICONS, INK, BG} = require('./icons');
const [,,kind,icon,out,json]=process.argv;
const lines=JSON.parse(json);
const L={ lead:{size:'56px', lh:'1.90', ls:'.07em', top:'940px'},
          body:{size:'48px', lh:'2.05', ls:'.08em', top:null},
          note:{size:'44px', lh:'2.05', ls:'.08em', top:null} }[kind];
if(!L){ console.error('kind は lead / body / note'); process.exit(1); }
const mark = (icon && icon!=='none')
  ? `<svg class="i" viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg">${ICONS[icon]}</svg>` : '';
const pos = L.top ? `top:${L.top}` : `top:950px;transform:translateY(-50%)`;
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Shippori Mincho";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;background:${BG}}
.i{position:absolute;left:420px;top:620px;width:240px;height:240px;display:block}
.t{position:absolute;left:0;right:0;${pos};text-align:center;
 font-family:"Shippori Mincho",serif;color:${INK};font-weight:400;
 font-size:${L.size};line-height:${L.lh};letter-spacing:${L.ls};margin-right:-${L.ls}}
.t span{display:block}
.t span.gap{height:.7em}
</style>${mark}<div class="t">${lines.map(l=>
  l && l.gap ? '<span class="gap"></span>' : `<span>${l}</span>`).join('')}</div>`;
fs.writeFileSync('_story.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_story.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({path:out}); await b.close(); console.log('->',out);})();
