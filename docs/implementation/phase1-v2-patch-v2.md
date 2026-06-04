# phase1-instructions-v2 追加パッチ v2(改訂版)

2026-05-02 / Kinda note 結果画面 v2 を最終完成形にするための差分

---

## このパッチの目的

`phase1-instructions-v2.md`(プロジェクト内に存在、95%完成済み)に対し、
**直近の議論で確定した追加事項** を反映するためのパッチ。

このパッチを v2 と一緒に Claude Code に渡せば、実装に着手できる状態になる。

### 旧 patch(`phase1-v2-patch.md`) との関係

旧 patch の内容(天気解説20種・データ構造・キー名統一)は本パッチに統合・継承している。
旧 patch は**もう参照不要**。本パッチ一本で完結する。

---

## パッチ適用方針

### Claude Code への指示

1. `phase1-instructions-v2.md` を土台とする
2. このパッチの「追加項目」セクションを v2 の該当箇所に挿入する
3. 「変更項目」セクションの内容で v2 を上書きする
4. 「データ構造」セクションの TypeScript コードを新規ファイルとして作成する
5. すべて完了後、`/mnt/user-data/outputs/phase1-instructions-v3.md` として出力し、
   `present_files` で共有する

---

# 追加項目1:全20タイプに「天気の解説(40-60文字)」を挿入

## 配置ルール

各タイプの構造において、**summary 直下・第1層の前** に新しいセクション
「### 天気の解説」を挿入する。

```markdown
## タイプ名:Kinda 〇〇

- weather: xxx
- color: xxx
- summary: 1文の要約

### 天気の解説  ← ★ ここに追加 ★

(40-60文字の詩的な解説、2文構成)

### 第1層

(既存の80-120文字)

### 第2層
...
```

## デザイン仕様(実装時の参考)

```tsx
// 結果画面における天気解説の表示
<div className="weather-description" style={{
  marginTop: 16,
  marginBottom: 24,
  padding: "20px 24px",
  background: C.cardLight, // 既存トークン使用、淡い背景
  borderRadius: 16,
  fontFamily: '"Georgia", serif', // summary と同じ系統
  fontSize: 14,
  lineHeight: 1.9,
  color: C.text,
  letterSpacing: "0.02em",
}}>
  {weatherDescription}
</div>
```

- 第1層より少し小さめ
- summary の余韻を保つ詩的なタイポグラフィ
- 背景を淡くして「囲い込まれた詩」感を出す
- 改行は2文の間に1つ入れる(brではなく自然な行間)

## 全20タイプの天気解説文

### preルート(3タイプ)

#### Kinda 朝もや (morning_mist)
```
やわらかな霧が世界の輪郭をほどく朝。
すべてがまだ決まっていない、その白さの中にあなたはいます。
```

#### Kinda 夜明け前 (pre_dawn)
```
一日でいちばん深い闇のあと、
空がしずかに色を持ちはじめる時間。その境目にあなたはいます。
```

#### Kinda 花曇り (flower_overcast)
```
桜の咲く頃、空がうすく曇る日のこと。
華やかさと静けさが同居する、その光の下にあなたはいます。
```

---

### waitingルート(4タイプ)

#### Kinda 降り始め (light_rain_start)
```
ぽつり、と最初のひと粒が落ちる瞬間。
これから何が来るのか、まだ誰も知らない時間にあなたはいます。
```

#### Kinda 小雨 (light_rain)
```
傘をさすほどでもない、やさしい雨の日。
音もなく地面を濡らしていく、そのしずかさの中にあなたはいます。
```

#### Kinda 雨雲 (rain_cloud)
```
空が低く、重たい色を抱えている時間。
まだ降り出さない雲の下、その息をひそめた静けさにあなたはいます。
```

#### Kinda 雷雨 (thunderstorm)
```
空が音を立てて、自分の中のものを放つ夜。
通り過ぎたあとに澄んだ空気が残る、その嵐の中にあなたはいます。
```

---

### omiaiルート(3タイプ)

#### Kinda 晴れ間 (sun_break)
```
雲の切れ目から、まっすぐに光が差し込む瞬間。
世界が少しだけ明るく見える、そのまぶしさの中にあなたはいます。
```

#### Kinda 天使の梯子 (angels_ladder) ※旧 thin_clouds / usugumori から変更
```
雲の隙間から、幾筋もの光が静かに降りる現象。
確信ではなく予感のような、そのやわらかな光の中にあなたはいます。
```

#### Kinda 風の日 (windy_day)
```
草も木も、すべてが同じ方向にゆれる日。
心の中の何かが小さく動いている、その風の中にあなたはいます。
```

---

### date1ルート(3タイプ)

#### Kinda 淡い朝焼け (light_sunrise)
```
夜が明けるとき、空がそっと桃色をまとう時間。
まだ太陽は昇りきらない、そのほのかな色の中にあなたはいます。
```

#### Kinda 迷い雲 (wandering_clouds)
```
ゆっくりと形を変えながら流れていく雲。
どこへ行くかは決まっていない、そのたゆたう空の下にあなたはいます。
```

#### Kinda 冷たい風 (cold_wind)
```
頬にあたると、ふと我に返るような風。
熱だけでは進めないことを教える、そのつめたさの中にあなたはいます。
```

---

### multipleルート(3タイプ)

#### Kinda 風の強い晴れ (windy_sunshine)
```
日差しは明るいのに、風が止まらない日。
光と揺らぎが同時にある、そのまぶしくも忙しない空にあなたはいます。
```

#### Kinda 薄日 (faint_sunlight)
```
雲ごしに、やわらかく届く太陽の光。
強くはないけれど確かにそこにある、そのおだやかな明るさの中にあなたはいます。
```

#### Kinda 夕暮れ (twilight)
```
空が一日でいちばんゆたかな色を見せる時間。
明るさと暗さが混ざりあう、その揺らぎの中にあなたはいます。
```

---

### kousaiルート(4タイプ)

#### Kinda 朝焼け (sunrise)
```
夜が完全にあけて、空が燃えるように色づく瞬間。
一日のはじまりを告げる、そのあざやかな光の中にあなたはいます。
```

#### Kinda 違和感の風 (dissonance_wind)
```
草が思いがけない方向に揺れる、そんな風の日。
理由はまだ言葉にならない、その小さなざわめきの中にあなたはいます。
```

#### Kinda 静かな曇り (quiet_overcast)
```
強い光も雨もない、ただ静かに灰色の空が続く日。
何かが足りないわけではない、そのおだやかな曇り空の下にあなたはいます。
```

#### Kinda 霧 (mist)
```
近くのものすら輪郭がぼやけて見える朝。
先が見えないのではなく、いま見えるものを大切にする、その霧の中にあなたはいます。
```

---

# 追加項目2:天気解説のデータ構造(TypeScript定数)

このデータは結果画面と SEO 用解説ページの両方で使い回す。

## ファイル配置

```
app/
  kinda-note/
    data/
      weatherDescriptions.ts  ← ★ 新規作成 ★
      typeContent.ts           (既存)
      questions.ts             (既存)
```

## ファイル内容:weatherDescriptions.ts

```typescript
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
  /** 天気のキー(URLスラッグにも使う) */
  key: WeatherKey;
  /** 日本語名(表示用) */
  name_ja: string;
  /** 英語名(SEO用補助) */
  name_en: string;
  /** 所属するルート */
  route: RouteKey;
  /** 結果画面に表示する詩的な解説(40-60文字、2文構成) */
  description: string;
  /** タイプ名(Kinda 〇〇 の〇〇部分) */
  type_name: string;
  /** SEO 解説ページ用 meta description(80-120文字、Phase B で追加) */
  seo_description?: string;
};

export const WEATHER_DESCRIPTIONS: Record<WeatherKey, WeatherDescription> = {
  // ─── preルート(3タイプ) ──────────────────────
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

  // ─── waitingルート(4タイプ) ─────────────────
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

  // ─── omiaiルート(3タイプ) ───────────────────
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

  // ─── date1ルート(3タイプ) ───────────────────
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

  // ─── multipleルート(3タイプ) ────────────────
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

  // ─── kousaiルート(4タイプ) ─────────────────
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
 * ルート別に天気タイプ一覧を取得(SEO 用一覧ページで使用)
 */
export function getWeathersByRoute(route: RouteKey): WeatherDescription[] {
  return Object.values(WEATHER_DESCRIPTIONS).filter((w) => w.route === route);
}

/**
 * 全天気タイプを配列で取得(/note/weather 一覧ページで使用)
 */
export function getAllWeathers(): WeatherDescription[] {
  return Object.values(WEATHER_DESCRIPTIONS);
}
```

---

# 追加項目3【新規】:活動中ルートに Kinda act / Kinda glow サブ導線を追加

## 背景

直近のトップページ修正で、**活動中ユーザー(担当カウンセラー有り)** が
当サイトにもたらす収益貢献の主な経路は **Kinda act / Kinda glow** であることが
確定した。これに合わせ、活動中ルートの結果画面ボタン群直下に、
両機能への控えめな導線を追加する。

## 該当ルート(5ルート)

waiting / omiai / date1 / kousai / multiple

## 追加するボタン群

各ルートのボタン構成を以下に変更する。

### 修正前(現状の v2)

```tsx
// 活動中ルート
<button primary>この気持ちを、そのまま渡す</button>
<button secondary>画像にして持っておく</button>
<button ghost>もう一度やってみる</button>
```

### 修正後

```tsx
// 活動中ルート
<button primary>この気持ちを、そのまま渡す</button>
<button secondary>画像にして持っておく</button>
<button ghost>もう一度やってみる</button>

{/* ─── 他の機能も見てみる ─── */}
<div className="sub-links" style={{
  marginTop: 32,
  paddingTop: 20,
  borderTop: `1px solid ${C.border}`,
  textAlign: "center",
  opacity: 0.85,
}}>
  <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
    他の機能も見てみる
  </p>
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <a href="/kinda-act" style={subLinkStyle}>
      Kinda act:お見合いやデートに使いやすい場所
    </a>
    <a href="/kinda-glow" style={subLinkStyle}>
      Kinda glow:好きな人に会う前に、自分を整える時間
    </a>
  </div>
</div>
```

## 設計意図(Claude Code への共有事項)

- 活動中ユーザーは担当カウンセラーが既にいるため、Kinda type / talk への誘導は不要
- ただし Kinda act(お見合い場所)・Kinda glow(美容)は活動中こそ利用ニーズが高い
- 控えめなトーン(「他の機能も見てみる」)で、メイン CTA を邪魔しない位置に配置
- フォントサイズはメイン3ボタンより一段小さく、テキストリンク調

## トーン規則

- ❌「次はここに行こう」「ぜひ使ってみて」(強い誘導)
- ✅「他の機能も見てみる」「ふたりの時間を、もっと心地よく」(控えめ・補助)
- カウンセラーに頼らず自分で動いて、という暗黙メッセージにならないよう注意

## 注意事項

- pre ルートには**追加しない**(既に5ボタン構成で type/talk/glow/story が揃っている)
- ポジティブ系3タイプ(omiai 晴れ間 / date1 淡い朝焼け / kousai 朝焼け)では、
  既存の Kinda story 誘導カードの**さらに下**に配置する

---

# 追加項目4【新規】:「診断」という言葉を主要箇所から排除

## 背景

Kinda の哲学において「診断」は医療ワードであり、上から評価する印象を与える。
v2 の本文・タイトル・主要見出しから「診断」を排除し、より中立的・伴走的な
表現に置き換える。

## 修正方針

### 排除対象(タイトル・原則・サマリー文書の見出し)

| 行番号(目安) | 現状 | 修正後 |
|---|---|---|
| 1 | `# Kinda note リファクタリング指示書 v2(フェーズ1:診断フローの全面書き直し)` | `# Kinda note リファクタリング指示書 v2(フェーズ1:Kinda note フローの全面書き直し)` |
| 7 | `現在の Kinda note 診断コンポーネント` | `現在の Kinda note コンポーネント` |
| 8 | `ゲスト診断のみ対応し` | `ゲストでの利用のみ対応し` |
| 14 | `### 原則1:Kindaは診断ツールではなく「翻訳ツール」` | (現状維持。「診断ツールではなく」という否定形での使用は、原則の説明として必要なので残す) |
| 21 | `Kinda type(カウンセラー診断)への誘導` | `Kinda type(カウンセラーとの相性チェック)への誘導` |
| 102 | `診断完了時に以下の形式で保存する` | `Kinda note 完了時に以下の形式で保存する` |
| 1275 | `診断完了時(setScreen("result") の直前)に保存` | `Kinda note 完了時(setScreen("result") の直前)に保存` |
| 1412 | `-- 診断履歴` (DBコメント) | `-- Kinda note 履歴` |
| 1453 | `## フェーズ4:診断履歴のDB保存 + localStorage移行` | `## フェーズ4:Kinda note 履歴のDB保存 + localStorage移行` |
| 1455 | `ログインユーザーの診断完了時` | `ログインユーザーの Kinda note 完了時` |
| 1457 | `ゲスト診断は引き続き` | `ゲストでの利用は引き続き` |
| 1505 | `「過去の診断履歴」をコンテキストとして` | `「過去の Kinda note 履歴」をコンテキストとして` |
| 1506 | `「前回の診断から気持ちが動いた領域」` | `「前回の記録から気持ちが動いた領域」` |
| 1522 | `✅ localStorage に診断履歴が保存される` | `✅ localStorage に Kinda note 履歴が保存される` |

### 例外(残してOK)

- 14行目の `### 原則1:Kindaは診断ツールではなく「翻訳ツール」`
  → 「診断ツールではない」という否定文での使用なので残す
- ユーザー向けメッセージ本文に「診断」が出てきた場合、その個別の文脈に応じて判断
  (※ Claude Code は本文に「診断」が残っていないか念のため確認すること)

### Kinda type 関連の文言ルール再確認

- ❌「診断」→ ✅「相性チェック」
- ❌「自分に合う担当を診断する」→ ✅「自分に合う担当を見つける」

---

# 追加項目5【新規】:タイトル・主要見出しの「結婚」「婚活」確認

## 背景

ブランド哲学として、タイトル・主要見出しから以下を排除する:

- 「婚活」「結婚活動」「結婚」「ゴール」「ウェディング」「マリッジ」「式場」

ただし、本文(ユーザー向けメッセージ)・SEO description では、ユーザー理解のために
自然な範囲なら使用OK。「成婚」は結婚相談所業界の正式用語として使用OK。

## 確認方針

v2 内で「結婚 / 婚活 / ウェディング」が出現する箇所(12件確認済み)は、
すべて**本文中(ユーザー向けメッセージや業界知識の説明)**にあり、
タイトル・見出しには含まれていない。

→ **基本的に現状維持で OK**。ただし以下の点だけ Claude Code は確認:

- セクション見出し(`## xxx` `### xxx`)に上記ワードが含まれていないか
- ファイル冒頭のサマリー文書(変更点サマリー等)に上記ワードが含まれていないか
- 含まれていた場合のみ、より中立な表現に置き換える

---

# 変更項目1:weatherKey の名前統一(継承)

v2 内に以下の不整合があるため、統一する。

| 旧キー | 新キー | 理由 |
|---|---|---|
| `thin_clouds` | `angels_ladder` | omiaiルートの「天使の梯子」へ変更済み |
| `usugumori` | `angels_ladder` | 同上(v2 内では usugumori 表記が残存) |
| `wandering_cloud`(単数) | `wandering_clouds`(複数) | 設計書内で表記揺れあり |
| `dusk` | `twilight` | multipleルート、英語名統一 |

**Claude Code への指示:**
- v2 ファイル内の上記の旧キーをすべて新キーに置換する
- TypeScript の型定義(`WeatherKey`)も上記の新キーに合わせる

---

# 変更項目2:omiaiルートの「うすぐもり」を「天使の梯子」に統一(継承)

v2 の omiai ルートのタイプ分岐ロジックや文言で、まだ「うすぐもり(usugumori)」が
残っている。これをすべて「天使の梯子(angels_ladder)」に変更する。

**確認済みの残存箇所:**
- 481行目周辺:`return "usugumori";`
- 487-488行目:`return "usugumori";`
- 492行目:`return "usugumori"; // うすぐもり`
- 570行目:`## omiai タイプ2:Kinda うすぐもり`

**Claude Code への指示:**
- v2 ファイル内で `usugumori` → `angels_ladder` に置換
- 「うすぐもり」→「天使の梯子」に置換
- omiai タイプ分岐ロジックの戻り値も修正
- タイプセクション見出しも変更

---

# 確認項目(v2 にすでに反映済みのはず、念のため最終チェック)

Claude Code は実装前に、v2 で以下が反映されているかを確認する。
反映されていない場合は、v2 の修正も合わせて実施する。

- [x] **encourageは pre ルートのみ**(他5ルートでは削除)→ 反映済み確認
- [x] **preルートのボタン構成は5つ**(type / talk / glow / story / もう一度)→ 反映済み確認
- [x] **活動中ルートのボタン文言**:「この気持ちを、そのまま渡す」「画像にして持っておく」「もう一度やってみる」→ 反映済み確認
- [x] **Kinda story 誘導カードを omiai晴れ間 / date1淡い朝焼け / kousai朝焼け の3タイプに追加**→ 反映済み確認
- [ ] **絵文字は全廃**(SVGアイコンに置換)→ 要確認
- [ ] **Q2-pre の料金不安が3分解**(相場 / 続けられるか / 結果出なかったら)→ 要確認
- [ ] **「億劫」が「疲れ」「違和感」と独立フラグ**(kousaiルート分岐)→ 要確認
- [ ] **ネガ2つ以上でポジティブ判定オーバーライド**(omiai / date1 / kousai)→ 要確認
- [ ] **諦めシグナルでもカウンセラー変更を示唆しない**→ 要確認
- [ ] **localStorage 設計が DB スキーマと整合**(`kinda_note_sessions` 互換)→ 要確認

---

# Claude Code への実装指示の補足

## 結果画面の表示順序(全タイプ共通)

各タイプの結果画面において、要素は以下の順序で表示する。

```
画面1(最初に見える、1画面で完結)
─────────────────────────────────
[Weather Icon (大きく)]
[Type Name "Kinda 〇〇" (Shippori Mincho)]
[Summary "1文" (Georgia serif、大)]
[★ 天気の解説 "40-60文字" (Georgia serif、中)] ← 追加項目1
─────────── (薄い区切り線)
[第1層 "今のあなたは" (常時表示、本文)]

[もう少し詳しく読む ▼] (展開ボタン)

画面2(展開後)
─────────────────────────────────
[第2層 "気持ちの整理" (条件表示)]
[第3層 "あなたの組み合わせから" (動的生成)]
[encourage(preのみ)]

[Kinda story 誘導カード(ポジティブ系3タイプのみ)]
[ボタン群(ルート別)]
[★ 他の機能も見てみる(活動中ルートのみ)] ← 追加項目3
```

## 文字スタイル

| 要素 | フォント | サイズ | カラー |
|---|---|---|---|
| Type Name | Shippori Mincho | 28-32px | C.text |
| Summary | Georgia serif | 18-22px | C.text |
| **天気の解説** | **Georgia serif** | **14-15px** | **C.text** |
| 第1層 | Hiragino Kaku Gothic ProN | 14-15px | C.text |
| 第2層・第3層 | 同上 | 14px | C.text |
| 他の機能も見てみる(ラベル) | Hiragino Kaku Gothic ProN | 12px | C.textMuted |
| サブリンク本体 | Hiragino Kaku Gothic ProN | 13px | C.text |

天気の解説は summary の余韻を保つため、本文系フォントではなく Georgia serif を使う。

---

# このパッチのバージョン情報

- **作成日**:2026-05-02
- **対応する v2**:`phase1-instructions-v2.md`(プロジェクト内、95%完成済み)
- **旧 patch との関係**:`phase1-v2-patch.md` の内容を統合・継承(旧 patch は不要)
- **本パッチで追加された新規項目**:
  - 追加項目3:活動中ルートの Kinda act / Kinda glow サブ導線
  - 追加項目4:「診断」ワードの主要箇所からの排除
  - 追加項目5:タイトル・主要見出しの「結婚/婚活/ウェディング」確認
- **次に進む条件**:このパッチの内容で v2 → v3 を完成形にできれば実装着手 OK
- **作業ブランチ**:`implement-kinda-talk-uDUoW`(本番:`main`)

---

# 次のステップ

1. このパッチ + v2 を Claude Code に渡す
2. Claude Code は本パッチの指示に従って `phase1-instructions-v3.md` を作成
3. ふうかさんがレビュー
4. OK なら Kinda note の実装に着手(weatherDescriptions.ts の作成も含む)
