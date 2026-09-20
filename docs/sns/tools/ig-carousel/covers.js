// IG ハイライトのカバー6枚。1080x1920、中央の円でクロップされる前提。
const {chromium}=require('playwright'); const fs=require('fs');
const INK='#2E2620', ACC='#D4A090', BG='#F5EEE6';
const ICONS = {
 'about': `<g fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round">
   <path d="M280,150 C220,112 130,102 72,122 L72,420 C130,400 220,410 280,448 Z"/>
   <path d="M280,150 C340,112 430,102 488,122 L488,420 C430,400 340,410 280,448 Z"/></g>
   <path d="M280,150 L280,448" fill="none" stroke="${ACC}" stroke-width="13" stroke-linecap="round"/>`,
 'topics': `<g fill="${BG}" stroke="${ACC}" stroke-width="13" stroke-linejoin="round">
    <rect x="96" y="150" width="250" height="310" rx="26" transform="rotate(-9 221 305)"/></g>
   <g fill="${BG}" stroke="${INK}" stroke-width="13" stroke-linejoin="round">
    <rect x="214" y="132" width="250" height="310" rx="26" transform="rotate(8 339 287)"/></g>`,
 'places': `<g fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round" stroke-linecap="round">
    <path d="M123,214 L267,214 L249,368 Q245,392 223,392 L167,392 Q145,392 141,368 Z"/>
    <path d="M123,246 C83,246 83,314 123,314"/>
    <path d="M293,214 L437,214 L419,368 Q415,392 393,392 L337,392 Q315,392 311,368 Z"/>
    <path d="M437,246 C477,246 477,314 437,314"/></g>
   <path d="M92,430 L468,430" fill="none" stroke="${ACC}" stroke-width="13" stroke-linecap="round"/>`,
 'kotosan': `<g fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round" stroke-linecap="round">
    <rect x="66" y="222" width="182" height="146" rx="44"/>
    <rect x="312" y="222" width="182" height="146" rx="44"/>
    <path d="M248,276 C264,254 296,254 312,276"/>
    <path d="M66,266 L24,232"/><path d="M494,266 L536,232"/></g>
   <path d="M108,326 L150,280" fill="none" stroke="${ACC}" stroke-width="15" stroke-linecap="round"/>`,
 'feelings': `<g transform="translate(22,16)"><path d="M120,350 C85,350 60,325 60,292 C60,259 85,234 118,234
    C122,186 163,150 212,152 C240,116 288,104 328,124 C360,140 380,170 381,204
    C421,200 456,230 458,270 C460,312 428,348 388,348 Z"
    fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round"/></g>
   <circle cx="280" cy="420" r="21" fill="${ACC}"/>`,
 'making': `<g fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round">
    <path d="M182,398 L372,208 L424,260 L234,450 Z"/><path d="M336,244 L388,296"/></g>
   <path d="M182,398 L234,450 L150,482 Z" fill="${ACC}" stroke="${ACC}" stroke-width="13" stroke-linejoin="round"/>`,
};
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
