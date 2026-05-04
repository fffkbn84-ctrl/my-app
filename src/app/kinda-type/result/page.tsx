import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import { DIAGNOSIS_TYPES, DiagnosisTypeId } from "@/lib/diagnosis";
import { COUNSELORS } from "@/lib/data";
import ShareRetryActions from "./ShareRetryActions";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.futarive.jp";

/* ────────────────────────────────────────────────────────────
   メタデータ生成（タイプ別に title / description / OGP / canonical）
──────────────────────────────────────────────────────────── */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const { type } = await searchParams;
  const typeId = (type as DiagnosisTypeId) || "C";
  const dt = DIAGNOSIS_TYPES[typeId] ?? DIAGNOSIS_TYPES.C;

  const title = `${dt.name}｜Kinda type 相性チェック結果`;
  const description = `${dt.label}。${dt.description.join(" / ")}。あなたに合うカウンセラーを Kinda ふたりへで見つけよう。`;
  const url = `${SITE_URL}/kinda-type/result?type=${typeId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Kinda ふたりへ",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ────────────────────────────────────────────────────────────
   サブカード定義
──────────────────────────────────────────────────────────── */
type SubCardDef = {
  key: "cafe" | "beauty" | "column";
  title: string;
  sub: string;
  href: string;
  icon: ReactNode;
};

const SUB_CARDS: Record<"cafe" | "beauty" | "column", SubCardDef> = {
  cafe: {
    key: "cafe",
    title: "お見合い・デートのお店",
    sub: "沈黙しない場所を、知っている",
    href: "/shops",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 10h16v10a3 3 0 01-3 3H9a3 3 0 01-3-3V10z" stroke="#C8A97A" strokeWidth="1.3" fill="none" />
        <path d="M10 10V8a4 4 0 018 0v2" stroke="#C8A97A" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M22 12h2a2 2 0 010 4h-2" stroke="#C8A97A" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  beauty: {
    key: "beauty",
    title: "婚活準備の美容室・サロン",
    sub: "第一印象は、作れる",
    href: "/shops?category=beauty",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="5" stroke="#C4877A" strokeWidth="1.3" fill="none" />
        <path d="M6 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#C4877A" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M19 6l3-3M22 9l-2-2" stroke="#C4877A" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  column: {
    key: "column",
    title: "婚活コラムを読む",
    sub: "整えてから、進もう",
    href: "/columns",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M7 4h10l5 5v15H7V4z" stroke="#6B8FBF" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
        <path d="M17 4v5h5M10 13h8M10 17h5" stroke="#6B8FBF" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
};

function getSubCards(subRoute: "cafe" | "beauty" | "counselor"): [SubCardDef, SubCardDef] {
  if (subRoute === "beauty") return [SUB_CARDS.beauty, SUB_CARDS.cafe];
  if (subRoute === "counselor") return [SUB_CARDS.cafe, SUB_CARDS.column];
  return [SUB_CARDS.cafe, SUB_CARDS.beauty]; // cafe (default)
}

/* ────────────────────────────────────────────────────────────
   ページ
──────────────────────────────────────────────────────────── */
export default async function DiagnosisResultPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const typeId = (type as DiagnosisTypeId) || "C";
  const diagType = DIAGNOSIS_TYPES[typeId] ?? DIAGNOSIS_TYPES.C;

  // typeに合うカウンセラーを最大2件取得
  const matchedCounselors = COUNSELORS.filter(
    (c) => c.diagnosisType === typeId
  ).slice(0, 2);

  const [subCard1, subCard2] = getSubCards(diagType.subRoute);

  const shareText = encodeURIComponent(
    `私は${diagType.name}でした。\n#Kindaふたりへ #相性チェック`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  // JSON-LD 構造化データ（Article + FAQPage schema）
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${diagType.name}｜Kinda type 相性チェック結果`,
      description: diagType.label,
      keywords: ["Kinda type", "相性チェック", "カウンセラー", "結婚相談所", ...diagType.tags],
      inLanguage: "ja-JP",
      isPartOf: {
        "@type": "WebSite",
        name: "Kinda ふたりへ",
        url: SITE_URL,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE_URL}/kinda-type/result?type=${typeId}`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: diagType.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="ktr-main">
        <div className="ktr-subheader-wrap">
          <SectionSubHeader sectionName="Kinda type" sectionRoot="/kinda-type" />
        </div>
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda type", href: "/kinda-type" },
            { label: "結果" },
          ]}
        />
        <div className="ktr-content">

          {/* ══════════════════════════════════
              ① ヒーロー
          ══════════════════════════════════ */}
          <div className="ktr-hero" style={{ background: diagType.gradient }}>
            <h1 className="ktr-hero-title">{diagType.name}</h1>
            <p className="ktr-hero-label">{diagType.label}</p>

            <div className="ktr-hero-desc-list">
              {diagType.description.map((d, i) => (
                <div
                  key={i}
                  className="ktr-hero-desc-item"
                  style={{ borderLeft: `2px solid ${diagType.color}` }}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="ktr-hero-tags">
              {diagType.tags.map((tag) => (
                <span
                  key={tag}
                  className="ktr-hero-tag"
                  style={{
                    background: `${diagType.color}18`,
                    border: `1px solid ${diagType.color}40`,
                    color: diagType.color,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════
              ② メインカード（カウンセラー）
          ══════════════════════════════════ */}
          <div
            className="ktr-main-card"
            style={{ border: `1.5px solid ${diagType.color}4D` }}
          >
            <div className="ktr-eyebrow" style={{ color: diagType.color }}>
              あなたにおすすめの担当者タイプ
            </div>

            <div className="ktr-card-title">{diagType.counselorType}</div>
            <p className="ktr-card-desc">{diagType.counselorDesc}</p>

            <div className="ktr-divider" />

            {/* カウンセラー一覧 */}
            {matchedCounselors.length > 0 ? (
              <div className="ktr-counselor-list">
                {matchedCounselors.map((c) => (
                  <article key={c.id} className="ktr-counselor-card">
                    {/* カード全体タップで詳細ページへ（stretched link） */}
                    <Link
                      href={`/counselors/${c.id}`}
                      aria-label={`${c.name}の詳細を見る`}
                      className="ktr-counselor-stretch"
                    />

                    {/* ヘッダー行：アバター + 名前/相談所 */}
                    <div className="ktr-counselor-head">
                      <div className="ktr-counselor-avatar" style={{ background: c.gradient }}>
                        <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                          <circle cx="11" cy="8" r="4" fill={c.svgColor} opacity=".6" />
                          <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={c.svgColor} strokeWidth="1.2" fill="none" opacity=".4" />
                        </svg>
                      </div>
                      <div className="ktr-counselor-info">
                        <div className="ktr-counselor-name">{c.name}</div>
                        <div className="ktr-counselor-meta">{c.agencyName} · {c.area}</div>
                      </div>
                    </div>

                    {/* 評価行 */}
                    <div
                      className="ktr-counselor-rating"
                      aria-label={`評価 ${c.rating} 5段階中、口コミ ${c.reviewCount} 件、経験 ${c.experience} 年`}
                    >
                      <span className="ktr-counselor-rating-star" style={{ color: diagType.color }}>
                        ★ {c.rating.toFixed(1)}
                      </span>
                      <span className="ktr-counselor-rating-sub">口コミ {c.reviewCount}件</span>
                      <span className="ktr-counselor-rating-sub">経験{c.experience}年</span>
                    </div>

                    {/* キャッチコピー */}
                    {c.catchphrase && (
                      <p
                        className="ktr-counselor-quote"
                        style={{ borderLeft: `2px solid ${diagType.color}` }}
                      >
                        「{c.catchphrase}」
                      </p>
                    )}

                    {/* 得意分野タグ */}
                    {c.specialties && c.specialties.length > 0 && (
                      <div className="ktr-counselor-tags">
                        {c.specialties.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="ktr-counselor-tag"
                            style={{
                              background: `${diagType.color}14`,
                              color: diagType.color,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 予約ボタン（stretched link より上のレイヤー） */}
                    <div className="ktr-counselor-actions">
                      <Link href={`/booking/${c.id}`} className="ktr-counselor-cta">
                        面談を予約する
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="ktr-empty">近日公開予定です。</p>
            )}

            {/* もっと見るリンク */}
            {/* TODO: Supabase連携後、/search に ?type={typeId} パラメータでフィルタリングできるようにする */}
            <Link
              href="/search"
              className="ktr-more-link"
              style={{ color: diagType.color }}
            >
              カウンセラーをもっと見る
            </Link>
          </div>

          {/* ══════════════════════════════════
              ②-2 あるある（共感セクション）
          ══════════════════════════════════ */}
          <section className="ktr-section">
            <div className="ktr-eyebrow" style={{ color: diagType.color }}>
              CHARACTERISTICS
            </div>
            <h2 className="ktr-section-title">こんな自分に、思い当たる？</h2>
            <ul className="ktr-char-list">
              {diagType.characteristics.map((c, i) => (
                <li key={i} className="ktr-char-item">
                  <span
                    className="ktr-char-bullet"
                    style={{ color: diagType.color }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ══════════════════════════════════
              ②-3 関連タイプ
          ══════════════════════════════════ */}
          <section className="ktr-section">
            <div className="ktr-eyebrow" style={{ color: diagType.color }}>
              OTHER TYPES
            </div>
            <h2 className="ktr-section-title">他のタイプとの関係</h2>
            <div className="ktr-related">
              {diagType.similarTypes.map((tid) => {
                const t = DIAGNOSIS_TYPES[tid];
                return (
                  <div key={tid} className="ktr-related-block">
                    <div className="ktr-related-label">似ているタイプ</div>
                    <div
                      className="ktr-related-pill"
                      style={{ background: t.gradient }}
                    >
                      {t.name}
                    </div>
                    <p className="ktr-related-note">{t.label}</p>
                  </div>
                );
              })}
              {diagType.contrastTypes.map((tid) => {
                const t = DIAGNOSIS_TYPES[tid];
                return (
                  <div key={tid} className="ktr-related-block">
                    <div className="ktr-related-label">対照的なタイプ</div>
                    <div
                      className="ktr-related-pill"
                      style={{ background: t.gradient }}
                    >
                      {t.name}
                    </div>
                    <p className="ktr-related-note">{t.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ══════════════════════════════════
              ③ 分岐テキスト（タイプA以外）
          ══════════════════════════════════ */}
          {typeId !== "A" && (
            <div className="ktr-branch">
              <p>
                ただ今は、<br />
                「誰を選ぶか」で迷いやすい状態でもあります
              </p>
            </div>
          )}

          {/* ══════════════════════════════════
              ④ サブカード（2枚）
          ══════════════════════════════════ */}
          <div className="ktr-sub-grid">
            {[subCard1, subCard2].map((card) => (
              <Link
                key={card.key}
                href={card.href}
                className="diagnosis-sub-card"
              >
                <div className="ktr-sub-icon">{card.icon}</div>
                <div className="ktr-sub-title">{card.title}</div>
                <div className="ktr-sub-desc">{card.sub}</div>
                <span className="ktr-sub-arrow">見てみる →</span>
              </Link>
            ))}
          </div>

          {/* ══════════════════════════════════
              ⑤ あとから見返したい人向けリンク
          ══════════════════════════════════ */}
          {/* TODO: Supabase Auth 実装後、マイページの登録・ログイン画面（/mypage/register 等）に差し替え */}
          <div className="ktr-recall">
            <Link href="/mypage" className="ktr-recall-link">
              あとから見返したい人はこちら（無料）
            </Link>
          </div>

          {/* ══════════════════════════════════
              ⑥ SNSシェア + もう一度試す（trackEvent付き Client Component）
          ══════════════════════════════════ */}
          <ShareRetryActions twitterUrl={twitterUrl} resultType={typeId} />

          {/* ══════════════════════════════════
              ⑧ FAQ（最下部・SEO ロングテール対策）
          ══════════════════════════════════ */}
          <section className="ktr-section ktr-faq-section">
            <div className="ktr-eyebrow" style={{ color: diagType.color }}>
              FREQUENTLY ASKED
            </div>
            <h2 className="ktr-section-title">よくある質問</h2>
            <div className="ktr-faq-list">
              {diagType.faqs.map((f, i) => (
                <details key={i} className="ktr-faq-item">
                  <summary className="ktr-faq-q">
                    <span aria-hidden="true" style={{ color: diagType.color }}>
                      Q.
                    </span>
                    <span>{f.q}</span>
                  </summary>
                  <p className="ktr-faq-a">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
