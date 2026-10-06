// 「A vs B 比較」型（docs/sns/packs/2026-10-06-ig-reel-l4-children-vs.md）。1080x1920 を N 枚書き出す。
//   参考は @koarasan_genkai の「A vs B 比較 N選」。左右分割の生成画像に、題の帯・左右の札・中央線・
//   「言ってみるなら」の箱・大きな「①項目」・2行の角丸を重ねる。
//   node render-vs.js '<json>'
//   json = {"title":"…","left":"聞く側","right":"聞かれる側","top":155,
//           "cuts":[{"img":"…/l4c-1.jpg","no":"①","item":"切り出すタイミング","say":"「…」","l":"…","r":"…"}, …]}
//   出力は f1.png〜fN.png。画像は幅1080に合わせて y=top から置く（左右を切らない。上下の空きは地色）
//   フォントは shippori400.woff2 / shippori800.woff2（@fontsource/shippori-mincho の japanese-400/800-normal）
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const d=JSON.parse(process.argv[2]);
const top=d.top??155;
const page=(c,i)=>`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"SM";src:url("./shippori400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"SM";src:url("./shippori800.woff2") format("woff2");font-weight:800;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#F5EEE6;font-family:"SM",serif;color:#2E2620}
img{position:absolute;left:0;top:${top}px;width:1080px;height:auto;display:block}
.line{position:absolute;left:537px;top:0;width:6px;height:1920px;background:#FFFCF8}
.band{position:absolute;left:0;right:0;top:170px;padding:18px 0 20px;text-align:center;background:rgba(245,238,230,.9);
  font-size:46px;letter-spacing:.06em;box-shadow:0 2px 8px rgba(46,38,32,.10)}
.tag{position:absolute;top:300px;white-space:nowrap;transform:translateX(-50%);font-weight:800;font-size:76px;letter-spacing:.04em;color:#FFFCF8;
  -webkit-text-stroke:10px var(--c);paint-order:stroke fill;filter:drop-shadow(0 0 10px var(--g))}
.say{position:absolute;left:50%;top:990px;transform:translateX(-50%);white-space:nowrap;background:rgba(255,252,248,.9);
  padding:16px 30px 18px;border-radius:6px;box-shadow:0 2px 8px rgba(46,38,32,.12)}
.say small{display:block;font-size:26px;letter-spacing:.12em;color:#8A6A5E;margin-bottom:6px}
.say div{font-size:34px;letter-spacing:.04em}
.item{position:absolute;left:0;right:0;top:1150px;text-align:center;white-space:nowrap;font-weight:800;font-size:82px;letter-spacing:.02em;
  color:#FFFCF8;text-shadow:0 3px 14px rgba(46,38,32,.65),0 0 4px rgba(46,38,32,.5)}
.pill{position:absolute;left:50%;top:1290px;transform:translateX(-50%);white-space:nowrap;background:rgba(46,38,32,.74);color:#FFFCF8;
  padding:18px 40px 20px;border-radius:40px;font-size:36px;line-height:1.65;letter-spacing:.03em}
</style><img src="${c.img}"><div class="line"></div>
<div class="band">${d.title}</div>
<div class="tag" style="left:270px;--c:#C98E7C;--g:rgba(212,160,144,.9)">${d.left}</div>
<div class="tag" style="left:810px;--c:#8FA58A;--g:rgba(143,165,138,.9)">${d.right}</div>
${c.say?`<div class="say"><small>言ってみるなら</small><div>${c.say}</div></div>`:''}
<div class="item">${c.no}${c.item}</div>
<div class="pill">${d.left}：${c.l}<br>${d.right}：${c.r}</div>`;
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
for(const [i,c] of d.cuts.entries()){
  const src='./_vs'+i+path.extname(c.img); fs.copyFileSync(c.img,src);
  fs.writeFileSync('_vs.html',page({...c,img:src},i));
  await p.goto('file://'+process.cwd()+'/_vs.html');
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
  // 隠れる範囲（y>1480）と画面からのはみ出しを止める
  const bad=await p.evaluate(()=>{const w=e=>e.className==='item'?(()=>{const g=document.createRange();g.selectNodeContents(e);return g.getBoundingClientRect();})():e.getBoundingClientRect();return [...document.querySelectorAll('.say,.item,.pill,.band,.tag')].map(e=>[e.className,w(e)])
    .filter(([k,r])=>r.bottom>1480||(k!=='band'&&(r.left<20||r.right>1060))).map(([k,r])=>`${k} ${Math.round(r.left)}-${Math.round(r.right)} / bottom ${Math.round(r.bottom)}`);});
  if(bad.length){await b.close(); throw new Error(`f${i+1}: はみ出し ${bad.join(' / ')}`);}
  await p.screenshot({path:`f${i+1}.png`}); fs.unlinkSync(src); console.log('->',`f${i+1}.png`);
}
await b.close();})();
