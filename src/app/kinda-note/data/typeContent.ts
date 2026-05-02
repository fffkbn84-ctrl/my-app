import type { WeatherKey } from "./weatherDescriptions";

/**
 * 結果画面に表示するタイプ別コンテンツ。
 *
 * v3 設計書の本文を、既存質問フロー（option ID 形式）にマッピングして格納する。
 * - layer1: 常時表示
 * - layer2: 各選択項目ごとの条件表示
 * - layer3: 組み合わせ条件で動的表示
 * - encourage: pre ルートのみ
 * - consultTexts: 活動中ルート（waiting / omiai / date1 / kousai / multiple）のみ
 * - storyCard: ポジティブ系3タイプ（omiai 晴れ間 / date1 淡い朝焼け / kousai 朝焼け）のみ true
 *
 * 注：Q2-pre は v3 では「料金」を3項目に分解する仕様だが、現行の質問フローでは
 * 1択（pre_q2.a「料金や仕組みがよくわからない」）にまとまっている。
 * 暫定的に1択に対して3つの解説をひとまとめにして表示している。
 * 質問側の3分解パッチが入った段階で、layer2 を3項目に分割する。
 */

// ─── 型定義 ──────────────────────────────────────────────────────────────────

export type Answers = Record<string, string[]>;
export type FreeTexts = Record<string, string>;

export type Predicate = (a: Answers, ft: FreeTexts) => boolean;

export type ConditionalText = {
  /** ラベル（例：「相場がわからない」選択時）。表示しても良いし、UIによっては非表示でも良い。 */
  label?: string;
  /** 条件。省略時は常に表示。 */
  when?: Predicate;
  /** 本文 */
  body: string;
};

export type TypeContent = {
  weather: WeatherKey;
  /** 表示タイプ名（"Kinda 〇〇" の "〇〇" 部分） */
  typeName: string;
  /** "Kinda 〇〇"（フルネーム） */
  fullName: string;
  /** テーマ色（CSS 値）。背景アクセントなどに使用 */
  color: string;
  /** 1文の summary */
  summary: string;
  /** 第1層：常時表示 */
  layer1: string;
  /** 第2層：各選択項目ごとに条件表示 */
  layer2: ConditionalText[];
  /** 第3層：組み合わせ条件で動的生成 */
  layer3: ConditionalText[];
  /** pre ルートのみ */
  encourage?: string;
  /** 活動中ルートのみ */
  consultTexts?: string[];
  /** Kinda story 誘導カードを表示するか（ポジティブ系3タイプのみ true） */
  storyCard?: boolean;
};

// ─── Predicate ヘルパー ───────────────────────────────────────────────────────

/** 単一質問で特定 ID が選ばれているか */
const has =
  (qid: string, optId: string): Predicate =>
  (a) =>
    (a[qid] ?? []).includes(optId);

/** 単一質問で複数 ID のうちどれか1つが選ばれているか */
const hasAny =
  (qid: string, optIds: string[]): Predicate =>
  (a) =>
    (a[qid] ?? []).some((id) => optIds.includes(id));

/** 単一質問で全 ID が選ばれているか */
const hasAll =
  (qid: string, optIds: string[]): Predicate =>
  (a) =>
    optIds.every((id) => (a[qid] ?? []).includes(id));

/** 単一質問で n 個以上の ID が選ばれているか */
const countAtLeast =
  (qid: string, optIds: string[], n: number): Predicate =>
  (a) =>
    (a[qid] ?? []).filter((id) => optIds.includes(id)).length >= n;

/** single 質問で回答が optId と一致するか */
const equals =
  (qid: string, optId: string): Predicate =>
  (a) =>
    (a[qid] ?? [])[0] === optId;

/** single 質問で回答がリストに含まれるか */
const equalsAny =
  (qid: string, optIds: string[]): Predicate =>
  (a) => {
    const v = (a[qid] ?? [])[0];
    return v != null && optIds.includes(v);
  };

/** すべての Predicate が真 */
const all =
  (...ps: Predicate[]): Predicate =>
  (a, ft) =>
    ps.every((p) => p(a, ft));

// ─── pre ルート（3タイプ） ───────────────────────────────────────────────────

// Q2-pre 現行：
//  a 料金や仕組みがよくわからない
//  b 自分に合うカウンセラーがいるか不安
//  c 本当に相手が見つかるか自信がない
//  d どんな人が活動しているか想像できない
//  e 相談所に入ることへの抵抗感がある
//  f 特にない、もう少し情報を集めたい

const morningMist: TypeContent = {
  weather: "morning_mist",
  typeName: "朝もや",
  fullName: "Kinda 朝もや",
  color: "#7A9E87",
  summary: "見えていないだけで、道はちゃんとある。",
  layer1:
    "「踏み出せない」のは、慎重さじゃなくて情報が足りていないだけかもしれない。結婚相談所って普段の会話で話題に出るものじゃないから、仕組みや相場が見えないのは当たり前のことだよ。見えないものには、誰だって一歩が出にくい。",
  layer2: [
    {
      label: "「料金や仕組みがよくわからない」選択時",
      when: has("pre_q2", "a"),
      body:
        "結婚相談所の月額は、1.5〜3.5万円が中心。ジムやサブスクと同じくらいの感覚の人が多いよ。ただし初期費用や成婚料は相談所ごとに幅があるから、比較するときは月額だけじゃなく総額で見るのがおすすめ。\n\n続けられるかどうか、今ここで一人で判断しなくて大丈夫。ほとんどの相談所は初回面談が無料で、料金プランや支払い方法を詳しく聞ける。聞いてから「続けられそうか」を決めれば十分だよ。\n\n結果が出なかったらどうしよう、という不安はごく当たり前の気持ち。多くの相談所には「成婚料」という仕組みがあって、これは一緒にいたいと思える相手が見つかった時に発生する料金のこと。ただし「成婚」の定義は相談所ごとに違うから、契約前にそこで聞くのが確実だよ。退会条件も一緒に確認しておくと安心。",
    },
    {
      label: "「どんな人が活動しているか想像できない」選択時",
      when: has("pre_q2", "d"),
      body:
        "活動している人の大半は、ごく普通の会社員や専門職。特別に社交的な人ばかりでも、婚活に必死な人ばかりでもないよ。「自然な出会いがなかった」という理由でいる人が一番多い。",
    },
    {
      label: "「相談所に入ることへの抵抗感がある」選択時",
      when: has("pre_q2", "e"),
      body:
        "その抵抗感にはちゃんと意味がある。「自分で見つけられなかった」という気持ちとセットになっていることが多いから。でも今は3人に1人が何らかのマッチングサービスで出会ってる時代。相談所も、選択肢のひとつとして普通になってきてるよ。",
    },
  ],
  layer3: [
    {
      label: "情報系選択が3つ以上",
      // 現行 Q2 は「料金」が1択なので、a / d / e のうち3つ全部選択時に発火
      when: countAtLeast("pre_q2", ["a", "d", "e"], 3),
      body:
        "これだけ多くの「わからない」を抱えてるってことは、一人で調べるには限界がきてるサインかも。面談は情報収集の場として使って全然いいよ。契約しに行く場じゃない。",
    },
    {
      label: "「料金」全般 + 慎重さ",
      // 現行は料金が単一の a に統合されているため、a 単体でも「お金の不安」を扱う
      when: has("pre_q2", "a"),
      body:
        "お金の不安が出ているのは、きっと「失敗したくない」という真剣さの裏返し。無料面談で総額と支払いパターンまで聞いてしまえば、この不安はまとめて解決できるよ。",
    },
    {
      label: "「抵抗感」+「どんな人」両方選択",
      when: hasAll("pre_q2", ["d", "e"]),
      body:
        "「相談所の世界」そのものがまだ遠く感じているんだね。そういう時は、口コミで実際にそこに行った人の言葉を読むだけでも距離が縮まる。",
    },
  ],
  encourage:
    "見えないものは怖いけど、見えればただの道。一歩踏み出す前に、まず見てみよう。",
};

const preDawn: TypeContent = {
  weather: "pre_dawn",
  typeName: "夜明け前",
  fullName: "Kinda 夜明け前",
  color: "#C8A97A",
  summary: "自信がないまま始めてもいい。みんなそうだから。",
  layer1:
    "「自分に合うカウンセラーがいるか」「相手が見つかるか」に引っかかっているのは、自分の価値を自分で決めかねているってことかもしれない。これは真面目な人ほど強く感じる不安で、活動を始める前の人のほぼ全員が通る場所だよ。不安があるから始められないんじゃなくて、始めると不安の形が少しずつ変わっていく。",
  layer2: [
    {
      label: "「自分に合うカウンセラーがいるか不安」選択時",
      when: has("pre_q2", "b"),
      body:
        "カウンセラーとの相性は、会ってみるまでわからない部分が大きい。「合う気がしない」と最初から決めなくていい。無料面談は「合うか確かめに行く場」として使えるし、話してみて違和感があれば、その時考えればいい。今ここで完璧な答えを出す必要はないよ。",
    },
    {
      label: "「本当に相手が見つかるか自信がない」選択時",
      when: has("pre_q2", "c"),
      body:
        "この不安、入会前の人のほぼ全員が感じてる。でも始めてみると、不安の形は変わっていくよ。「見つかるか」じゃなくて「どんな人と会うか」に意識が向くから。今の不安は、始める前だから見えている景色なだけ。始めた後には別の景色が待ってる。",
    },
    {
      label: "「どんな人が活動しているか想像できない」選択時",
      when: has("pre_q2", "d"),
      body:
        "想像できないと、自分が混ざっていいのか分からなくなるよね。でも活動してるのは自然な出会いがなかっただけの、ごく普通の人たち。特別な人が集まってる場所じゃないよ。",
    },
    {
      label: "「相談所に入ることへの抵抗感がある」選択時",
      when: has("pre_q2", "e"),
      body:
        "その抵抗感は、「自分で見つけられなかった」という気持ちから来てるのかもしれない。でもそれはただの時代の変化で、あなたの価値とは関係ない。自然な出会いが減ったのは、社会全体が変わってきているからだよ。",
    },
  ],
  layer3: [
    {
      label: "「自分に合うカウンセラー」+「相手が見つかるか」両方選択",
      when: hasAll("pre_q2", ["b", "c"]),
      body:
        "「自分が受け入れられるか」という不安が、2つの質問に形を変えて出てきているのかも。これは自分の価値を誰かに決めてもらおうとしている状態。でも本当は、価値は決めてもらうものじゃなくて、一緒に作っていくもの。カウンセラーに「自信がないんです」って正直に伝えるところから始めれば十分だよ。",
    },
    {
      label: "「相手が見つかるか」+「活動している人が想像できない」",
      when: hasAll("pre_q2", ["c", "d"]),
      body:
        "「相手が見つかるか」の不安の正体は、自分と似た人がいるか分からないってことかも。似た境遇の人は、想像してるよりずっと多いよ。口コミで実際の利用者の声を見ると、自分と近い人が必ず見つかる。",
    },
  ],
  encourage:
    "自信は、始める前に揃えるものじゃない。始めてから少しずつ育っていくものだよ。",
};

const flowerOvercast: TypeContent = {
  weather: "flower_overcast",
  typeName: "花曇り",
  fullName: "Kinda 花曇り",
  color: "#C4877A",
  summary: "急がない選び方は、ちゃんと真剣さの証拠。",
  layer1:
    "「もう少し情報を集めたい」「真剣に活動したい」と考えているあなたは、適当に始めたくないから一歩が重くなっている。これは慎重さじゃなくて、大切にしたい気持ちの裏返し。焦って始めて後悔したくない、という感覚が働いているから。真剣な人ほど、最初の一歩は時間がかかるものだよ。",
  layer2: [
    {
      label: "Q1「真剣に活動したいと思った」選択時",
      when: equals("pre_q1", "b"),
      body:
        "「真剣」という言葉を自分で選んだところに、もう答えの一部が出ているよ。真剣に向き合いたいと思えるタイミングは、何度も来るものじゃない。その気持ちが冷めないうちに、一歩だけ動いてみる価値はあるよ。",
    },
    {
      label: "Q1「自然な出会いがなかなかない」選択時",
      when: equals("pre_q1", "a"),
      body:
        "「なかった」という過去形で言えるのは、ちゃんと待ってみた結果だから。待つ時間があったから、動く時期だと分かった。これは焦りじゃなくて、自分のリズムで出した結論だよ。",
    },
    {
      label: "Q1「なんとなく気になって」選択時",
      when: equals("pre_q1", "d"),
      body:
        "「なんとなく」という入り口は、実は一番自然。明確な理由がなくても、気になるものには意味がある。気になった時に調べてみる、くらいの軽さで十分だよ。",
    },
    {
      label: "Q2「特にない、もう少し情報を集めたい」選択時",
      when: has("pre_q2", "f"),
      body:
        "情報を集めたいという気持ちは、始める準備をしてる証拠。ただし情報は集めきれない。どこかで「これくらいでいいかな」って線を引かないと、永遠に始められないタイプの事柄だから。無料面談は「情報を集めに行く場」としても使えるよ。",
    },
    {
      label: "Q2「抵抗感がある」選択時",
      when: has("pre_q2", "e"),
      body:
        "「お金を払って出会いを探す」ことへの違和感は、真面目な人ほど感じるものだよ。でもお金を払っているのは「出会いを買う」ためじゃなくて「真剣な人とだけ会える環境」のため。それは自然な出会いにはない価値だよ。",
    },
  ],
  layer3: [
    {
      label: "「真剣に活動したい」+「情報を集めたい」両方選択",
      when: all(equals("pre_q1", "b"), has("pre_q2", "f")),
      body:
        "真剣だから慎重になる、慎重だから動けない、というループに入りかけてるかも。真剣さは、動き出してからも保てるもの。動き始めることで慎重さを失うわけじゃないよ。",
    },
    {
      label: "Q3で「日常をそのまま共有」or「話を聞いてくれる人」選択",
      when: equalsAny("pre_q3", ["a", "b"]),
      body:
        "あなたが求めている関係は、派手な相性じゃなくて静かな相性。だからこそ、カウンセラーとの対話でじっくり見極める相談所の仕組みが、自然な出会いより合っているかもしれない。",
    },
    {
      label: "「抵抗感」+「真剣に活動したい」両方選択",
      when: all(has("pre_q2", "e"), equals("pre_q1", "b")),
      body:
        "「抵抗感」と「真剣さ」が同時にあるのは矛盾じゃない。真剣だからこそ、お金を介することに引っかかる。その引っかかりを感じたまま、一度だけ無料面談に行ってみると、自分の中で答えが出ることが多いよ。",
    },
  ],
  encourage:
    "慎重に選ぶ時間は、無駄にならない。選んだ後のあなたを支えるのは、ちゃんと選んだという事実だよ。",
};

// ─── waiting ルート（4タイプ・期間別） ────────────────────────────────────────

// 設計方針：分析は第1層だけ、期間分岐のみ。メインは引き継ぎメモ。
// summary は共通：「今の気持ちに近いものを、言葉にしておきました。このままカウンセラーに見せて大丈夫。」

const WAITING_SUMMARY =
  "今の気持ちに近いものを、言葉にしておきました。このままカウンセラーに見せて大丈夫。";

const lightRainStart: TypeContent = {
  weather: "light_rain_start",
  typeName: "降り始め",
  fullName: "Kinda 降り始め",
  color: "#6B8FBF",
  summary: WAITING_SUMMARY,
  layer1:
    "入会したばかりで、まだ何も起きていない時期だね。最初の1ヶ月は動きが鈍いのが普通で、プロフィール作成や条件設定の調整期間にあたることが多いよ。ただ、この時期に感じている違和感は後になるほど伝えにくくなるから、今のうちに話しておく価値があるよ。",
  layer2: [],
  layer3: [],
  consultTexts: [
    "「まだ何も動いていなくて不安です」って、そのまま伝えてみて。",
    "「いつ頃から動き出すのが普通ですか」と聞くと、現状の見立てが返ってくるよ。",
  ],
};

const lightRain: TypeContent = {
  weather: "light_rain",
  typeName: "小雨",
  fullName: "Kinda 小雨",
  color: "#6B8FBF",
  summary: WAITING_SUMMARY,
  layer1:
    "1〜3ヶ月は、本来なら最初のお見合いが組めていてもいい時期。ここで動きがないのには必ず理由があって、プロフィール、条件設定、申し込み戦略のどこかを調整すれば変わることが多い。一人で原因を探そうとしなくて大丈夫だよ。",
  layer2: [],
  layer3: [],
  consultTexts: [
    "「動きが少ないので、どこを調整できそうか相談したい」って伝えてみて。",
    "「プロフィールや条件、見直しが必要なところはありますか」もよく使う相談だよ。",
  ],
};

const rainCloud: TypeContent = {
  weather: "rain_cloud",
  typeName: "雨雲",
  fullName: "Kinda 雨雲",
  color: "#6B8FBF",
  summary: WAITING_SUMMARY,
  layer1:
    "3〜6ヶ月動きがないのは、一人で抱えるには重すぎる状況。焦りや自己否定が混ざり始める時期でもあるから、ここから先は一人で考えない方がいい。カウンセラーが何をしているかを含めて、現状を整理する場を作るタイミングだよ。",
  layer2: [],
  layer3: [],
  consultTexts: [
    "「現状を整理する時間を取りたい」って、そのまま伝えてみて。",
    "「いま何を進めてもらっているか」を聞いてもいい。把握する権利はあるよ。",
  ],
};

const thunderstorm: TypeContent = {
  weather: "thunderstorm",
  typeName: "雷雨",
  fullName: "Kinda 雷雨",
  color: "#6B8FBF",
  summary: WAITING_SUMMARY,
  layer1:
    "半年以上お見合いが組めていない状況は、今すぐ向き合うべき問題だよ。ただし、それはあなたに問題があるということじゃない。プロフィール・条件・相談所との相性・カウンセラーとのコミュニケーション、どこかに調整の余地があるサイン。一人で答えを出そうとしないで、まずこのメモを見せてみて。",
  layer2: [],
  layer3: [],
  consultTexts: [
    "「半年動きがなくて、現状を整理したいです」って正直に伝えていい。",
    "メモをそのまま見せれば、話の入り口になるよ。",
  ],
};

// ─── 全タイプ・マップ ─────────────────────────────────────────────────────────

const PRE_TYPES = {
  morning_mist: morningMist,
  pre_dawn: preDawn,
  flower_overcast: flowerOvercast,
} as const;

const WAITING_TYPES = {
  light_rain_start: lightRainStart,
  light_rain: lightRain,
  rain_cloud: rainCloud,
  thunderstorm: thunderstorm,
} as const;

// 後続コミットで omiai / date1 / kousai / multiple を追加する。
// それまでのフォールバックとして、まず空オブジェクトとして公開しておく。
const PLACEHOLDER_TYPES = {} as Partial<Record<WeatherKey, TypeContent>>;

export const TYPE_CONTENT: Partial<Record<WeatherKey, TypeContent>> = {
  ...PRE_TYPES,
  ...WAITING_TYPES,
  ...PLACEHOLDER_TYPES,
};

export function getTypeContent(weather: WeatherKey): TypeContent | undefined {
  return TYPE_CONTENT[weather];
}

// 内部で使うので予測子もエクスポートしておく（result page から必要な時に再利用可能）
export const _predicates = {
  has,
  hasAny,
  hasAll,
  countAtLeast,
  equals,
  equalsAny,
  all,
};
