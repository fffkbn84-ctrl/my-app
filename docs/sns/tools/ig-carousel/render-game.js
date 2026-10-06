// 試作（2026-09-27）：「ふたり」ゲームオーバー案の版面。案と台本は docs/sns/series/futari-ideas.md 案1。
// フォント：dot-ja.woff2 / dot-la.woff2（@fontsource/dotgothic16 の japanese-400 / latin-400）、noto900.woff2
//
//   node render-game.js <plate> <out.png> win  '{"lines":["行1","行2"],"cmd":{"items":["そっとしておく","きいてみる"],"sel":0}}'
//   node render-game.js <plate> <out.png> over '{"lines":["きもちは　ためると","かたくなる。"],"cmd":{"items":["もういちど","やめる"],"sel":0}}'
//   帯を変えるときは json に "band":["1行目","2行目"]、窓の上端は "top":420
const {chromium}=require('playwright');const fs=require('fs');
const [,,plate,out,mode,json]=process.argv;const d=JSON.parse(json);
const band=d.band||['付き合いたての','彼女の機嫌が悪い日'];
const cmd=(c)=>c?`<div class="cmd">${c.items.map((t,i)=>`<div>${i===c.sel?'<span class="cur">▶</span>':'<span class="cur off">▶</span>'}${t}</div>`).join('')}</div>`:'';
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:D;src:url(./dot-la.woff2)format("woff2");unicode-range:U+0000-00FF,U+2000-206F,U+25B6}
@font-face{font-family:D;src:url(./dot-ja.woff2)format("woff2")}
@font-face{font-family:N9;src:url(./noto900.woff2)format("woff2")}
html,body{margin:0}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#000}
img{position:absolute;inset:0;width:1080px;height:1920px;${mode==='over'?'filter:grayscale(1) brightness(.35)':''}}
.band{position:absolute;left:50%;top:170px;transform:translateX(-50%);background:#141110;color:#fff;font-family:N9;font-size:64px;line-height:1.28;padding:22px 44px;text-align:center;white-space:nowrap}
.win{position:absolute;left:70px;right:70px;top:${d.top||420}px;background:#0b0b18;border:8px solid #fff;border-radius:18px;box-shadow:0 0 0 6px #0b0b18;
 color:#fff;font-family:D;font-size:50px;line-height:1.6;padding:34px 44px;letter-spacing:.06em}
.cmd{margin-top:16px}.cur{display:inline-block;width:64px;animation:none}.off{visibility:hidden}
.over{position:absolute;left:0;right:0;top:560px;text-align:center;font-family:D;color:#fff}
.over .g{font-size:150px;letter-spacing:.08em;color:#E8B8A8}
.over .s{font-size:48px;margin-top:40px;line-height:1.7}
.over .cmd{display:inline-block;text-align:left;font-size:54px;margin-top:70px}
</style><img src="./${plate}">
${mode==='over'?'':`<div class="band">${band.map(t=>`<div>${t}</div>`).join('')}</div>`}
${mode==='win'?`<div class="win">${d.lines.map(l=>`<div>${l}</div>`).join('')}${cmd(d.cmd)}</div>`:''}
${mode==='over'?`<div class="over"><div class="g">GAME OVER</div><div class="s">${d.lines.join('<br>')}</div><br>${cmd(d.cmd)}</div>`:''}`;
const tmp='_g.html';fs.writeFileSync(tmp,html);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/'+tmp);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
await p.screenshot({path:out});await b.close();console.log('->',out)})();
