// 「会う日の服」v5（人の説明書）型（docs/sns/series/au-hi-no-fuku.md）。1080x1920 の1枚を書き出す。
//   上に題、左に写真（人のまわりを縦長に切り出す）、右に説明書（項目名＋その人の一言）、下に問いかけ。
//   写真の上に文字を重ねない。IG の右のボタン（x>960・y>1100）と下のキャプション（y>1600）に入れない。
//   node render-manual.js <写真> <出力.png> '<json>'
//   json = {"no":"01","style":"90s New York","title":"土曜の昼、2回目のデートに古着で行く人",
//           "crop":[250,0,900,1180],   // 写真の切り出し（元画像の x0,y0,x1,y1）。人が真ん中に来るように
//           "entries":[["好きな人には","好きなものの話になると/早口になる"], …],  // 5つまで。一言は18字まで。/ で改行（言葉の途中で折れないように）
//           "footer":"いくつ当てはまりましたか",
//           "accent":"#5B4A2E"}        // 項目名と札の色。服の色から取る
//   フォントは実行ディレクトリに置く：notoserif300.woff2 / notoserif500.woff2 / cormorant-it300.woff2 / cormorant-it500.woff2
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const [,,img,out,json]=process.argv;
const d=JSON.parse(json);
const {execSync}=require('child_process');
d.iw=Number(execSync(`python3 -c "from PIL import Image;print(Image.open('${img}').size[0])"`).toString().trim());
if(!d.title||!Array.isArray(d.entries)||!d.crop) throw new Error('title・entries・crop が要る');
if(d.entries.length>5) throw new Error('entries は5つまで');
for(const [,v] of d.entries) if([...v.replace(/\//g,'')].length>18) throw new Error('一言は18字まで: '+v);
const [x0,y0,x1,y1]=d.crop, PW=540, k=PW/(x1-x0), PH=Math.round((y1-y0)*k), PT=360, PL=40;
if(PT+PH>1500) throw new Error('写真が下のキャプションに入る。crop の高さを小さく');
const acc=d.accent||'#5B4A2E';
fs.copyFileSync(img,'./_photo'+path.extname(img));
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"NSJ";src:url("./notoserif300.woff2") format("woff2");font-weight:300;font-display:block}
@font-face{font-family:"NSJ";src:url("./notoserif500.woff2") format("woff2");font-weight:500;font-display:block}
@font-face{font-family:"Corm";src:url("./cormorant-it300.woff2") format("woff2");font-weight:300;font-style:italic;font-display:block}
@font-face{font-family:"Corm";src:url("./cormorant-it500.woff2") format("woff2");font-weight:500;font-style:italic;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:${d.bg||'#EFE7DB'};font-family:"NSJ",serif;color:#2E2620}
.head{position:absolute;left:0;right:0;top:150px;text-align:center}
.kick{font-family:"Corm";font-style:italic;font-weight:300;font-size:30px;letter-spacing:.16em;color:#9A8676}
.kick b{font-weight:500;color:${acc}}
h1{margin:14px 0 0;font-weight:300;font-size:40px;letter-spacing:.1em}
.photo{position:absolute;left:${PL}px;top:${PT}px;width:${PW}px;height:${PH}px;overflow:hidden;border-radius:6px}
.photo img{position:absolute;left:${-Math.round(x0*k)}px;top:${-Math.round(y0*k)}px;width:${Math.round(d.iw*k)}px}
.col{position:absolute;left:${PL+PW+34}px;width:${1080-(PL+PW+34)-96}px;top:${PT+20}px}
.e{margin-bottom:30px}
.e .k{font-weight:500;font-size:22px;letter-spacing:.12em;color:${acc}}
.e .k:before{content:"";display:inline-block;width:18px;height:1px;background:${acc};vertical-align:.35em;margin-right:10px}
.e .v{word-break:keep-all;margin-top:8px;font-weight:300;font-size:27px;line-height:1.48;letter-spacing:.04em}
.foot{position:absolute;left:0;right:0;top:${PT+PH+46}px;text-align:center;font-weight:300;font-size:32px;letter-spacing:.14em}
.foot:before,.foot:after{content:"";display:inline-block;width:40px;height:1px;background:#B9A796;vertical-align:.35em;margin:0 20px}
</style>
<div class="head"><div class="kick">someone's manual &nbsp;No.${d.no||'01'} &nbsp;<b>${d.style||''}</b></div><h1>${d.title}</h1></div>
<div class="photo"><img src="./_photo${path.extname(img)}"></div>
<div class="col">${d.entries.map(([kk,v])=>`<div class="e"><div class="k">${kk}</div><div class="v">${v.split('/').join('<br>')}</div></div>`).join('')}</div>
${d.footer?`<div class="foot">${d.footer}</div>`:''}`;
fs.writeFileSync('_manual.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_manual.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const c=document.querySelector('.col').getBoundingClientRect();
  const h=document.querySelector('h1').getBoundingClientRect();return {colBottom:c.bottom,h1w:h.width,h1h:h.height};});
if(r.colBottom>1150){await b.close(); throw new Error('説明書が右のボタンの高さに入る（下端 '+Math.round(r.colBottom)+'）。一言を短く');}
if(r.h1h>70){await b.close(); throw new Error('題が2行になった。短くする');}
await p.screenshot({path:out}); await b.close(); fs.unlinkSync('./_photo'+path.extname(img)); console.log('->',out, r);})();
