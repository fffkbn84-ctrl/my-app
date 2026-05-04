import type { RouteKey } from "./weatherDescriptions";

/**
 * 結果画面でメモテキストを組み立てる時に使う、質問メタデータの参照テーブル。
 *
 * 既存の quiz/page.tsx に埋め込まれている質問定義のうち、
 * 「ID → ラベル」のマッピングだけを切り出したもの。quiz の挙動には触らない。
 *
 * 質問フローが v3 通りに更新されたら、ここを真とする方向で
 * quiz/page.tsx も将来このモジュールから読むようにリファクタする想定。
 */

export type QuestionMeta = {
  id: string;
  /** Q1 / Q2 ... ラベル */
  label: string;
  /** 質問テキスト */
  text: string;
  type: "single" | "multi" | "text";
  /** options[id] = label */
  options?: Record<string, string>;
};

const PRE_QUESTIONS: QuestionMeta[] = [
  {
    id: "pre_q1",
    label: "Q1",
    text: "相談所に興味を持ったきっかけは？",
    type: "single",
    options: {
      a: "自然な出会いがなかなかない",
      b: "真剣に活動したいと思った",
      c: "友人や知人に勧められた",
      d: "なんとなく気になって",
    },
  },
  {
    id: "pre_q2",
    label: "Q2",
    text: "踏み出せていない理由は？",
    type: "multi",
    options: {
      a1: "相場がわからない（高いのか安いのかも判断できない）",
      a2: "毎月の費用を続けられるか不安",
      a3: "払ったのに結果が出なかったら、と思うと踏み出せない",
      b: "自分に合うカウンセラーがいるか不安",
      c: "本当に相手が見つかるか自信がない",
      d: "どんな人が活動しているか想像できない",
      e: "相談所に入ることへの抵抗感がある",
      f: "特にない、もう少し情報を集めたい",
    },
  },
  {
    id: "pre_q3",
    label: "Q3",
    text: "一緒にいる人と、どんな時間を過ごしたい？",
    type: "single",
    options: {
      a: "日常をそのまま共有できる人がいる",
      b: "話を聞いてくれる人がそばにいる",
      c: "一緒に新しいことに挑戦したい",
      d: "特別な日も普通の日も、一緒にいたい",
    },
  },
  {
    id: "pre_q4",
    label: "Q4",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text",
  },
];

const WAITING_QUESTIONS: QuestionMeta[] = [
  {
    id: "wait_q1",
    label: "Q1",
    text: "入会してからどのくらい経つ？",
    type: "single",
    options: {
      a: "1ヶ月以内",
      b: "1〜3ヶ月",
      c: "3〜6ヶ月",
      d: "半年以上",
    },
  },
  {
    id: "wait_q2",
    label: "Q2",
    text: "今の気持ちに近いのは？",
    type: "multi",
    options: {
      a: "焦りはあるけど、何をすればいいかわからない",
      b: "カウンセラーに相談したいけど言い出せない",
      c: "自分のプロフィールや条件に問題があるのか気になる",
      d: "このまま続けていいのか迷い始めている",
      e: "活動自体は続けたい、でも不安",
    },
  },
  {
    id: "wait_q3",
    label: "Q3",
    text: "カウンセラーに相談できていない理由は？",
    type: "multi",
    options: {
      a: "言い返されたり、責められそうで怖い",
      b: "自分に問題があると思うと言い出せない",
      c: "何を言えばいいかわからない",
      d: "気を遣ってしまって本音が言えない",
      e: "相談してもどうせ変わらないと思っている",
    },
  },
  {
    id: "wait_q4",
    label: "Q4",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text",
  },
];

const OMIAI_QUESTIONS: QuestionMeta[] = [
  {
    id: "omiai_q1",
    label: "Q1",
    text: "お見合い、どうだった？",
    type: "single",
    options: {
      a: "楽しかった",
      b: "普通だった",
      c: "少し疲れた",
      d: "よくわからなかった",
    },
  },
  {
    id: "omiai_q2",
    label: "Q2",
    text: "また会いたいと思う？",
    type: "single",
    options: {
      a: "また会いたい",
      b: "もう一度なら会えそう",
      c: "迷っている",
      d: "あまり会いたくない",
    },
  },
  {
    id: "omiai_q3",
    label: "Q3",
    text: "会ってみてどんな印象だった？",
    type: "multi",
    options: {
      a: "思ってたより話しやすかった",
      b: "見た目が思ってたのと少し違った",
      c: "会話がすごく盛り上がった",
      d: "沈黙が気になった",
      e: "ドキドキした瞬間があった",
      f: "ときめきはなかったけど悪くなかった",
      g: "なんとなく違う気がした",
      h: "なんか良さそうだった",
      i: "特に印象に残らなかった",
    },
  },
  {
    id: "omiai_q4",
    label: "Q4",
    text: "カウンセラーに話したいことは？",
    type: "multi",
    options: {
      a: "相談したいことがあるけど言葉にできない",
      b: "相談したいけど指摘されそうで怖い",
      c: "何を相談すればいいかわからない",
      d: "また会いたい気持ちを後押ししてほしい",
      e: "特にない、自分で整理できてる",
    },
  },
  {
    id: "omiai_q5",
    label: "Q5",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text",
  },
];

const KOUSAI_QUESTIONS: QuestionMeta[] = [
  {
    id: "kousai_q1",
    label: "Q1",
    text: "最近、相手とどんな時間を過ごしてる？",
    type: "single",
    options: {
      a: "楽しい時間が多い",
      b: "普通に会ってる感じ",
      c: "なんとなくぎこちない",
      d: "会うのが少し億劫になってきた",
    },
  },
  {
    id: "kousai_q2",
    label: "Q2",
    text: "気になっていることは？",
    type: "multi",
    options: {
      a: "価値観や習慣が違うなと感じた",
      b: "会話が盛り上がらないことがある",
      c: "相手の気持ちがよくわからない",
      d: "自分の気持ちがよくわからない",
      e: "このまま進んでいいのか不安",
      f: "相手のことが好きで、次のステップに進みたい",
      g: "相手が自分をどう思ってるか気になる",
      h: "特にない、順調だと思う",
    },
  },
  {
    id: "kousai_q3",
    label: "Q3",
    text: "カウンセラーに話したいことは？",
    type: "multi",
    options: {
      a: "相談したいことがあるけど言葉にできない",
      b: "相談したいけど指摘されそうで怖い",
      c: "何を相談すればいいかわからない",
      d: "好きな気持ちをどう伝えるか相談したい",
      e: "特にない、自分で整理できてる",
    },
  },
  {
    id: "kousai_q4",
    label: "Q4",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text",
  },
];

const MULTIPLE_QUESTIONS: QuestionMeta[] = [
  {
    id: "mu_q1",
    label: "Q1",
    text: "今、同時に交際している人は何人？",
    type: "single",
    options: {
      a: "2人",
      b: "3〜4人",
      c: "5人以上",
      d: "数えるのも疲れた",
    },
  },
  {
    id: "mu_q2",
    label: "Q2",
    text: "複数人の中で『この人かも』と思っている人はいる？",
    type: "single",
    options: {
      a: "いる",
      b: "まだいない",
      c: "わからない",
    },
  },
  {
    id: "mu_q3",
    label: "Q3",
    text: "今の気持ちに近いのは？",
    type: "multi",
    options: {
      a: "誰かひとりに絞りたいけど決められない",
      b: "比べてしまって罪悪感がある",
      c: "同時に複数人と会い続けるのが疲れてきた",
      d: "もっと合う人がいそうで踏み切れない",
      e: "新しいお見合いも続いていて消耗している",
      f: "婚活自体しんどくなってきた",
      g: "特にしんどくはない、整理したいだけ",
    },
  },
  {
    id: "mu_q4",
    label: "Q4",
    text: "カウンセラーに話したいことは？",
    type: "multi",
    options: {
      a: "少し活動のペースを落としたい",
      b: "絞り方のアドバイスがほしい",
      c: "誰かひとりに決める背中を押してほしい",
      d: "まず気持ちを聞いてもらいたい",
      e: "何を相談すればいいかわからない",
    },
  },
  {
    id: "mu_q5",
    label: "Q5",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text",
  },
];

// date1 ルートは現行 quiz には未実装。v3 仕様の質問定義を将来用に保持。
const DATE1_QUESTIONS: QuestionMeta[] = [
  {
    id: "date1_q2",
    label: "Q2",
    text: "デート1回目、どうだった？",
    type: "single",
    options: {
      a: "もっと一緒にいたいと思った",
      b: "お見合いの印象と同じだった",
      c: "お見合いの印象と変わった（良い方に）",
      d: "お見合いの印象と変わった（違和感が出た）",
      e: "よくわからなかった",
    },
  },
  {
    id: "date1_q3",
    label: "Q3",
    text: "次のデートに進む気持ちは？",
    type: "single",
    options: {
      a: "進みたい",
      b: "もう一度くらいなら",
      c: "迷っている",
      d: "止めたい",
    },
  },
  {
    id: "date1_q4",
    label: "Q4",
    text: "気になったのは？",
    type: "multi",
    options: {
      a: "沈黙が増えた",
      b: "会話のペースが合わなかった",
      c: "価値観の片鱗が見えた",
      d: "むしろ話しやすくなった",
      e: "相手の素の表情が見えた",
      f: "マナーや振る舞いが気になった",
      g: "特にない",
    },
  },
  {
    id: "date1_q5",
    label: "Q5",
    text: "カウンセラーに話したいことは？",
    type: "multi",
    options: {
      a: "相談したいことがあるけど言葉にできない",
      b: "相談したいけど指摘されそうで怖い",
      c: "何を相談すればいいかわからない",
      d: "また会いたい気持ちを後押ししてほしい",
      e: "特にない、自分で整理できてる",
    },
  },
  {
    id: "date1_q6",
    label: "Q6",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text",
  },
];

export const ROUTE_QUESTIONS: Record<RouteKey, QuestionMeta[]> = {
  pre: PRE_QUESTIONS,
  waiting: WAITING_QUESTIONS,
  omiai: OMIAI_QUESTIONS,
  date1: DATE1_QUESTIONS,
  kousai: KOUSAI_QUESTIONS,
  multiple: MULTIPLE_QUESTIONS,
};

export const ROUTE_LABEL: Record<RouteKey, string> = {
  pre: "まだ相談所に入っていない",
  waiting: "入会したけど、まだお見合いが始まっていない",
  omiai: "活動中（お見合いをした）",
  date1: "活動中（デート1回目を終えた）",
  kousai: "活動中（交際中）",
  multiple: "活動中（複数人と同時に迷っている）",
};

export function getQuestionsForRoute(route: RouteKey): QuestionMeta[] {
  return ROUTE_QUESTIONS[route] ?? [];
}
