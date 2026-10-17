// 「会う日の服」v5（人の説明書）型（docs/sns/series/au-hi-no-fuku.md）。1080x1920 の1枚を書き出す。
//   上に題、左に写真（人のまわりを縦長に切り出す）、右に説明書（項目名＋その人の一言）、下に問いかけ。
//   写真の上に文字を重ねない。IG の右のボタン（x>960・y>1100）と下のキャプション（y>1600）に入れない。
//   node render-manual.js <写真> <出力.png> '<json>'
//   json = {"no":"01","style":"90s New York","title":"土曜の昼、2回目のデートに古着で行く人",
//           "crop":[250,0,900,1180],   // 写真の切り出し（元画像の x0,y0,x1,y1）。人が真ん中に来るように
//           "entries":[["好きな人には","好きなものの話になると/早口になる"], …],  // 5つまで。一言は18字まで。/ で改行（言葉の途中で折れないように）
//           "footer":"いくつ当てはまりましたか",   // 説明書の最後に置く問いかけ
//           "points":[{"crop":[360,240,700,480],"text":"大きめのチェックは/中を細いタートルに"}, …],  // 3つ。写真から服の細部を切り出し、下に一言（12字×2行まで）
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
const [x0,y0,x1,y1]=d.crop, PW=540, k=PW/(x1-x0), PH=Math.round((y1-y0)*k), PT=d.pt||360, PL=40;
const pts=d.points||[]; if(pts.length&&pts.length!==3) throw new Error('points は3つ');
for(const q of pts) for(const l of q.text.split('/')) if([...l].length>12) throw new Error('ポイントは1行12字まで: '+l);
const BW=320,BH=200,GAP=(1080-80-BW*3)/2, QT=PT+PH+40;
if(pts.length&&QT+46+BH+80>(d.hand?1760:1680)) throw new Error('ポイントが下のキャプションに入る。crop の高さを小さく');
if(!pts.length&&PT+PH>1500) throw new Error('写真が下のキャプションに入る。crop の高さを小さく');
const thumb=(q,i)=>{const [a,b,c,e]=q.crop,sc=Math.max(BW/(c-a),BH/(e-b));
  const L=Math.round(-a*sc+(BW-(c-a)*sc)/2),T=Math.round(-b*sc+(BH-(e-b)*sc)/2);
  return `<div class="pt" style="left:${40+i*(BW+GAP)}px;top:${QT+(d.hand?62:46)}px"><div class="th"><img src="./_photo${path.extname(img)}" style="left:${L}px;top:${T}px;width:${Math.round(d.iw*sc)}px"></div><div class="tx">${q.text.split('/').join('<br>')}</div></div>`;};
const acc=d.accent||'#5B4A2E';
fs.copyFileSync(img,'./_photo'+path.extname(img));
const html=`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"NSJ";src:url("./notoserif300.woff2") format("woff2");font-weight:300;font-display:block}
@font-face{font-family:"NSJ";src:url("./notoserif500.woff2") format("woff2");font-weight:500;font-display:block}
@font-face{font-family:"Corm";src:url("./cormorant-it300.woff2") format("woff2");font-weight:300;font-style:italic;font-display:block}
@font-face{font-family:"Corm";src:url("./cormorant-it500.woff2") format("woff2");font-weight:500;font-style:italic;font-display:block}
html,body{margin:0;padding:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:${d.bg||'#EFE7DB'};font-family:"NSJ",serif;color:#2E2620}
.head{position:absolute;left:0;right:0;top:${d.headTop||150}px;text-align:center}
.kick{font-family:"Corm";font-style:italic;font-weight:300;font-size:30px;letter-spacing:.16em;color:#9A8676}
.kick b{font-weight:500;color:${acc}}
h1{margin:14px 0 0;font-weight:300;font-size:40px;letter-spacing:.1em}
.photo{position:absolute;left:${PL}px;top:${PT}px;width:${PW}px;height:${PH}px;overflow:hidden;border-radius:6px}
.photo img{position:absolute;left:${-Math.round(x0*k)}px;top:${-Math.round(y0*k)}px;width:${Math.round(d.iw*k)}px}
.col{position:absolute;left:${PL+PW+34}px;width:${1080-(PL+PW+34)-96}px;top:${PT+20}px}
.e{margin-bottom:24px}
.e .k{font-weight:500;font-size:22px;letter-spacing:.12em;color:${acc}}
.e .k:before{content:"";display:inline-block;width:18px;height:1px;background:${acc};vertical-align:.35em;margin-right:10px}
.e .v{word-break:keep-all;margin-top:8px;font-weight:300;font-size:27px;line-height:1.48;letter-spacing:.04em}
.foot{margin-top:6px;padding-top:22px;border-top:1px solid #B9A796;font-weight:300;font-size:28px;letter-spacing:.1em}
.qh{position:absolute;left:0;right:0;top:${QT}px;text-align:center;font-family:"Corm";font-style:italic;font-weight:300;font-size:30px;letter-spacing:.16em;color:#9A8676}
.qh b{font-weight:500;color:${acc}}
.pt{position:absolute;width:${BW}px}
.th{position:relative;width:${BW}px;height:${BH}px;overflow:hidden;border-radius:4px}
.th img{position:absolute}
.tx{margin-top:14px;text-align:center;font-weight:300;font-size:23px;line-height:1.5;letter-spacing:.04em}
${d.hand?`
@font-face{font-family:"Klee";src:url("./klee400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"Klee";src:url("./klee600.woff2") format("woff2");font-weight:600;font-display:block}
@font-face{font-family:"Cav";src:url("./caveat500.woff2") format("woff2");font-weight:500;font-display:block}
.kick,.qh,.note{font-family:"Cav",cursive!important;font-style:normal!important;font-weight:500!important;letter-spacing:.04em!important}
.kick{font-size:38px!important}.kick b{font-weight:500}.qh{font-size:42px!important}
h1{font-family:"Klee";font-weight:600;font-size:42px;letter-spacing:.06em}
.uline{display:block;margin:6px auto 0}
.e .v,.tx,.foot{font-family:"Klee";font-weight:600;letter-spacing:.02em}
.e .v{font-size:28px}.tx{font-size:25px}.foot{font-size:30px}
.e .k{font-family:"Klee";font-weight:400}
.photo,.th{box-shadow:0 2px 0 #fff,0 8px 18px rgba(80,60,40,.12)}
.photo{transform:rotate(-1.2deg)}
.note{position:absolute;left:0;right:0;top:${d.noteTop||1800}px;text-align:center;font-size:40px;color:${acc}}
`:''}</style>
<div class="head"><div class="kick">someone's manual &nbsp;No.${d.no||'01'} &nbsp;<b>${d.style||''}</b></div><h1>${d.title}</h1>${d.hand?`<svg class="uline" width="620" height="18" viewBox="0 0 620 18"><path d="M4 11 C 80 3, 150 16, 230 9 S 380 3, 460 10 S 570 15, 616 7" fill="none" stroke="${acc}" stroke-width="2.2" stroke-linecap="round" opacity=".7"/></svg>`:''}</div>
<div class="photo"><img src="./_photo${path.extname(img)}"></div>
<div class="col">${d.entries.map(([kk,v])=>`<div class="e"><div class="k">${kk}</div><div class="v">${v.split('/').join('<br>')}</div></div>`).join('')}${d.footer?`<div class="foot">${d.footer}</div>`:''}</div>
${d.hand&&d.note?`<div class="note">${d.note}</div>`:''}${pts.length?`<div class="qh">today's <b>point</b></div>`+pts.map(thumb).join(''):''}`;
fs.writeFileSync('_manual.html',html);
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/_manual.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const c=document.querySelector('.col').getBoundingClientRect();
  const h=document.querySelector('h1').getBoundingClientRect();return {colBottom:c.bottom,h1w:h.width,h1h:h.height};});
if(r.colBottom>1180){await b.close(); throw new Error('説明書が右のボタンの高さに入る（下端 '+Math.round(r.colBottom)+'）。一言を短く');}
if(r.h1h>70){await b.close(); throw new Error('題が2行になった。短くする');}
await p.screenshot({path:out}); await b.close(); fs.unlinkSync('./_photo'+path.extname(img)); console.log('->',out, r);})();
