import type { WeatherKey } from "./weatherDescriptions";

/**
 * Kinda note「今日の天気」（毎日モード）。2026-10-03 ふうか案 → 入口の主役に。
 * 仕様の正は docs/specs/kinda-note-daily-weather.md
 *
 * - 聞くのは「自分の」今日の気持ちだけ（自分軸）。段階・相手・原因は聞かない
 * - 天気は選ばせない。答えた気持ちから天気が返ってくる
 * - 点数・前日比・良し悪しの判定を出さない
 * - 回答は端末にだけ残す（サーバーへは天気名のみ計測）
 */

export type DailyOption = { id: string; label: string };

export type DailyQuestion = {
  id: "feeling" | "size" | "want";
  text: string;
  options: DailyOption[];
};

export const DAILY_QUESTIONS: DailyQuestion[] = [
  {
    id: "feeling",
    text: "今日のあなたに、いちばん近い気持ちは？",
    options: [
      { id: "glad", label: "うれしかった" },
      { id: "relief", label: "ほっとしていた" },
      { id: "flutter", label: "どきどき・そわそわしていた" },
      { id: "foggy", label: "もやもやしていた" },
      { id: "anxious", label: "不安だった" },
      { id: "lonely", label: "さみしかった" },
      { id: "restless", label: "いらいら・ざわざわしていた" },
      { id: "tired", label: "くたびれていた" },
      { id: "unknown", label: "よくわからない" },
    ],
  },
  {
    id: "size",
    text: "その気持ちは、どのくらい？",
    options: [
      { id: "full", label: "胸いっぱいだった" },
      { id: "little", label: "すこしだけ" },
      { id: "passing", label: "もう、通り過ぎかけている" },
    ],
  },
  {
    id: "want",
    text: "いまの自分に、近いのは？",
    options: [
      { id: "out", label: "外に出したい（話したい・書きたい）" },
      { id: "quiet", label: "ひとりで、静かにしていたい" },
      { id: "move", label: "すこしだけ、動いてみたい" },
      { id: "stay", label: "このままで、いたい" },
    ],
  },
];

export type FeelingId =
  | "glad" | "relief" | "flutter" | "foggy" | "anxious"
  | "lonely" | "restless" | "tired" | "unknown";

/**
 * 気持ち × 大きさ → 天気。
 * 「胸いっぱい」は濃い方、「すこしだけ」「通り過ぎかけている」は淡い方。
 * いまある20の天気とカード画像を使う（新しい天気は画像ができてから足す。spec §3）。
 */
const WEATHER_MAP: Record<FeelingId, { full: WeatherKey; light: WeatherKey }> = {
  glad: { full: "sunrise", light: "light_sunrise" },               // 朝焼け / 淡い朝焼け
  relief: { full: "sun_break", light: "faint_sunlight" },          // 晴れ間 / 薄日
  flutter: { full: "windy_sunshine", light: "angels_ladder" },     // 風の強い晴れ / 天使の梯子
  foggy: { full: "mist", light: "morning_mist" },                  // 霧 / 朝もや
  anxious: { full: "rain_cloud", light: "light_rain_start" },      // 雨雲 / 降り始め
  lonely: { full: "light_rain", light: "twilight" },               // 小雨 / 夕暮れ
  restless: { full: "thunderstorm", light: "dissonance_wind" },    // 雷雨 / 違和感の風
  tired: { full: "pre_dawn", light: "quiet_overcast" },            // 夜明け前 / 静かな曇り
  unknown: { full: "wandering_clouds", light: "flower_overcast" }, // 迷い雲 / 花曇り
};

export function decideDailyWeather(feeling: string, size: string): WeatherKey {
  const pair = WEATHER_MAP[feeling as FeelingId] ?? WEATHER_MAP.unknown;
  return size === "full" ? pair.full : pair.light;
}

/** 「通り過ぎかけている」を選んだときだけ、天気の下に添える一文 */
export const PASSING_NOTE = "この天気は、もう通り過ぎかけています。";

/**
 * 今日、ひとつだけ。「いまの自分に近いのは？」ごとに3本。日付で回す（毎日来ても同じ文が続かないように）。
 * 条件：実際にできる小さなこと／急かさない／相手の有無・性別を前提にしない／絵文字なし
 */
const TODAY_ONE: Record<string, string[]> = {
  out: [
    "今日の気持ちを、ひとことだけ誰かに送ってみる。",
    "今日あったことを、三行だけ書き出してみる。",
    "声に出して、ひとりごとで言ってみる。それだけでも外に出る。",
  ],
  quiet: [
    "今日は予定をひとつ減らして、早めに灯りを落とす。",
    "温かい飲みものを一杯、ゆっくり飲む時間をつくる。",
    "スマホを置いて、10分だけ何もしない時間をつくる。",
  ],
  move: [
    "気になっていたことをひとつだけ、5分だけやってみる。",
    "いつもと違う道を通って帰ってみる。",
    "先のばしにしていた連絡を、ひとつだけ返してみる。",
  ],
  stay: [
    "今日の天気を、そのまま覚えておく。それだけで十分。",
    "今日いちばんよかった瞬間を、ひとつだけ思い出しておく。",
    "何も変えなくていい日。そのまま眠る。",
  ],
};

export function getDailyTodayOne(want: string, date = new Date()): string {
  const list = TODAY_ONE[want] ?? TODAY_ONE.stay;
  const start = new Date(date.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  return list[dayOfYear % list.length];
}

export function getDailyLabel(qid: DailyQuestion["id"], optionId: string): string {
  const q = DAILY_QUESTIONS.find((x) => x.id === qid);
  return q?.options.find((o) => o.id === optionId)?.label ?? "";
}
