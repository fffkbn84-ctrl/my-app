// 「今日の天気、つけてみた」の素材：本物の画面を iPhone 幅（390×844・3倍）で撮る。
// サイトをローカルで動かしてから（npm ci → NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy npx next dev -p 3123）
//   node capture-note-today.mjs <出力dir> '<Q1の答え>' '<Q2の答え>' '<Q3の答え>'
// 出力：s-q1.png（未選択）／s-q1sel.png（選んだ瞬間）／s-q3sel.png／s-result.png
// Q1 が「とくに何もない」のときは Q2 が飛ぶので、Q2 に '' を渡す
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [,, out, a1, a2, a3] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
await p.goto('http://localhost:3123/kinda-note/today', { waitUntil: 'networkidle' });
const hide = () => p.addStyleTag({ content: 'nextjs-portal{display:none!important}' }); // 開発用マークを消す
await hide(); await p.waitForTimeout(500);
await p.screenshot({ path: `${out}/s-q1.png` });
await p.getByText(a1, { exact: true }).click(); await p.waitForTimeout(120); // 260ms で次へ進むので、その前に撮る
await p.screenshot({ path: `${out}/s-q1sel.png` }); await p.waitForTimeout(800);
if (a2) { await p.getByText(a2, { exact: true }).click(); await p.waitForTimeout(900); }
await p.getByText(a3, { exact: true }).click(); await p.waitForTimeout(120);
await p.screenshot({ path: `${out}/s-q3sel.png` }); await p.waitForTimeout(900);
const names = await p.getByRole('button').allInnerTexts();
await p.getByRole('button', { name: names.find((x) => /天気/.test(x)) }).click(); // 一言は空のまま
await p.waitForTimeout(3000); await hide();
await p.screenshot({ path: `${out}/s-result.png` });
console.log(p.url()); await b.close();
