import type { WeatherKey, RouteKey } from "../data/weatherDescriptions";

/**
 * v3 設計書の分岐ロジックを、既存の質問フロー（option ID 形式）に対応させた実装。
 *
 * 既存 quiz では各選択肢が単一文字 ID（a/b/c/...）で保存されているため、
 * v3 の「ラベル文字列でマッチング」するロジックを「ID でマッチング」に置き換えている。
 *
 * Q2-pre は v3 で 8 択（料金を 3 分解）だが、現行は 6 択。
 * 暫定的に pre_q2.a を「料金関連の不安」として扱い、info カウントは 1 として数える。
 * 質問側の3分解パッチ後に下記の `INFO_PRE_IDS` を更新する。
 */

export type Answers = Record<string, string[]>;

// ─── pre ────────────────────────────────────────────────────────────────────

/**
 * pre_q2 で「情報不足」系として扱う option ID。
 * v3：相場 / 続けられるか / 結果出なかったら / どんな人 / 抵抗感（の5項目）
 * 現行：a 料金（3項目を集約）/ d どんな人 / e 抵抗感
 */
const INFO_PRE_IDS = ["a", "d", "e"];

/**
 * pre_q2 で「自信不足」系として扱う option ID。
 * v3：自分に合うカウンセラー / 相手が見つかるか
 * 現行：b / c
 */
const CONFIDENCE_PRE_IDS = ["b", "c"];

export function decidePreType(answers: Answers): WeatherKey {
  const reasons = answers["pre_q2"] ?? [];
  const infoCount = reasons.filter((r) => INFO_PRE_IDS.includes(r)).length;
  const confCount = reasons.filter((r) => CONFIDENCE_PRE_IDS.includes(r)).length;

  // 優先順位：自信不足 > 情報不足 > 慎重型
  if (confCount >= 2) return "pre_dawn"; // 夜明け前
  if (infoCount >= 2 && confCount <= 1) return "morning_mist"; // 朝もや
  return "flower_overcast"; // 花曇り
}

// ─── waiting ────────────────────────────────────────────────────────────────

export function decideWaitingType(answers: Answers): WeatherKey {
  const period = (answers["wait_q1"] ?? [])[0];
  switch (period) {
    case "a":
      return "light_rain_start"; // 1ヶ月以内
    case "b":
      return "light_rain"; // 1〜3ヶ月
    case "c":
      return "rain_cloud"; // 3〜6ヶ月
    case "d":
      return "thunderstorm"; // 半年以上
    default:
      return "light_rain"; // フォールバック
  }
}

// ─── omiai ──────────────────────────────────────────────────────────────────

// 印象（omiai_q3）の正負分類
// a 思ってたより話しやすかった ★ポジ
// b 見た目が思ってたのと少し違った ★ネガ
// c 会話がすごく盛り上がった ★ポジ
// d 沈黙が気になった ★ネガ
// e ドキドキした瞬間があった ★ポジ
// f ときめきはなかったけど悪くなかった
// g なんとなく違う気がした ★ネガ
// h なんか良さそうだった ★ポジ
// i 特に印象に残らなかった ★ネガ
const OMIAI_POSITIVE_IDS = ["a", "c", "e", "h"];
const OMIAI_NEGATIVE_IDS = ["b", "d", "g", "i"];

export function decideOmiaiType(answers: Answers): WeatherKey {
  const meetAgain = (answers["omiai_q2"] ?? [])[0]; // a/b/c/d
  const impressions = answers["omiai_q3"] ?? [];

  const hasPositive = impressions.some((i) => OMIAI_POSITIVE_IDS.includes(i));
  const negativeCount = impressions.filter((i) =>
    OMIAI_NEGATIVE_IDS.includes(i)
  ).length;

  // 【重要】ネガティブ2つ以上でポジティブ判定をオーバーライド
  if (negativeCount >= 2) {
    if (meetAgain === "c" || meetAgain === "b") return "angels_ladder";
    if (meetAgain === "d") return "windy_day";
    return "angels_ladder";
  }

  if (meetAgain === "a" || hasPositive) return "sun_break"; // 晴れ間
  if (meetAgain === "b" || meetAgain === "c") return "angels_ladder"; // 天使の梯子
  return "windy_day"; // 風の日
}

// ─── date1 ──────────────────────────────────────────────────────────────────
// 注：date1 ルートは現行 quiz には未実装。将来追加された時に動くよう、ID ベースで実装。

const DATE1_NEGATIVE_IDS = ["a", "b", "c", "f"]; // 沈黙/ペース/価値観/マナー

export function decideDate1Type(answers: Answers): WeatherKey {
  const feeling = (answers["date1_q2"] ?? [])[0]; // a/b/c/d/e
  const nextStep = (answers["date1_q3"] ?? [])[0]; // a/b/c/d
  const concerns = answers["date1_q4"] ?? [];

  const negativeCount = concerns.filter((c) =>
    DATE1_NEGATIVE_IDS.includes(c)
  ).length;

  // 明確なネガティブは冷たい風優先
  if (nextStep === "d" || feeling === "d") return "cold_wind";

  // ネガティブ2つ以上でポジティブ判定をオーバーライド
  if (negativeCount >= 2) return "wandering_clouds";

  // ポジティブ判定
  if (feeling === "a" || feeling === "c" || nextStep === "a") {
    return "light_sunrise";
  }

  return "wandering_clouds";
}

// ─── kousai ─────────────────────────────────────────────────────────────────

// kousai_q1 single（雰囲気）：a 楽しい / b 普通 / c なんとなくぎこちない / d 会うのが少し億劫
// kousai_q2 multi（気になる）：
//  a 価値観や習慣が違う / b 会話が盛り上がらない
//  c 相手の気持ち / d 自分の気持ち
//  e このまま進んでいいのか不安 / f 好きで次のステップ
//  g 相手が自分をどう / h 順調

export function decideKousaiType(answers: Answers): WeatherKey {
  const worries = answers["kousai_q2"] ?? [];
  const atmosphere = (answers["kousai_q1"] ?? [])[0];

  const hasPositive = worries.includes("f");
  // 「億劫」：会うこと自体が重い（c なんとなくぎこちない / d 億劫）
  const hasOukkyuu = atmosphere === "c" || atmosphere === "d";
  // 「違和感」：価値観や会話のズレ（a / b）
  const hasIwakan = worries.includes("a") || worries.includes("b");
  // 「疲れ」：気持ちの不明瞭さ（d 自分の気持ち / e このまま不安）を疲労シグナルとして扱う
  const hasTired = worries.includes("d") || worries.includes("e");
  // 「迷い」：気持ちがはっきりしない
  const hasMayoi = worries.includes("e") || worries.includes("d");

  const negativeCount = [hasOukkyuu, hasIwakan, hasTired, hasMayoi].filter(
    Boolean
  ).length;

  // 【重要】ネガティブ2つ以上で positive 判定をオーバーライド
  if (hasPositive && negativeCount <= 1) return "sunrise"; // 朝焼け
  if (hasOukkyuu || hasIwakan) return "dissonance_wind"; // 違和感の風
  if (hasTired) return "quiet_overcast"; // 静かな曇り
  return "mist"; // 霧
}

// ─── multiple ───────────────────────────────────────────────────────────────

// mu_q3 multi（気持ち）：
//  a 絞りたいけど決められない / b 比べてしまって罪悪感
//  c 同時に会い続けるのが疲れてきた / d もっと合う人がいそう
//  e 新しいお見合いも続いていて消耗 / f 婚活自体しんどい
//  g 特にしんどくない、整理したいだけ

export function decideMultipleType(answers: Answers): WeatherKey {
  const worries = answers["mu_q3"] ?? [];

  const hasTired =
    worries.includes("c") || worries.includes("e") || worries.includes("f");
  const hasLoop =
    worries.includes("d") || worries.includes("a");

  if (hasTired) return "twilight"; // 夕暮れ
  if (hasLoop) return "windy_sunshine"; // 風の強い晴れ
  return "faint_sunlight"; // 薄日
}

// ─── ルート全体のディスパッチ ───────────────────────────────────────────────

export function decideTypeForRoute(
  route: RouteKey,
  answers: Answers
): WeatherKey {
  switch (route) {
    case "pre":
      return decidePreType(answers);
    case "waiting":
      return decideWaitingType(answers);
    case "omiai":
      return decideOmiaiType(answers);
    case "date1":
      return decideDate1Type(answers);
    case "kousai":
      return decideKousaiType(answers);
    case "multiple":
      return decideMultipleType(answers);
  }
}
