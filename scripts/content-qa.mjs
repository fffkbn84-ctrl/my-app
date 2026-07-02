#!/usr/bin/env node
/* ────────────────────────────────────────────────────────────
   content-qa.mjs — Kinda コンテンツQAスクリプト

   公開前にブランド・法務ルール違反を機械チェックする。
   対象:
     1. content/columns/*.mdx   … コラム（frontmatter＋本文）
     2. src/lib/mock/stories.ts … Kinda story（同意整合性含む）
     3. src/app/kinda-story/    … 禁止構造化データ（Review/Rating）

   使い方:
     npm run qa:content            … 全チェック
     npm run qa:content -- --list  … チェック項目の一覧だけ表示

   終了コード: エラーあり=1 / 警告のみ・問題なし=0
   ルールの正は CLAUDE.md（§3 トーン / §5 Story細則）。
──────────────────────────────────────────────────────────── */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COLUMNS_DIR = path.join(ROOT, "content", "columns");
const STORIES_TS = path.join(ROOT, "src", "lib", "mock", "stories.ts");
const STORY_APP_DIR = path.join(ROOT, "src", "app", "kinda-story");

/* ── ルール定義 ────────────────────────────────────────── */

// 絵文字（サイト本文・記事は絵文字なし＝CLAUDE.md §3）。©®™ は誤検知しやすいので除外。
const EMOJI_RE = /(?![©®™])\p{Extended_Pictographic}/u;

// エラー級のNG語（外部発信で「中立」を自称しない＝CLAUDE.md §1）
const NG_ERROR = [{ re: /中立/, label: "「中立」（業態否定になるため外部発信で使わない）" }];

// 警告級のNG語（焦らせ・比較・非包摂の兆候。文脈により許容されうるので warn）
const NG_WARN = [
  { re: /早くしないと/, label: "焦らせ表現「早くしないと」" },
  { re: /今すぐ/, label: "焦らせ表現「今すぐ」" },
  { re: /手遅れ/, label: "焦らせ表現「手遅れ」" },
  { re: /乗り遅れ/, label: "焦らせ表現「乗り遅れ」" },
  { re: /周りはもう/, label: "比較表現「周りはもう」" },
  { re: /異性/, label: "「異性」（LGBTQ+包摂＝「相手」「ふたり」で書けないか確認）" },
];

const COLUMN_REQUIRED = ["title", "description", "category", "publishedAt", "tags"];

const errors = [];
const warns = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warns.push(`${file}: ${msg}`);

function checkText(file, where, text) {
  if (typeof text !== "string" || !text) return;
  const emoji = text.match(EMOJI_RE);
  if (emoji) err(file, `${where}: 絵文字「${emoji[0]}」が含まれる（サイト本文は絵文字なし）`);
  for (const { re, label } of NG_ERROR) {
    const m = text.match(re);
    if (m) err(file, `${where}: NG語 ${label} …「${snippet(text, m.index)}」`);
  }
  for (const { re, label } of NG_WARN) {
    const m = text.match(re);
    if (m) warn(file, `${where}: ${label} …「${snippet(text, m.index)}」`);
  }
}

function snippet(text, i) {
  return text.slice(Math.max(0, i - 12), i + 18).replace(/\n/g, " ");
}

/* 深いオブジェクトの文字列を総なめ */
function walkStrings(file, prefix, val) {
  if (typeof val === "string") return checkText(file, prefix, val);
  if (Array.isArray(val)) return val.forEach((v, i) => walkStrings(file, `${prefix}[${i}]`, v));
  if (val && typeof val === "object")
    return Object.entries(val).forEach(([k, v]) => walkStrings(file, `${prefix}.${k}`, v));
}

/* ── 1. コラム MDX ─────────────────────────────────────── */

function checkColumns() {
  if (!fs.existsSync(COLUMNS_DIR)) return;
  for (const name of fs.readdirSync(COLUMNS_DIR).filter((f) => f.endsWith(".mdx"))) {
    const file = `content/columns/${name}`;
    const raw = fs.readFileSync(path.join(COLUMNS_DIR, name), "utf8");
    let parsed;
    try {
      parsed = matter(raw);
    } catch (e) {
      err(file, `frontmatter が解析できない: ${e.message}`);
      continue;
    }
    const fm = parsed.data;
    for (const key of COLUMN_REQUIRED)
      if (fm[key] == null || fm[key] === "") err(file, `frontmatter 必須項目 ${key} がない`);
    if (typeof fm.description === "string" && fm.description.length > 160)
      warn(file, `description が ${fm.description.length} 字（検索結果で切れる目安 160 字超）`);
    if (!fm.atomicAnswer) warn(file, "atomicAnswer がない（AEO/AI検索向け要約。推奨）");
    if (!fm.faq || fm.faq.length === 0) warn(file, "faq がない（FAQPage 構造化データ・AEO 推奨）");
    walkStrings(file, "frontmatter", fm);
    checkText(file, "本文", parsed.content);
  }
}

/* ── 2. Kinda story（同意整合性） ───────────────────────── */

async function checkStories() {
  let STORIES;
  try {
    // Node 22.18+ はデフォルトで TS の型を剥がして import できる（stories.ts は import なしの自己完結ファイル）
    ({ STORIES } = await import(pathToFileURL(STORIES_TS).href));
  } catch {
    warn("src/lib/mock/stories.ts", "TS import 不可のため同意整合性チェックをスキップ（テキスト検査のみ実施）");
    checkText("src/lib/mock/stories.ts", "全文", fs.readFileSync(STORIES_TS, "utf8"));
    return;
  }
  const file = "src/lib/mock/stories.ts";
  const ids = new Set();
  for (const s of STORIES) {
    const tag = `story「${s.id}」`;
    if (ids.has(s.id)) err(file, `${tag}: id が重複`);
    ids.add(s.id);
    if (!s.consent) {
      warn(file, `${tag}: consent（掲載同意の記録）がない。Part 0 の同意記録を必ず残す`);
    } else if (s.consent.agency === false && (s.agencyName || s.counselorName)) {
      err(file, `${tag}: 相談所名の同意なし（consent.agency=false）なのに agencyName/counselorName が入っている`);
    }
    walkStrings(file, tag, {
      quote: s.quote, title: s.title, body: s.body, pullQuote: s.pullQuote,
      faq: s.faq, tags: s.tags, status: s.status, periodLabel: s.periodLabel,
    });
  }
}

/* ── 3. 禁止構造化データ（Story は Article+FAQPage のみ） ── */

function checkStorySchema() {
  if (!fs.existsSync(STORY_APP_DIR)) return;
  const stack = [STORY_APP_DIR];
  while (stack.length) {
    const dir = stack.pop();
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { stack.push(p); continue; }
      if (!/\.(tsx?|jsx?)$/.test(e.name)) continue;
      const src = fs.readFileSync(p, "utf8");
      for (const bad of ['"Review"', '"AggregateRating"', "aggregateRating", "reviewRating"])
        if (src.includes(bad))
          err(path.relative(ROOT, p), `禁止の構造化データ ${bad} を検出（Story は Article+FAQPage のみ＝ステマ規制対応）`);
    }
  }
}

/* ── 実行 ──────────────────────────────────────────────── */

if (process.argv.includes("--list")) {
  console.log(`チェック項目:
  [error] 絵文字（コラム本文・frontmatter・story 全テキスト）
  [error] 「中立」の使用
  [error] story: consent.agency=false なのに相談所名/カウンセラー名あり
  [error] story: id 重複
  [error] kinda-story 配下に Review/AggregateRating 構造化データ
  [error] コラム frontmatter 必須項目（${COLUMN_REQUIRED.join(", ")}）
  [warn]  焦らせ・比較・「異性」表現
  [warn]  description 160字超 / atomicAnswer・faq なし / story consent 記録なし`);
  process.exit(0);
}

checkColumns();
checkStorySchema();
await checkStories();

for (const w of warns) console.log(`⚠ warn  ${w}`);
for (const e of errors) console.log(`✗ error ${e}`);
console.log(`\nQA結果: error ${errors.length} 件 / warn ${warns.length} 件`);
if (errors.length) {
  console.log("→ error を修正してから公開してください（ルールの正は CLAUDE.md）。");
  process.exit(1);
}
console.log("→ 公開可能な状態です（warn は文脈判断のうえ必要なら修正）。");
