/**
 * 全20タイプの天気解説データ
 *
 * 用途:
 * 1. Kinda note 結果画面の summary 直下に表示
 * 2. /note/weather/[slug] の SEO 用解説ページのコンテンツ
 * 3. 将来の DB 移行時に、そのまま seed データとして使える形
 */

export type WeatherKey =
  // pre
  | "morning_mist"
  | "pre_dawn"
  | "flower_overcast"
  // waiting
  | "light_rain_start"
  | "light_rain"
  | "rain_cloud"
  | "thunderstorm"
  // omiai
  | "sun_break"
  | "angels_ladder"
  | "windy_day"
  // date1
  | "light_sunrise"
  | "wandering_clouds"
  | "cold_wind"
  // multiple
  | "windy_sunshine"
  | "faint_sunlight"
  | "twilight"
  // kousai
  | "sunrise"
  | "dissonance_wind"
  | "quiet_overcast"
  | "mist";

export type RouteKey =
  | "pre"
  | "waiting"
  | "omiai"
  | "date1"
  | "multiple"
  | "kousai";

export type WeatherDescription = {
  /** 天気のキー（URLスラッグにも使う） */
  key: WeatherKey;
  /** 日本語名（表示用） */
  name_ja: string;
  /** 英語名（SEO用補助） */
  name_en: string;
  /** 所属するルート */
  route: RouteKey;
  /** 結果画面に表示する詩的な解説（40-60文字、2文構成） */
  description: string;
  /** タイプ名（Kinda 〇〇 の〇〇部分） */
  type_name: string;
  /** SEO 解説ページ用 meta description（80-120文字、フェーズ B で追加） */
  seo_description?: string;
};

export const WEATHER_DESCRIPTIONS: Record<WeatherKey, WeatherDescription> = {
  // ─── preルート（3タイプ） ──────────────────────
  morning_mist: {
    key: "morning_mist",
    name_ja: "朝もや",
    name_en: "Morning Mist",
    route: "pre",
    type_name: "朝もや",
    description:
      "やわらかな霧が世界の輪郭をほどく朝。\nすべてがまだ決まっていない、その白さの中にあなたはいます。",
  },
  pre_dawn: {
    key: "pre_dawn",
    name_ja: "夜明け前",
    name_en: "Pre-Dawn",
    route: "pre",
    type_name: "夜明け前",
    description:
      "一日でいちばん深い闇のあと、\n空がしずかに色を持ちはじめる時間。その境目にあなたはいます。",
  },
  flower_overcast: {
    key: "flower_overcast",
    name_ja: "花曇り",
    name_en: "Flower Overcast",
    route: "pre",
    type_name: "花曇り",
    description:
      "桜の咲く頃、空がうすく曇る日のこと。\n華やかさと静けさが同居する、その光の下にあなたはいます。",
  },

  // ─── waitingルート（4タイプ） ─────────────────
  light_rain_start: {
    key: "light_rain_start",
    name_ja: "降り始め",
    name_en: "Light Rain Start",
    route: "waiting",
    type_name: "降り始め",
    description:
      "ぽつり、と最初のひと粒が落ちる瞬間。\nこれから何が来るのか、まだ誰も知らない時間にあなたはいます。",
  },
  light_rain: {
    key: "light_rain",
    name_ja: "小雨",
    name_en: "Light Rain",
    route: "waiting",
    type_name: "小雨",
    description:
      "傘をさすほどでもない、やさしい雨の日。\n音もなく地面を濡らしていく、そのしずかさの中にあなたはいます。",
  },
  rain_cloud: {
    key: "rain_cloud",
    name_ja: "雨雲",
    name_en: "Rain Cloud",
    route: "waiting",
    type_name: "雨雲",
    description:
      "空が低く、重たい色を抱えている時間。\nまだ降り出さない雲の下、その息をひそめた静けさにあなたはいます。",
  },
  thunderstorm: {
    key: "thunderstorm",
    name_ja: "雷雨",
    name_en: "Thunderstorm",
    route: "waiting",
    type_name: "雷雨",
    description:
      "空が音を立てて、自分の中のものを放つ夜。\n通り過ぎたあとに澄んだ空気が残る、その嵐の中にあなたはいます。",
  },

  // ─── omiaiルート（3タイプ） ───────────────────
  sun_break: {
    key: "sun_break",
    name_ja: "晴れ間",
    name_en: "Sun Break",
    route: "omiai",
    type_name: "晴れ間",
    description:
      "雲の切れ目から、まっすぐに光が差し込む瞬間。\n世界が少しだけ明るく見える、そのまぶしさの中にあなたはいます。",
  },
  angels_ladder: {
    key: "angels_ladder",
    name_ja: "天使の梯子",
    name_en: "Angel's Ladder",
    route: "omiai",
    type_name: "天使の梯子",
    description:
      "雲の隙間から、幾筋もの光が静かに降りる現象。\n確信ではなく予感のような、そのやわらかな光の中にあなたはいます。",
  },
  windy_day: {
    key: "windy_day",
    name_ja: "風の日",
    name_en: "Windy Day",
    route: "omiai",
    type_name: "風の日",
    description:
      "草も木も、すべてが同じ方向にゆれる日。\n心の中の何かが小さく動いている、その風の中にあなたはいます。",
  },

  // ─── date1ルート（3タイプ） ───────────────────
  light_sunrise: {
    key: "light_sunrise",
    name_ja: "淡い朝焼け",
    name_en: "Light Sunrise",
    route: "date1",
    type_name: "淡い朝焼け",
    description:
      "夜が明けるとき、空がそっと桃色をまとう時間。\nまだ太陽は昇りきらない、そのほのかな色の中にあなたはいます。",
  },
  wandering_clouds: {
    key: "wandering_clouds",
    name_ja: "迷い雲",
    name_en: "Wandering Clouds",
    route: "date1",
    type_name: "迷い雲",
    description:
      "ゆっくりと形を変えながら流れていく雲。\nどこへ行くかは決まっていない、そのたゆたう空の下にあなたはいます。",
  },
  cold_wind: {
    key: "cold_wind",
    name_ja: "冷たい風",
    name_en: "Cold Wind",
    route: "date1",
    type_name: "冷たい風",
    description:
      "頬にあたると、ふと我に返るような風。\n熱だけでは進めないことを教える、そのつめたさの中にあなたはいます。",
  },

  // ─── multipleルート（3タイプ） ────────────────
  windy_sunshine: {
    key: "windy_sunshine",
    name_ja: "風の強い晴れ",
    name_en: "Windy Sunshine",
    route: "multiple",
    type_name: "風の強い晴れ",
    description:
      "日差しは明るいのに、風が止まらない日。\n光と揺らぎが同時にある、そのまぶしくも忙しない空にあなたはいます。",
  },
  faint_sunlight: {
    key: "faint_sunlight",
    name_ja: "薄日",
    name_en: "Faint Sunlight",
    route: "multiple",
    type_name: "薄日",
    description:
      "雲ごしに、やわらかく届く太陽の光。\n強くはないけれど確かにそこにある、そのおだやかな明るさの中にあなたはいます。",
  },
  twilight: {
    key: "twilight",
    name_ja: "夕暮れ",
    name_en: "Twilight",
    route: "multiple",
    type_name: "夕暮れ",
    description:
      "空が一日でいちばんゆたかな色を見せる時間。\n明るさと暗さが混ざりあう、その揺らぎの中にあなたはいます。",
  },

  // ─── kousaiルート（4タイプ） ─────────────────
  sunrise: {
    key: "sunrise",
    name_ja: "朝焼け",
    name_en: "Sunrise",
    route: "kousai",
    type_name: "朝焼け",
    description:
      "夜が完全にあけて、空が燃えるように色づく瞬間。\n一日のはじまりを告げる、そのあざやかな光の中にあなたはいます。",
  },
  dissonance_wind: {
    key: "dissonance_wind",
    name_ja: "違和感の風",
    name_en: "Dissonance Wind",
    route: "kousai",
    type_name: "違和感の風",
    description:
      "草が思いがけない方向に揺れる、そんな風の日。\n理由はまだ言葉にならない、その小さなざわめきの中にあなたはいます。",
  },
  quiet_overcast: {
    key: "quiet_overcast",
    name_ja: "静かな曇り",
    name_en: "Quiet Overcast",
    route: "kousai",
    type_name: "静かな曇り",
    description:
      "強い光も雨もない、ただ静かに灰色の空が続く日。\n何かが足りないわけではない、そのおだやかな曇り空の下にあなたはいます。",
  },
  mist: {
    key: "mist",
    name_ja: "霧",
    name_en: "Mist",
    route: "kousai",
    type_name: "霧",
    description:
      "近くのものすら輪郭がぼやけて見える朝。\n先が見えないのではなく、いま見えるものを大切にする、その霧の中にあなたはいます。",
  },
};

/**
 * 天気キーから解説データを取得
 */
export function getWeatherDescription(
  key: WeatherKey
): WeatherDescription {
  return WEATHER_DESCRIPTIONS[key];
}

/**
 * ルート別に天気タイプ一覧を取得（SEO 用一覧ページで使用）
 */
export function getWeathersByRoute(route: RouteKey): WeatherDescription[] {
  return Object.values(WEATHER_DESCRIPTIONS).filter((w) => w.route === route);
}

/**
 * 全天気タイプを配列で取得（/note/weather 一覧ページで使用）
 */
export function getAllWeathers(): WeatherDescription[] {
  return Object.values(WEATHER_DESCRIPTIONS);
}
