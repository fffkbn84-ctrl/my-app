// ハイライトのカバーと、ストーリー1枚目で共用するアイコン。
// 560x560 の viewBox。線は13、アクセントは1枚に1箇所だけ。
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
 'feelings': `<g fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="280" cy="180" r="82"/>
    <path d="M280,262 L280,462"/>
    <path d="M280,390 L340,390"/><path d="M280,450 L326,450"/></g>
   <circle cx="280" cy="180" r="28" fill="${ACC}"/>`,
 'making': `<g fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round">
    <path d="M182,398 L372,208 L424,260 L234,450 Z"/><path d="M336,244 L388,296"/></g>
   <path d="M182,398 L234,450 L150,482 Z" fill="${ACC}" stroke="${ACC}" stroke-width="13" stroke-linejoin="round"/>`,
 'note': `<circle cx="412" cy="206" r="66" fill="${ACC}"/>
   <g transform="translate(22,70)"><path d="M120,350 C85,350 60,325 60,292 C60,259 85,234 118,234
    C122,186 163,150 212,152 C240,116 288,104 328,124 C360,140 380,170 381,204
    C421,200 456,230 458,270 C460,312 428,348 388,348 Z"
    fill="${BG}" stroke="${INK}" stroke-width="13" stroke-linejoin="round"/></g>`,
 'type': `<g fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round">
    <rect x="62" y="62" width="196" height="196" rx="34"/>
    <rect x="62" y="302" width="196" height="196" rx="34"/>
    <rect x="302" y="302" width="196" height="196" rx="34"/></g>
   <rect x="302" y="62" width="196" height="196" rx="34" fill="${ACC}"/>`,
};
module.exports = {ICONS, INK, ACC, BG};
