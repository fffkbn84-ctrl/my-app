import type { RouteKey } from "../data/weatherDescriptions";
import { ROUTE_LABEL, getQuestionsForRoute } from "../data/questions";

/**
 * 結果画面の「この気持ちを、そのまま渡す」（メモコピー機能）で
 * クリップボードに乗せるテキストを組み立てる。
 *
 * フォーマットは v3 設計書に従う：
 *
 *   ━━━━━━━━━━━━━
 *   Kinda note
 *   ━━━━━━━━━━━━━
 *
 *   【結果】Kinda 〇〇
 *   【状況】（ルート名）
 *   【選んだ項目】
 *   ・（選択項目1）
 *   ・（選択項目2）
 *   【自由記述】（あれば）
 *   「（本文）」
 *
 *   ━━━━━━━━━━━━━
 *   生成日時：YYYY/MM/DD HH:mm
 *   kinda.futarive.jp
 */

const SEP = "━━━━━━━━━━━━━";

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  return `${y}/${m}/${day} ${hh}:${mm}`;
}

export type MemoInput = {
  /** "Kinda 朝もや" */
  fullName: string;
  route: RouteKey;
  answers: Record<string, string[]>;
  freeTexts: Record<string, string>;
};

export function buildMemoText(input: MemoInput): string {
  const lines: string[] = [];

  lines.push(SEP);
  lines.push("Kinda note");
  lines.push(SEP);
  lines.push("");

  lines.push(`【結果】${input.fullName}`);
  lines.push("");

  lines.push(`【状況】${ROUTE_LABEL[input.route]}`);
  lines.push("");

  const questions = getQuestionsForRoute(input.route);
  const itemLines: string[] = [];
  const freeTextEntries: { qLabel: string; text: string }[] = [];

  for (const q of questions) {
    if (q.type === "text") {
      const text = (input.freeTexts[q.id] ?? "").trim();
      if (text.length > 0) {
        freeTextEntries.push({ qLabel: q.text, text });
      }
      continue;
    }
    const ids = input.answers[q.id] ?? [];
    if (ids.length === 0) continue;
    for (const id of ids) {
      const label = q.options?.[id];
      if (label) itemLines.push(`・${label}`);
    }
  }

  if (itemLines.length > 0) {
    lines.push("【選んだ項目】");
    lines.push(...itemLines);
    lines.push("");
  }

  if (freeTextEntries.length > 0) {
    lines.push("【自由記述】");
    for (const e of freeTextEntries) {
      lines.push(`「${e.text}」`);
    }
    lines.push("");
  }

  lines.push(SEP);
  lines.push(`生成日時：${formatDate(new Date())}`);
  lines.push("kinda.futarive.jp");

  return lines.join("\n");
}
