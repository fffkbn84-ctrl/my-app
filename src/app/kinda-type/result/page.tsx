import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import { DIAGNOSIS_TYPES, DiagnosisTypeId } from "@/lib/diagnosis";
import { COUNSELORS } from "@/lib/data";

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

  // JSON-LD 構造化データ（Article schema）
  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main
        style={{
          minHeight: "100vh",
          background: "var(--white)",
          paddingBottom: 80,
        }}
      >
        <div style={{ background: "var(--pale)" }}>
          <SectionSubHeader sectionName="Kinda type" sectionRoot="/kinda-type" />
        </div>
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda type", href: "/kinda-type" },
            { label: "結果" },
          ]}
        />
        <div style={{ maxWidth: 480, margin: "0 auto" }}>

          {/* ══════════════════════════════════
              ① ヒーロー
          ══════════════════════════════════ */}
          <div
            style={{
              background: diagType.gradient,
              padding: "40px 28px 56px",
            }}
          >
            {/* タイプ名 */}
            <h1
              style={{
                fontFamily: "Shippori Mincho, serif",
                fontSize: "clamp(26px, 5vw, 42px)",
                fontWeight: 400,
                color: "var(--black)",
                letterSpacing: "0.05em",
                lineHeight: 1.3,
                marginBottom: 10,
              }}
            >
              {diagType.name}
            </h1>

            {/* label */}
            <p
              style={{
                fontSize: 16,
                color: "var(--ink)",
                marginBottom: 20,
                letterSpacing: "0.02em",
              }}
            >
              {diagType.label}
            </p>

            {/* description 箇条書き */}
            <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {diagType.description.map((d, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `2px solid ${diagType.color}`,
                    paddingLeft: 12,
                    paddingTop: 4,
                    paddingBottom: 4,
                    fontSize: 14,
                    color: "var(--ink)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* タグ */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {diagType.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11,
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: `${diagType.color}18`,
                    border: `1px solid ${diagType.color}40`,
                    color: diagType.color,
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: 400,
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
            style={{
              background: "white",
              border: `1.5px solid ${diagType.color}4D`,
              borderRadius: 20,
              padding: "28px 24px",
              margin: "-20px 20px 0",
              position: "relative",
              zIndex: 1,
              boxShadow: "0 8px 32px rgba(0,0,0,.08)",
            }}
          >
            {/* eyebrow */}
            <div
              style={{
                fontSize: 9,
                letterSpacing: ".18em",
                color: diagType.color,
                fontFamily: "DM Serif Display, serif",
                marginBottom: 12,
              }}
            >
              あなたにおすすめの担当者タイプ
            </div>

            {/* カウンセラータイプ名 */}
            <div
              style={{
                fontFamily: "Shippori Mincho, serif",
                fontSize: 20,
                color: "var(--black)",
                marginBottom: 6,
              }}
            >
              {diagType.counselorType}
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--mid)",
                lineHeight: 2,
                marginBottom: 20,
              }}
            >
              {diagType.counselorDesc}
            </p>

            {/* 区切り線 */}
            <div style={{ borderBottom: "1px solid var(--pale)", marginBottom: 20 }} />

            {/* カウンセラー一覧 */}
            {matchedCounselors.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
                {matchedCounselors.map((c) => (
                  <article
                    key={c.id}
                    style={{
                      position: "relative",
                      padding: "16px 16px 14px",
                      borderRadius: 14,
                      border: "1px solid var(--pale)",
                      background: "white",
                      transition: "border-color .2s",
                    }}
                  >
                    {/* カード全体タップで詳細ページへ（stretched link） */}
                    <Link
                      href={`/counselors/${c.id}`}
                      aria-label={`${c.name}の詳細を見る`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        borderRadius: 14,
                      }}
                    />

                    {/* ヘッダー行：アバター + 名前/相談所 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: c.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                          <circle cx="11" cy="8" r="4" fill={c.svgColor} opacity=".6" />
                          <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={c.svgColor} strokeWidth="1.2" fill="none" opacity=".4" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, color: "var(--black)", fontWeight: 500, marginBottom: 2 }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>
                          {c.agencyName} · {c.area}
                        </div>
                      </div>
                    </div>

                    {/* 評価行：★ + 件数 + 経験年数 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 12,
                        color: "var(--ink)",
                        fontWeight: 300,
                        marginBottom: 12,
                      }}
                      aria-label={`評価 ${c.rating} 5段階中、口コミ ${c.reviewCount} 件、経験 ${c.experience} 年`}
                    >
                      <span style={{ color: diagType.color, fontWeight: 500 }}>★ {c.rating.toFixed(1)}</span>
                      <span style={{ color: "var(--muted)" }}>口コミ {c.reviewCount}件</span>
                      <span style={{ color: "var(--muted)" }}>経験{c.experience}年</span>
                    </div>

                    {/* キャッチコピー（1行レビュー相当） */}
                    {c.catchphrase && (
                      <p
                        style={{
                          fontFamily: "Shippori Mincho, serif",
                          fontSize: 14,
                          color: "var(--black)",
                          lineHeight: 1.6,
                          marginBottom: 12,
                          letterSpacing: ".02em",
                          borderLeft: `2px solid ${diagType.color}`,
                          paddingLeft: 10,
                        }}
                      >
                        「{c.catchphrase}」
                      </p>
                    )}

                    {/* 得意分野タグ（最大2件） */}
                    {c.specialties && c.specialties.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                        {c.specialties.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 10,
                              padding: "3px 9px",
                              borderRadius: 16,
                              background: `${diagType.color}14`,
                              color: diagType.color,
                              fontWeight: 400,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* アクション行：予約ボタン（stretched link より上のレイヤー） */}
                    <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end" }}>
                      <Link
                        href={`/booking/${c.id}`}
                        style={{
                          fontSize: 12,
                          padding: "9px 18px",
                          borderRadius: 50,
                          background: "var(--black)",
                          color: "white",
                          fontFamily: "Noto Sans JP, sans-serif",
                          fontWeight: 400,
                          letterSpacing: ".03em",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        面談を予約する
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, fontWeight: 300 }}>
                近日公開予定です。
              </p>
            )}

            {/* もっと見るリンク */}
            {/* TODO: Supabase連携後、/search に ?type={typeId} パラメータでフィルタリングできるようにする */}
            <Link
              href="/search"
              style={{
                fontSize: 12,
                color: diagType.color,
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 300,
                letterSpacing: ".03em",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              カウンセラーをもっと見る
            </Link>
          </div>

          {/* ══════════════════════════════════
              ③ 分岐テキスト（タイプA以外）
          ══════════════════════════════════ */}
          {typeId !== "A" && (
            <div style={{ padding: "28px 24px 0" }}>
              <p
                style={{
                  fontFamily: "Shippori Mincho, serif",
                  fontSize: 15,
                  color: "var(--ink)",
                  lineHeight: 1.9,
                  letterSpacing: ".03em",
                }}
              >
                ただ今は、<br />
                「誰を選ぶか」で迷いやすい状態でもあります
              </p>
            </div>
          )}

          {/* ══════════════════════════════════
              ④ サブカード（2枚）
          ══════════════════════════════════ */}
          <div
            style={{
              padding: "20px 20px 32px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 4,
            }}
          >
            {[subCard1, subCard2].map((card) => (
              <Link
                key={card.key}
                href={card.href}
                className="diagnosis-sub-card"
              >
                <div style={{ marginBottom: 10 }}>{card.icon}</div>
                <div
                  style={{
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontSize: 13,
                    color: "var(--black)",
                    fontWeight: 400,
                    marginBottom: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    fontWeight: 300,
                    lineHeight: 1.6,
                    marginBottom: 10,
                  }}
                >
                  {card.sub}
                </div>
                <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 300 }}>
                  見てみる →
                </span>
              </Link>
            ))}
          </div>

          {/* ══════════════════════════════════
              ⑤ あとから見返したい人向けリンク
          ══════════════════════════════════ */}
          {/* TODO: Supabase Auth 実装後、マイページの登録・ログイン画面（/mypage/register 等）に差し替え */}
          <div style={{ textAlign: "center", marginBottom: 20, padding: "0 24px" }}>
            <Link
              href="/mypage"
              style={{
                fontSize: 13,
                color: "var(--accent)",
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 300,
                letterSpacing: ".03em",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              あとから見返したい人はこちら（無料）
            </Link>
          </div>

          {/* ══════════════════════════════════
              ⑥ SNSシェア + もう一度
          ══════════════════════════════════ */}
          <div style={{ textAlign: "center", padding: "0 24px 8px" }}>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 24,
                background: "#000",
                color: "white",
                fontSize: 13,
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 300,
                letterSpacing: ".03em",
                textDecoration: "none",
                marginBottom: 20,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M12.6 1h2.4L9.6 6.9 16 15h-4.8l-3.6-4.7L3.2 15H.8l5.8-6.6L0 1h4.9l3.3 4.3L12.6 1zM11.8 13.5h1.3L4.3 2.4H2.9l8.9 11.1z" />
              </svg>
              Xでシェアする
            </a>

            {/* ⑦ もう一度試す */}
            <div>
              <Link
                href="/kinda-type"
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  letterSpacing: ".05em",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                もう一度試す
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
