/* ────────────────────────────────────────────────────────────
   成婚エピソード モックデータ
   将来的には Supabase の episodes テーブルから取得する
──────────────────────────────────────────────────────────── */

/**
 * ThumbVariant: サムネイルのグラデーション配色キー。
 * Supabase に差し替える際は thumb_image_url 等の画像URLに置き換える。
 */
export type EpisodeThumbVariant = "warm" | "cool" | "green";

export interface EpisodePerson {
  initial: string;
  age: number;
  color: string;
}

export interface Episode {
  id: string;
  agencyName: string;
  agencyId: number;
  counselorName: string;
  counselorId: number;
  /** 例: "9ヶ月で成婚" */
  period: string;
  year: string;
  title: string;
  /** 特集カードにのみ表示する本文抜粋 */
  excerpt?: string;
  /** 例: "S さん（32）× T さん（35）" */
  coupleLabel: string;
  /** true のとき大きく表示するフィーチャーカード */
  featured?: boolean;
  thumbVariant: EpisodeThumbVariant;
  gradient: string;
  person1: EpisodePerson;
  person2: EpisodePerson;
  story: string[];
  quote: string;
  tags: string[];
  sympathyCount: number;
}

export const episodesData: Episode[] = [
  {
    id: "1",
    agencyName: "ブライダルハウス東京",
    agencyId: 1,
    counselorName: "田中 美紀",
    counselorId: 1,
    period: "出会いから9ヶ月で成婚",
    year: "2024年11月",
    title:
      "「カウンセラーに背中を押してもらって、初めて自分の気持ちを正直に話せた気がします」",
    excerpt:
      "32歳のSさんは「押しつけられそう」という先入観から相談所に足が向かなかった。口コミを読んで「この人なら話せる」と予約し、9ヶ月後に成婚。",
    coupleLabel: "S さん（32）× T さん（35）",
    featured: true,
    thumbVariant: "warm",
    gradient: "linear-gradient(135deg,#EDE0D4,#D4C4B0)",
    person1: { initial: "S", age: 32, color: "#C8A97A" },
    person2: { initial: "T", age: 35, color: "#7A9E87" },
    story: [
      "Sさんは32歳のとき、周囲の友人が次々と結婚していく中で「婚活をしなければ」という焦りを感じていました。しかし、婚活サイトを見るたびに比較や愚痴が目に入り、SNSは疲れるだけ。「結婚相談所は入会させることが目的で、お金だけ取られそう」という先入観もありました。",
      "面談の3ヶ月後に活動を開始。Tさんと出会ったのはお見合いから4回目のデートのとき。「普通に話せる人だな」という感覚がだんだんと「この人が好きだ」に変わり、9ヶ月後に成婚退会されました。",
    ],
    quote:
      "「Kinda ふたりへで田中さんの口コミを読んだとき、『この人なら話せるかも』と初めて思いました。面談前日まで緊張していたのに、始まったら20分で緊張が溶けていた。自分でも驚きました。」",
    tags: ["30代女性", "仕事しながら活動", "初めての相談所", "東京", "9ヶ月で成婚"],
    sympathyCount: 47,
  },
  {
    id: "2",
    agencyName: "シンプリーマリッジ",
    agencyId: 3,
    counselorName: "鈴木 麻衣",
    counselorId: 4,
    period: "6ヶ月で成婚",
    year: "2024年9月",
    title: "「再婚への偏見がなかったカウンセラーさんに出会えて、本当によかった」",
    excerpt:
      "再婚を考えていたMさん。「偏見を持たれるかも」という不安を抱えながらも、口コミを見て予約を決意。6ヶ月で成婚。",
    coupleLabel: "M さん（39）× K さん（41）",
    thumbVariant: "cool",
    gradient: "linear-gradient(135deg,#D4DDE8,#C0CCDA)",
    person1: { initial: "M", age: 39, color: "#9B7AB5" },
    person2: { initial: "K", age: 41, color: "#6B8FBF" },
    story: [
      "Mさんは一度目の結婚を経験した後、「再婚希望というだけで難しい顔をされるのでは」という不安から婚活を踏み出せずにいました。",
      "Kinda ふたりへで鈴木カウンセラーの口コミに「再婚の方に寄り添ってくれた」という声を見つけ、予約を決意。初回面談で「再婚は全く問題ない」と言われた瞬間、肩の荷が降りた気がしたといいます。",
    ],
    quote:
      "「最初の面談で『再婚だから難しい』ではなく『あなたの希望を聞かせてください』と言われた。その一言で、この人に任せようと思いました。」",
    tags: ["再婚", "40代", "関西エリア", "6ヶ月で成婚"],
    sympathyCount: 31,
  },
  {
    id: "3",
    agencyName: "コトブキ相談センター",
    agencyId: 5,
    counselorName: "林 俊介",
    counselorId: 6,
    period: "11ヶ月で成婚",
    year: "2024年8月",
    title: "「仕事が忙しすぎて無理だと思っていたけど、ペースを合わせてくれた」",
    excerpt:
      "IT企業勤務のAさん。多忙を理由に婚活を先延ばしにしてきたが、オンライン対応のカウンセラーと出会い11ヶ月で成婚。",
    coupleLabel: "A さん（28）× R さん（31）",
    thumbVariant: "green",
    gradient: "linear-gradient(135deg,#D8E4D8,#C4D4C4)",
    person1: { initial: "A", age: 28, color: "#7A9E87" },
    person2: { initial: "R", age: 31, color: "#C8A97A" },
    story: [
      "Aさんはエンジニアとして働く28歳。残業が多く、「今は婚活できない」と3年間先延ばしにしてきました。",
      "Kinda ふたりへでオンライン専門の林カウンセラーを見つけ、「通勤時間ゼロで相談できる」ことを知り予約。仕事の繁忙期には活動ペースを落とす柔軟な対応をしてもらいながら、11ヶ月後に成婚。",
    ],
    quote:
      "「『忙しいから婚活できない』は言い訳だったかもしれない。でも実際に活動してみたら、仕事と両立できた。林さんがペースを作ってくれたおかげです。」",
    tags: ["20代", "IT・エンジニア", "オンライン婚活", "11ヶ月で成婚"],
    sympathyCount: 28,
  },
];
