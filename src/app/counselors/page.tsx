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
    name: "田中 美咲",
    nameKana: "たなか みさき",
    agency: "ブライダルサロン エクラン",
    area: "東京・渋谷",
    specialties: ["初婚", "30代", "キャリア女性"],
    rating: 4.9,
    reviewCount: 47,
    yearsExp: 8,
    intro: "一人ひとりの価値観を大切に、焦らず本当のご縁を一緒に探します。",
    nextAvailable: "4/8",
    fee: "無料",
  },
  {
    id: "2",
    name: "佐藤 あかり",
    nameKana: "さとう あかり",
    agency: "マリーナ結婚相談所",
    area: "東京・銀座",
    specialties: ["再婚", "バツあり", "子持ち"],
    rating: 4.8,
    reviewCount: 32,
    yearsExp: 12,
    intro: "再婚・シングルの方に寄り添い、新しい幸せへの第一歩をサポートします。",
    nextAvailable: "4/6",
    fee: "無料",
  },
  {
    id: "3",
    name: "山本 花子",
    nameKana: "やまもと はなこ",
    agency: "ローズブライダル",
    area: "神奈川・横浜",
    specialties: ["20代", "初婚", "地方在住"],
    rating: 4.7,
    reviewCount: 58,
    yearsExp: 5,
    intro: "婚活が初めての方でも安心。一緒に理想のパートナーを見つけましょう。",
    nextAvailable: "4/10",
    fee: "無料",
  },
  {
    id: "4",
    name: "鈴木 恵",
    nameKana: "すずき めぐみ",
    agency: "プレシャスマリッジ",
    area: "大阪・梅田",
    specialties: ["30代", "40代", "晩婚"],
    rating: 4.8,
    reviewCount: 41,
    yearsExp: 10,
    intro: "年齢を気にせず婚活を楽しんでほしい。あなたのペースに合わせてサポートします。",
    nextAvailable: "4/7",
    fee: "無料",
  },
  {
    id: "5",
    name: "伊藤 由美",
    nameKana: "いとう ゆみ",
    agency: "ハーモニーブライダル",
    area: "愛知・名古屋",
    specialties: ["公務員・教員", "転勤族", "地元重視"],
    rating: 4.6,
    reviewCount: 29,
    yearsExp: 7,
    intro: "地元・名古屋での婚活を全力サポート。安定職の方のお見合い実績豊富です。",
    nextAvailable: "4/9",
    fee: "無料",
  },
  {
    id: "6",
    name: "中村 涼子",
    nameKana: "なかむら りょうこ",
    agency: "ルシェルブライダル",
    area: "東京・新宿",
    specialties: ["海外在住経験", "バイリンガル", "外国籍歓迎"],
    rating: 4.9,
    reviewCount: 22,
    yearsExp: 6,
    intro: "海外在住・帰国子女・外国籍の方の婚活を専門にサポートしています。",
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
