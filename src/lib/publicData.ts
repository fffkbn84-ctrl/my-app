/**
 * src/lib/publicData.ts
 *
 * 公的機関が公表した統計データの引用レジストリ。
 * YMYL（婚活・恋愛）領域では一次情報・公的データの根拠引用が
 * E-E-A-T 評価に直結するため、ここで「検証済みの数値」と「出典」を一元管理する。
 *
 * 重要：このファイルに載せる数値は、必ず公的機関の公表値そのものであること。
 * 推測・概算・私企業の調査は載せない。更新時は出典 URL の最新版を確認すること。
 */

export type PublicDataSource = {
  id: string;
  /** 引用する事実の要約（本文・出典カード表示用） */
  fact: string;
  /** 数値部分（強調表示用） */
  highlight: string;
  /** 公表元の組織名 */
  org: string;
  /** 調査・統計の正式名称 */
  surveyName: string;
  /** 調査年・公表年 */
  year: string;
  /** 出典 URL（公的機関の公式ページ） */
  url: string;
  /** 編集部が参照・確認した日 */
  retrieved: string;
};

export const PUBLIC_DATA: Record<string, PublicDataSource> = {
  marriage_count_2024: {
    id: "marriage_count_2024",
    fact: "2024年（令和6年）の婚姻件数は48万5,063組で、2年ぶりに増加しました。",
    highlight: "48万5,063組（2年ぶり増加）",
    org: "厚生労働省",
    surveyName: "令和6年（2024）人口動態統計（確定数）の概況",
    year: "2024年",
    url: "https://www.mhlw.go.jp/toukei/saikin/hw/jinkou/kakutei24/index.html",
    retrieved: "2026年5月14日",
  },
  first_marriage_age_2024: {
    id: "first_marriage_age_2024",
    fact: "2024年（令和6年）の平均初婚年齢は、夫が31.1歳、妻が29.8歳でした。",
    highlight: "夫 31.1歳・妻 29.8歳",
    org: "厚生労働省",
    surveyName: "令和6年（2024）人口動態統計（確定数）の概況",
    year: "2024年",
    url: "https://www.mhlw.go.jp/toukei/saikin/hw/jinkou/kakutei24/index.html",
    retrieved: "2026年5月14日",
  },
  intention_to_marry_2021: {
    id: "intention_to_marry_2021",
    fact: "18〜34歳の独身者のうち「いずれ結婚するつもり」と答えた人は、男性81.4%・女性84.3%にのぼります。",
    highlight: "男性 81.4%・女性 84.3%",
    org: "国立社会保障・人口問題研究所",
    surveyName: "第16回出生動向基本調査（2021年）",
    year: "2021年",
    url: "https://www.ipss.go.jp/ps-doukou/j/doukou16/doukou16_gaiyo.asp",
    retrieved: "2026年5月14日",
  },
};

/** ID 配列から有効な PublicDataSource 配列を返す（不正な ID は無視） */
export function getPublicData(ids: string[] | undefined): PublicDataSource[] {
  if (!ids || ids.length === 0) return [];
  return ids
    .map((id) => PUBLIC_DATA[id])
    .filter((s): s is PublicDataSource => Boolean(s));
}
