// IG ハイライトのカバー6枚。1080x1920、中央の円でクロップされる前提。
const {chromium}=require('playwright'); const fs=require('fs');
const {ICONS, INK, ACC, BG} = require('./icons');
const NAMES = Object.keys(ICONS);
(async()=>{
 const b=await chromium.launch();
 for (const n of NAMES){
   const html=`<!doctype html><meta charset="utf-8"><style>
   html,body{margin:0;padding:0}
   body{width:1080px;height:1920px;background:${BG};display:flex;align-items:center;justify-content:center}
   svg{width:560px;height:560px;display:block}</style>
   <svg viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg">${ICONS[n]}</svg>`;
   fs.writeFileSync(`_cov.html`,html);
   const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
   await p.goto('file://'+process.cwd()+'/_cov.html'); await p.waitForTimeout(150);
   await p.screenshot({path:`cover-${n}.png`}); await p.close();
 }
 await b.close(); console.log('done', NAMES.join(' '));
})();
