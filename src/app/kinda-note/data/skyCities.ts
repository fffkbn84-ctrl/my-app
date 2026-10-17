import type { CardWeatherKey } from "./daily";

/**
 * 空の手帳（note today の「今日の空は〇〇へ」）。2026-10-15 ふうか決定。
 * 設計の正は docs/research/2026-10-12-shohyo-tokyo-ugoki.md §5
 *
 * - 街は天気から決まり、天気は答えから決まる。ユーザーに街を選ばせない
 * - 端末の履歴に保存するのは街のキー（sky_city）だけ。文言はこのファイルで直してよい
 * - 一言は「いまその街の誰か」を書いてよい（遊びとして）。失敗も書く
 * - 「ダブリン。小雨。」のように「。」で区切る書き方をしない
 * - 連続日数・皆勤・ランキングは出さない
 */

export type SkyCity = {
  key: string;
  name: string;
  /** スタンプの上に小さく出す英字 */
  en: string;
  /**
   * 地図の上の位置（画像の左上からの％）。緯度経度から計算しない（生成した地図は形が正確でないため）。
   * 画像を見て置いた値。画像を差し替えたら置き直す（2026-10-16）
   */
  map: { on: "world" | "japan"; x: number; y: number };
};

/** 地図画像（public/images/sky-map-*.webp）の大きさ。元は docs/assets/sky-map/ */
export const SKY_MAP_WORLD = { src: "/images/sky-map-world.webp", w: 1518, h: 974 };
export const SKY_MAP_JAPAN = { src: "/images/sky-map-japan.webp", w: 939, h: 1420 };
/** 世界地図の上の日本の位置（％）。日本の街は世界地図では重なるので、ここを押して日本地図へ移る */
export const SKY_MAP_JAPAN_ON_WORLD = { x: 87.9, y: 42.6 };

export const SKY_CITIES: SkyCity[] = [
  { key: "dublin", name: "ダブリン", en: "DUBLIN", map: { on: "world", x: 46.4, y: 31.3 } },
  { key: "kanazawa", name: "金沢", en: "KANAZAWA", map: { on: "japan", x: 50.9, y: 51.4 } },
  { key: "lisbon", name: "リスボン", en: "LISBOA", map: { on: "world", x: 46.1, y: 39.5 } },
  { key: "onomichi", name: "尾道", en: "ONOMICHI", map: { on: "japan", x: 35.7, y: 61.0 } },
  { key: "san_francisco", name: "サンフランシスコ", en: "SAN FRANCISCO", map: { on: "world", x: 17.7, y: 41.1 } },
  { key: "kyoto", name: "京都", en: "KYOTO", map: { on: "japan", x: 48.5, y: 58.5 } },
  { key: "istanbul", name: "イスタンブール", en: "ISTANBUL", map: { on: "world", x: 56.3, y: 41.1 } },
  { key: "hakodate", name: "函館", en: "HAKODATE", map: { on: "japan", x: 62.6, y: 27.3 } },
  { key: "kamakura", name: "鎌倉", en: "KAMAKURA", map: { on: "japan", x: 65.2, y: 57.4 } },
  { key: "paris", name: "パリ", en: "PARIS", map: { on: "world", x: 49.7, y: 35.4 } },
  { key: "taipei", name: "台北", en: "TAIPEI", map: { on: "world", x: 81.4, y: 48.9 } },
  { key: "edinburgh", name: "エディンバラ", en: "EDINBURGH", map: { on: "world", x: 48.0, y: 29.3 } },
  { key: "bergen", name: "ベルゲン", en: "BERGEN", map: { on: "world", x: 50.6, y: 27.4 } },
  { key: "hanoi", name: "ハノイ", en: "HA NOI", map: { on: "world", x: 77.4, y: 49.3 } },
  { key: "buenos_aires", name: "ブエノスアイレス", en: "BUENOS AIRES", map: { on: "world", x: 34.3, y: 71.7 } },
  { key: "naha", name: "那覇", en: "NAHA", map: { on: "japan", x: 10.6, y: 94.9 } },
  { key: "reykjavik", name: "レイキャビク", en: "REYKJAVIK", map: { on: "world", x: 44.8, y: 23.4 } },
  { key: "wellington", name: "ウェリントン", en: "WELLINGTON", map: { on: "world", x: 94.2, y: 79.8 } },
  { key: "cape_town", name: "ケープタウン", en: "CAPE TOWN", map: { on: "world", x: 51.7, y: 73.4 } },
  { key: "helsinki", name: "ヘルシンキ", en: "HELSINKI", map: { on: "world", x: 55.3, y: 26.9 } },
  { key: "vancouver", name: "バンクーバー", en: "VANCOUVER", map: { on: "world", x: 15.3, y: 30.8 } },
  { key: "sapporo", name: "札幌", en: "SAPPORO", map: { on: "japan", x: 69.2, y: 19.7 } },
  { key: "havana", name: "ハバナ", en: "LA HABANA", map: { on: "world", x: 27.7, y: 46.4 } },
  { key: "marrakech", name: "マラケシュ", en: "MARRAKECH", map: { on: "world", x: 45.5, y: 45.2 } },
];

type SkyLine = { city: string; line: string };

/** 天気ごとに、その空が似合う街を2つ。today で出る天気の中では、ダブリンとエディンバラ（晴れ間と陽だまりの両方）以外はちょうど2つの天気に出る。風の日は today で出ない */
const SKY_LINES: Record<CardWeatherKey, [SkyLine, SkyLine]> = {
  morning_mist: [
    { city: "san_francisco", line: "サンフランシスコの坂の上はまだもやの中です。ケーブルカーを待つ人が、橋が見えないねと笑っています。" },
    { city: "kyoto", line: "鴨川に朝もやが下りています。もやの中から急にジョギングの人が現れて、散歩の人を少し驚かせました。" },
  ],
  pre_dawn: [
    { city: "istanbul", line: "イスタンブールの海峡はまだ暗い色をしています。始発のフェリーを待つ人がチャイで手を温めています。" },
    { city: "hakodate", line: "函館の朝市はまだ暗いうちから灯りがつきます。目覚ましを止めて二度寝した人が慌てて走ってくるのも、いつもの朝の景色です。" },
  ],
  flower_overcast: [
    { city: "kamakura", line: "鎌倉の空は白っぽい曇りです。写真を撮りに来た人が晴れなかったことを少し残念がっています。それでも気づけば何枚も撮っています。" },
    { city: "paris", line: "パリの並木道は薄い雲の下です。カフェのテラス席は今日も埋まっていて、空を気にしている人はいません。" },
  ],
  light_rain_start: [
    { city: "taipei", line: "台北の夜市にぽつぽつと雨が落ちてきました。屋台の人は慣れた手つきでビニールの屋根を広げています。" },
    { city: "edinburgh", line: "エディンバラで雨が降りはじめました。傘を持たずに出た人が石畳の路地を小走りで抜けていきます。" },
  ],
  light_rain: [
    { city: "dublin", line: "ダブリンは小雨です。パン屋の軒先で傘をたたむ音がしています。" },
    { city: "kanazawa", line: "金沢は小雨です。用水の音がいつもより少しだけ大きく聞こえます。" },
  ],
  rain_cloud: [
    { city: "bergen", line: "ベルゲンの山に厚い雲がかかっています。今日は降らないと言っていた人が、港で空を見上げて黙っています。" },
    { city: "hanoi", line: "ハノイの空が急に暗くなってきました。バイクの人たちが一斉にレインコートを取り出しています。" },
  ],
  thunderstorm: [
    { city: "buenos_aires", line: "ブエノスアイレスで雷が鳴っています。晴れると思って洗濯物を干してきた人が、窓の外を見て頭を抱えています。" },
    { city: "naha", line: "那覇にどしゃ降りが来ました。さっきまで晴れていたので、みんな軒下でぎゅうぎゅうになっています。" },
  ],
  sun_break: [
    { city: "dublin", line: "ダブリンの雲が切れて日が差しました。パブから出てきた人がまぶしそうに目を細めています。" },
    { city: "edinburgh", line: "エディンバラの城の上に晴れ間がのぞいています。さっきまで濡れていた石畳が急にきらきらしはじめました。" },
  ],
  angels_ladder: [
    { city: "reykjavik", line: "レイキャビクの海に雲のすき間から光の筋が下りています。車を停めて写真を撮る人が少しずつ増えてきました。" },
    { city: "onomichi", line: "尾道の海に光の筋が差しています。坂の途中で猫が一匹だけその光の中にいます。" },
  ],
  windy_day: [
    { city: "wellington", line: "ウェリントンは今日も風の強い日です。帽子を追いかけて走る人を、まわりは慣れた顔で見ています。" },
    { city: "cape_town", line: "ケープタウンの山に雲のテーブルクロスがかかっています。風が強くて、ロープウェイは今日はお休みです。" },
  ],
  light_sunrise: [
    { city: "helsinki", line: "ヘルシンキの空がうっすら桃色になってきました。早起きした人が湖のそばでコーヒーを飲んでいます。" },
    { city: "kamakura", line: "鎌倉の海の向こうが少しだけ明るくなってきました。サーファーが波を待っています。今日はなかなか来ないみたいです。" },
  ],
  wandering_clouds: [
    { city: "paris", line: "パリの空を小さな雲がいくつも流れています。地図を逆さに持った人が同じ橋を2回渡っています。" },
    { city: "vancouver", line: "バンクーバーの空は雲が行ったり来たりしています。晴れたと思って上着を脱いだ人が、5分後にまた着ています。" },
  ],
  cold_wind: [
    { city: "sapporo", line: "札幌に冷たい風が吹いています。今年はじめて手袋を出した人が、片方をどこかに落としてきました。" },
    { city: "reykjavik", line: "レイキャビクの通りを冷たい風が抜けていきます。ニット帽の人がスープの店に吸いこまれていきました。" },
  ],
  windy_sunshine: [
    { city: "wellington", line: "ウェリントンはよく晴れて風も強い日です。港のヨットがみんな同じ方向に傾いています。" },
    { city: "lisbon", line: "リスボンは風の強い晴れです。屋上に干したシーツが大きくふくらんでいます。" },
  ],
  faint_sunlight: [
    { city: "helsinki", line: "ヘルシンキに薄い日差しが届いています。短い日なたを追いかけて、ベンチの人が少しずつ席を移っています。" },
    { city: "kyoto", line: "京都のお寺の縁側に薄日が差しています。拝観に来た人がそこから動けなくなっています。" },
  ],
  twilight: [
    { city: "havana", line: "ハバナの海沿いが夕暮れの色になってきました。防波堤に座った人たちが誰かのギターを聴いています。" },
    { city: "istanbul", line: "イスタンブールのモスクの向こうに日が沈んでいきます。家路を急ぐ人の手で焼きたてのパンの袋が揺れています。" },
  ],
  sunrise: [
    { city: "marrakech", line: "マラケシュの赤い壁が朝焼けで濃い色になっています。市場の店がひとつずつ扉を開けはじめました。" },
    { city: "hakodate", line: "函館の海が朝焼けに染まっています。夜通し漁に出ていた船がゆっくり港に戻ってきます。" },
  ],
  dissonance_wind: [
    { city: "cape_town", line: "ケープタウンでは向きの読めない風が吹いています。予報を信じて海に出た人が、思ったより早く引き返してきました。" },
    { city: "buenos_aires", line: "ブエノスアイレスに少しなまぬるい風が吹いています。なんとなく落ち着かなくて、カフェで2杯目を頼む人がいます。" },
  ],
  quiet_overcast: [
    { city: "kanazawa", line: "金沢の空は静かな曇りです。茶屋街の格子の奥で誰かが三味線の練習をしています。" },
    { city: "vancouver", line: "バンクーバーは静かな曇りです。図書館の窓際の席が今日はいつもより早く埋まりました。" },
  ],
  mist: [
    { city: "san_francisco", line: "サンフランシスコが深い霧に包まれています。橋を見に来た人が赤い柱を1本だけ見て帰っていきました。" },
    { city: "bergen", line: "ベルゲンのフィヨルドに霧が立ちこめています。向こう岸は見えず、フェリーの汽笛だけが聞こえます。" },
  ],
  calm: [
    { city: "lisbon", line: "リスボンは風のない凪です。坂の上から見る港の水面がほとんど動いていません。" },
    { city: "onomichi", line: "尾道の海が凪いでいます。渡し船が鏡みたいな水面をゆっくり横切っていきます。" },
  ],
  after_rain: [
    { city: "taipei", line: "台北の雨が上がりました。路地の水たまりに屋台の灯りがゆらゆら映っています。" },
    { city: "hanoi", line: "ハノイのスコールが止みました。濡れた道の上をバイクがまた少しずつ走り出しています。" },
  ],
  sun_shower: [
    { city: "naha", line: "那覇は晴れているのに雨が降っています。干したばかりの洗濯物の前で、取り込むか迷っている人がいます。" },
    { city: "havana", line: "ハバナに天気雨が降っています。古いアメ車の運転手は、すぐ止むさと言って窓も閉めずに走っています。" },
  ],
  // 陽だまり（10/16）。晴れ間と近い空なので同じ2都市
  sunny_spot: [
    { city: "dublin", line: "ダブリンの公園に陽だまりができています。ベンチの端に座った人が、上着を脱ぐかどうかしばらく迷っています。" },
    { city: "edinburgh", line: "エディンバラの石段に日が当たっています。ひなたで丸くなった猫の横に、気づけば人がふたり並んで座っていました。" },
  ],
  moonlit_night: [
    { city: "marrakech", line: "マラケシュの屋根の上に月が出ています。屋上でミントティーを飲む人たちの声が少しずつ小さくなってきました。" },
    { city: "sapporo", line: "札幌の空に月がはっきり出ています。帰り道で立ち止まって写真を撮ろうとして、うまく撮れない人がいます。" },
  ],
};

export function getSkyCity(key: string | undefined): SkyCity | null {
  if (!key) return null;
  return SKY_CITIES.find((c) => c.key === key) ?? null;
}

/** 天気から、その空の街を1つ選ぶ（2つのうちどちらかをランダム） */
export function pickSkyCity(weather: CardWeatherKey): string | null {
  const pair = SKY_LINES[weather];
  if (!pair) return null;
  return pair[Math.random() < 0.5 ? 0 : 1].city;
}

/** その天気・その街の一言。組み合わせが無ければ null */
export function getSkyLine(weather: CardWeatherKey, cityKey: string): string | null {
  return SKY_LINES[weather]?.find((l) => l.city === cityKey)?.line ?? null;
}
