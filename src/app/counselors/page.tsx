import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CounselorSearch from "@/components/counselors/CounselorSearch";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";

/* ────────────────────────────────────────────────────────────
   モックデータ（後でSupabaseに差し替え）
──────────────────────────────────────────────────────────── */
const counselors = [
  {
    id: "1",
    name: "田中 美紀",
    nameKana: "たなか みき",
    agency: "ブライダルハウス東京",
    area: "東京・銀座",
    specialties: ["傾聴が得意", "30代女性実績多数", "IT・医療職サポート"],
    rating: 4.9,
    reviewCount: 82,
    yearsExp: 11,
    intro: "焦らなくていい、話を聞かせて。約400組の出会いに立ち会ってきました。",
    nextAvailable: "4/8",
    fee: "無料",
  },
  {
    id: "2",
    name: "山田 健太郎",
    nameKana: "やまだ けんたろう",
    agency: "ブライダルハウス東京",
    area: "東京・銀座",
    specialties: ["医師・経営者の婚活", "短期成婚プラン", "男性目線アドバイス"],
    rating: 4.8,
    reviewCount: 41,
    yearsExp: 8,
    intro: "回り道はしない、戦略で結婚する。男性目線で確率を上げます。",
    nextAvailable: "4/6",
    fee: "無料",
  },
  {
    id: "3",
    name: "佐藤 綾乃",
    nameKana: "さとう あやの",
    agency: "リーガルウェディング",
    area: "東京・渋谷",
    specialties: ["価値観の言語化", "30代の自分探し", "押しつけない"],
    rating: 4.9,
    reviewCount: 28,
    yearsExp: 12,
    intro: "あなたの軸を、一緒にさがしましょう。急がない婚活でいい。",
    nextAvailable: "4/10",
    fee: "無料",
  },
  {
    id: "6",
    name: "林 俊介",
    nameKana: "はやし しゅんすけ",
    agency: "コトブキ相談センター",
    area: "東京・新宿",
    specialties: ["20代の婚活", "オンライン専門", "IT・クリエイター職"],
    rating: 4.5,
    reviewCount: 16,
    yearsExp: 4,
    intro: "同世代だから、わかる温度感で。気構えずに、まずは話してみよう。",
    nextAvailable: "4/11",
    fee: "無料",
  },
];

/* ────────────────────────────────────────────────────────────
   ページ（Server Component）
──────────────────────────────────────────────────────────── */
export default function CounselorsPage() {
  return (
    <>
      <Header />

      <main className="pt-16">
        <SectionSubHeader sectionName="Kinda talk" sectionRoot="/kinda-talk" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda talk", href: "/kinda-talk" },
            { label: "カウンセラー一覧" },
          ]}
        />
        {/* ページヘッダー */}
        <section className="bg-pale py-14 md:py-20 border-b border-light">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">
              Counselors
            </p>
            <h1
              className="text-3xl md:text-4xl text-ink mb-3"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              カウンセラーを探す
            </h1>
            <p className="text-sm text-mid">
              {counselors.length}名のカウンセラーが登録中
            </p>
          </div>
        </section>

        {/* 検索・フィルター＋一覧（クライアントコンポーネント） */}
        <CounselorSearch counselors={counselors} />
      </main>

      <Footer />
    </>
  );
}
