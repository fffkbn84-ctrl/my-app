/**
 * src/lib/pair/buildText.ts
 *
 * 結果画面の「コピー」用テキストを組み立てる。
 * フォーマットは実装指示書 §3 の持ち出し機能に合わせる（絵文字なし）。
 */

import { PAIR_TOPICS, type PairState, type PairTopic } from "./topics";

const RULE = "━━━━━━━━━━━━━";

/** want の話題だけを定義順で返す */
export function wantTopics(states: Record<string, PairState>): PairTopic[] {
  return PAIR_TOPICS.filter((t) => states[t.key] === "want");
}

export function buildPairText(states: Record<string, PairState>): string {
  const want = wantTopics(states);

  const lines: string[] = [RULE, "Kinda pair", RULE, "", "【まだ話していないこと】", ""];

  if (want.length === 0) {
    lines.push("・いまのところ、ありません");
  } else {
    for (const t of want) {
      lines.push(`・${t.title}`);
      lines.push(`  「${t.ask}」`);
      lines.push("");
    }
    lines.pop();
  }

  lines.push("", RULE, "kinda.jp/kinda-pair");

  return lines.join("\n");
}
