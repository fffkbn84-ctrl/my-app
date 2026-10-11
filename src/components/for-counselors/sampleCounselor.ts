import type { DiagnosisTypeId } from "@/lib/diagnosis";

/**
 * /for-counselors の掲載イメージと記事イメージで使う、架空のカウンセラー。
 * 実在の相談所名は使わない。評価・口コミ数は持たせない。
 * このデータから単独ページは作らない（検索・/columns 一覧に出さないため）。
 */
export const SAMPLE_COUNSELOR = {
  name: "湊 あおい",
  shortName: "湊さん",
  agencyName: "〇〇結婚相談所",
  area: "横浜",
  years: 8,
  diagnosisType: "B" as DiagnosisTypeId,
  catchphrase: "急がなくていいです。話しながら、一緒に整えていきましょう。",
  tags: ["はじめての相談", "オンライン可", "土日の面談"],
  profile:
    "人材紹介の仕事を経て、カウンセラーになりました。最初の面談では、条件より先に、いまの暮らしの話を伺っています。",
  message: "何から話しても大丈夫です。まとまっていなくても、ここで一緒に整理しましょう。",
};
