import { getTypeContent } from "./typeContent";
import { WEATHER_DESCRIPTIONS, type WeatherKey } from "./weatherDescriptions";

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

// ─── 毎日モード専用の天気 ──────────────────────────────────────────────────
// 段階の note の20天気（WeatherKey）とは別に持つ。段階ごとの解説ページ（/note/weather）や
// 結果の第1〜3層を持たないため、WeatherKey には混ぜない。画像は public/images/w_<key>.webp

export type DailyOnlyWeatherKey = "calm" | "after_rain" | "sun_shower" | "moonlit_night";
/** カード・履歴で扱う天気（段階の20＋毎日専用） */
export type CardWeatherKey = WeatherKey | DailyOnlyWeatherKey;

export type CardWeather = {
  key: CardWeatherKey;
  name_ja: string;
  name_en: string;
  /** 詩的な2文（\n 区切り）。段階の20天気は WEATHER_DESCRIPTIONS の description と同じ */
  description: string;
  color: string;
};

const DAILY_ONLY_WEATHERS: Record<DailyOnlyWeatherKey, Omit<CardWeather, "key">> = {
  calm: {
    name_ja: "凪",
    name_en: "Calm",
    description:
      "風も波も止まって、水面が空をそのまま映している時間。\n何も起きないことが、ちゃんと満ちている。その静けさの中にあなたはいます。",
    color: "#8E9FAF",
  },
  after_rain: {
    name_ja: "雨上がり",
    name_en: "After Rain",
    description:
      "雨が止んで、地面にまだ水たまりが残っている時間。\n濡れたものが、少しずつ光を返しはじめている。その途中にあなたはいます。",
    color: "#9FB0BC",
  },
  sun_shower: {
    name_ja: "天気雨",
    name_en: "Sun Shower",
    description:
      "晴れているのに、雨がぱらぱら降ってくる空。\n光をつかまえた雨粒で、まわりの空気までちょっときらきらしている。そんな空の下にあなたはいます。",
    color: "#D8B870",
  },
  moonlit_night: {
    name_ja: "月夜",
    name_en: "Moonlit Night",
    description:
      "灯りを落とした夜に、月だけが静かに出ている空。\n誰にも見せなくていい時間を、やわらかい光が照らしています。",
    color: "#4A5675",
  },
};

export function getCardWeather(key: string): CardWeather | null {
  if (key in DAILY_ONLY_WEATHERS) {
    return { key: key as DailyOnlyWeatherKey, ...DAILY_ONLY_WEATHERS[key as DailyOnlyWeatherKey] };
  }
  const w = WEATHER_DESCRIPTIONS[key as WeatherKey];
  if (!w) return null;
  return {
    key: w.key,
    name_ja: w.name_ja,
    name_en: w.name_en,
    description: w.description,
    color: getTypeContent(w.key)?.color ?? "#D4A090",
  };
}

/** 画像ファイル名（dissonance_wind だけ w_uneasy_wind） */
export function cardImageFile(key: CardWeatherKey): string {
  return key === "dissonance_wind" ? "w_uneasy_wind" : `w_${key}`;
}

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
      { id: "calm", label: "とくに何もない、おだやかな日だった" },
      { id: "flutter", label: "どきどき・そわそわしていた" },
      { id: "foggy", label: "もやもやしていた" },
      { id: "anxious", label: "不安だった" },
      { id: "lonely", label: "さみしかった" },
      { id: "restless", label: "いらいら・ざわざわしていた" },
      { id: "tired", label: "くたびれていた" },
      { id: "mixed", label: "いろいろ混ざっていた" },
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
  | "glad" | "relief" | "calm" | "flutter" | "foggy" | "anxious"
  | "lonely" | "restless" | "tired" | "mixed" | "unknown";

/**
 * 気持ち × 大きさ → 天気。
 * 「胸いっぱい」は濃い方、「すこしだけ」「通り過ぎかけている」は淡い方。
 * 雨上がり・月夜は Q2/Q3 との組み合わせで decideDailyWeather が先に決める（spec §3-b）。
 */
const WEATHER_MAP: Record<FeelingId, { full: CardWeatherKey; light: CardWeatherKey }> = {
  glad: { full: "sunrise", light: "light_sunrise" },               // 朝焼け / 淡い朝焼け
  relief: { full: "sun_break", light: "faint_sunlight" },          // 晴れ間 / 薄日
  calm: { full: "calm", light: "calm" },                           // 凪（大きさは聞かない）
  flutter: { full: "windy_sunshine", light: "angels_ladder" },     // 風の強い晴れ / 天使の梯子
  foggy: { full: "mist", light: "morning_mist" },                  // 霧 / 朝もや
  anxious: { full: "rain_cloud", light: "light_rain_start" },      // 雨雲 / 降り始め
  lonely: { full: "light_rain", light: "twilight" },               // 小雨 / 夕暮れ
  restless: { full: "thunderstorm", light: "dissonance_wind" },    // 雷雨 / 違和感の風
  tired: { full: "pre_dawn", light: "quiet_overcast" },            // 夜明け前 / 静かな曇り
  mixed: { full: "sun_shower", light: "sun_shower" },              // 天気雨（晴れと雨がいっしょ。きらきらして少しはしゃぐ空）
  unknown: { full: "wandering_clouds", light: "flower_overcast" }, // 迷い雲 / 花曇り
};

/** 大きさを聞かない気持ち（「何もない」に大きさは無いので Q2 を飛ばす） */
export const SKIP_SIZE_FEELINGS = ["calm"];

/** 「もう、通り過ぎかけている」で雨上がりになる気持ち（重さのある気持ちが抜けていくところ）。
 *  うれしい・ほっとした・どきどきが通り過ぎるのは雨上がりではないので、淡い天気＋PASSING_NOTE のまま */
const AFTER_RAIN_FEELINGS = ["foggy", "anxious", "lonely", "restless", "tired", "mixed"];

export function decideDailyWeather(feeling: string, size: string, want?: string): CardWeatherKey {
  if (size === "passing" && AFTER_RAIN_FEELINGS.includes(feeling)) return "after_rain";
  // くたびれた（すこしだけ）× ひとりで静かにしていたい → 月夜（時刻では分けない）
  if (feeling === "tired" && size === "little" && want === "quiet") return "moonlit_night";
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
