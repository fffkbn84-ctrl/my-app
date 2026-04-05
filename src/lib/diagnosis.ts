/* ────────────────────────────────────────────────────────────
   ふたりへ — 婚活タイプ診断ロジック
   将来の設問変更・タイプ追加が容易な構造で管理。
   TODO: Supabase連携後は診断結果を reservations / profiles テーブルに
         保存し、マイページ (/mypage) で確認できるようにする。
──────────────────────────────────────────────────────────── */

export type DiagnosisScores = {
  calm?: number;
  self?: number;
  support?: number;
  strategy?: number;
  online?: number;
  restart?: number;
};

export type DiagnosisOption = {
  label: string;
  scores: DiagnosisScores;
};

export type DiagnosisQuestion = {
  id: number;
  text: string;
  options: DiagnosisOption[];
};

export type DiagnosisTypeId = "calm" | "self" | "support" | "strategy" | "online" | "restart";

export type DiagnosisType = {
  id: DiagnosisTypeId;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  tags: string[];
  counselorTags: string[];
  advice: string;
};

/* ────────────────────────────────────────────────────────────
   質問データ（8問）
──────────────────────────────────────────────────────────── */
export const QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 1,
    text: "今のあなたの気持ちに一番近いのは？",
    options: [
      { label: "焦りはないけど、そろそろ本気で考えたい", scores: { calm: 2, self: 1 } },
      { label: "周囲の結婚ラッシュで少し焦っている", scores: { support: 1, anxiety: 2 } as DiagnosisScores },
      { label: "明確に「〇歳までに」と決めている", scores: { strategy: 2, speed: 1 } as DiagnosisScores },
      { label: "以前うまくいかなかったので、今度こそ", scores: { restart: 3 } },
    ],
  },
  {
    id: 2,
    text: "カウンセラーに求めることは？",
    options: [
      { label: "じっくり話を聞いてほしい", scores: { calm: 2, anxiety: 1 } as DiagnosisScores },
      { label: "客観的なアドバイスがほしい", scores: { strategy: 2, self: 1 } },
      { label: "積極的に引っ張ってほしい", scores: { support: 3 } },
      { label: "選択肢を広げてほしい", scores: { self: 2, speed: 1 } as DiagnosisScores },
    ],
  },
  {
    id: 3,
    text: "活動頻度のイメージは？",
    options: [
      { label: "月1〜2回ゆっくり", scores: { calm: 2, restart: 1 } },
      { label: "月3〜4回コンスタントに", scores: { strategy: 1, support: 1 } },
      { label: "できるだけ多く会いたい", scores: { speed: 3 } as DiagnosisScores },
      { label: "繁忙期は減らしたい", scores: { online: 3 } },
    ],
  },
  {
    id: 4,
    text: "お見合い相手に断られたら？",
    options: [
      { label: "かなりへこむ・立ち直りに時間がかかる", scores: { calm: 2, anxiety: 1 } as DiagnosisScores },
      { label: "少し落ち込むけどすぐ切り替えられる", scores: { self: 2 } },
      { label: "次の人を探すだけ・あまり気にしない", scores: { speed: 2, strategy: 1 } as DiagnosisScores },
      { label: "原因を分析して改善したい", scores: { strategy: 3 } },
    ],
  },
  {
    id: 5,
    text: "面談の場所・形式の希望は？",
    options: [
      { label: "対面がいい・相談所に行きたい", scores: { calm: 1, support: 1 } },
      { label: "オンラインが便利・どこでも対応したい", scores: { online: 3 } },
      { label: "どちらでもいい", scores: { self: 1, strategy: 1 } },
      { label: "最初だけ対面、あとはオンラインで", scores: { online: 2, calm: 1 } },
    ],
  },
  {
    id: 6,
    text: "結婚相手に一番求めることは？",
    options: [
      { label: "価値観・考え方が合う", scores: { self: 3 } },
      { label: "一緒にいて落ち着ける", scores: { calm: 2, restart: 1 } },
      { label: "条件（年齢・収入・職業）が合う", scores: { strategy: 2, speed: 1 } as DiagnosisScores },
      { label: "フィーリング・直感", scores: { support: 1, self: 1 } },
    ],
  },
  {
    id: 7,
    text: "今の婚活への気持ちは？",
    options: [
      { label: "不安が多い・何から始めればいいか分からない", scores: { anxiety: 3, support: 1 } as DiagnosisScores },
      { label: "やる気はあるが、自分に合う人がいるか心配", scores: { calm: 1, anxiety: 1 } as DiagnosisScores },
      { label: "前向き・楽しみながら活動したい", scores: { speed: 2, self: 1 } as DiagnosisScores },
      { label: "焦りはあるが慎重に進めたい", scores: { strategy: 1, restart: 1 } },
    ],
  },
  {
    id: 8,
    text: "婚活でカウンセラーに一番してほしくないことは？",
    options: [
      { label: "急かされること", scores: { calm: 3, restart: 1 } },
      { label: "的外れなアドバイス", scores: { self: 2, strategy: 1 } },
      { label: "放置・連絡が遅い", scores: { support: 3 } },
      { label: "条件だけで判断されること", scores: { self: 2, calm: 1 } },
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   診断タイプ定義（6タイプ）
──────────────────────────────────────────────────────────── */
export const DIAGNOSIS_TYPES: Record<DiagnosisTypeId, DiagnosisType> = {
  calm: {
    id: "calm",
    name: "安心伴走型",
    subtitle: "じっくり・不安なく進めたい",
    description:
      "婚活に不安を感じながらも、真剣に向き合おうとしているタイプ。急かされることが苦手で、自分のペースを大切にしたい。信頼関係を築いてから動けるカウンセラーとの相性が抜群。",
    color: "#C8A97A",
    gradient: "linear-gradient(135deg,#EDE0D4,#D4C4B0)",
    tags: ["傾聴が得意", "押しつけない", "ゆっくりペース"],
    counselorTags: ["傾聴が得意", "押しつけない"],
    advice:
      "最初の面談で「今日は話を聞くだけでいい」と言ってもらえるカウンセラーを選びましょう。",
  },
  self: {
    id: "self",
    name: "自分軸探索型",
    subtitle: "価値観重視・自分らしく選びたい",
    description:
      "条件よりも「この人と一緒にいたい」という感覚を大切にするタイプ。自分の気持ちを引き出してくれる、対話が上手なカウンセラーと良い関係を築ける。",
    color: "#7A9E87",
    gradient: "linear-gradient(135deg,#D8E4D8,#C0D4C2)",
    tags: ["価値観重視", "自分のペース", "対話が好き"],
    counselorTags: ["傾聴が得意", "30代実績多数"],
    advice: "「条件より価値観」を一緒に考えてくれるカウンセラーが向いています。",
  },
  support: {
    id: "support",
    name: "全力サポート型",
    subtitle: "引っ張ってほしい・全部頼りたい",
    description:
      "婚活の進め方がよくわからない、または経験が少なく全体をサポートしてほしいタイプ。積極的にリードしてくれるカウンセラーが最適。",
    color: "#6B8FBF",
    gradient: "linear-gradient(135deg,#D4DDE8,#C0CCDA)",
    tags: ["サポート重視", "リード希望", "初めての婚活"],
    counselorTags: ["30代実績多数", "サポート充実"],
    advice:
      "「次は何をすればいい？」を先回りして教えてくれるカウンセラーを選びましょう。",
  },
  strategy: {
    id: "strategy",
    name: "戦略行動型",
    subtitle: "目標明確・効率よく進めたい",
    description:
      "婚活を「プロジェクト」として捉え、効率よく結果を出したいタイプ。率直なフィードバックをくれる、実績重視のカウンセラーと相性がいい。",
    color: "#B8860B",
    gradient: "linear-gradient(135deg,#FEF3C7,#FDE68A)",
    tags: ["目標重視", "率直なアドバイス希望", "実績重視"],
    counselorTags: ["率直なアドバイス", "成婚率が高い"],
    advice:
      "「現状の課題と改善策」を明確に伝えてくれるカウンセラーが向いています。",
  },
  online: {
    id: "online",
    name: "ライフスタイル両立型",
    subtitle: "仕事も婚活も・オンラインで効率よく",
    description:
      "仕事が忙しく、隙間時間を活用したいタイプ。オンライン対応で、活動ペースを柔軟に調整してくれるカウンセラーが最適。",
    color: "#9B7AB5",
    gradient: "linear-gradient(135deg,#E8D8EE,#D4C0E2)",
    tags: ["オンライン希望", "仕事との両立", "柔軟なペース"],
    counselorTags: ["オンライン専門", "IT・医療職サポート"],
    advice:
      "「繁忙期は活動を減らしてOK」と言ってもらえるカウンセラーを選びましょう。",
  },
  restart: {
    id: "restart",
    name: "再スタート応援型",
    subtitle: "慎重に・今度こそ自分らしい出会いを",
    description:
      "過去の経験から慎重になっているタイプ。偏見なく受け入れてくれる、再婚・再スタートの実績があるカウンセラーとの相性が抜群。",
    color: "#C4877A",
    gradient: "linear-gradient(135deg,#E8D8D4,#D4C4C0)",
    tags: ["慎重派", "再婚・再スタート", "偏見なし希望"],
    counselorTags: ["再婚OK", "40代サポート"],
    advice:
      "「再婚でも全く問題ない」と自然に言ってもらえるカウンセラーを選びましょう。",
  },
};

/* ────────────────────────────────────────────────────────────
   スコア計算ロジック
   answers: questionId -> optionIndex のマップ
──────────────────────────────────────────────────────────── */
export function calculateResult(answers: Record<number, number>): DiagnosisTypeId {
  const scores: Record<string, number> = {
    calm: 0,
    self: 0,
    support: 0,
    strategy: 0,
    online: 0,
    restart: 0,
  };

  for (const [qIdStr, optionIndex] of Object.entries(answers)) {
    const qId = Number(qIdStr);
    const question = QUESTIONS.find((q) => q.id === qId);
    if (!question) continue;
    const option = question.options[optionIndex];
    if (!option) continue;
    for (const [typeKey, pts] of Object.entries(option.scores)) {
      if (typeKey in scores) {
        scores[typeKey] += pts as number;
      }
    }
  }

  const winner = Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
  return winner as DiagnosisTypeId;
}
