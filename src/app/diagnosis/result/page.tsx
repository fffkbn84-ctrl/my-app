import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DIAGNOSIS_TYPES, DiagnosisTypeId } from "@/lib/diagnosis";
import { COUNSELORS } from "@/lib/data";

/* ────────────────────────────────────────────────────────────
   タイプ別SVGシンボル
──────────────────────────────────────────────────────────── */
function TypeSymbol({ typeId }: { typeId: DiagnosisTypeId }) {
  switch (typeId) {
    case "calm":
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="32" stroke="#C8A97A" strokeWidth="1.5" fill="rgba(200,169,122,.08)" />
          <path d="M22 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M28 42c2 3 12 3 16 0" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "self":
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="32" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.08)" />
          <circle cx="36" cy="30" r="10" stroke="#7A9E87" strokeWidth="1.5" fill="none" />
          <path d="M20 52c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#7A9E87" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "support":
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="32" stroke="#6B8FBF" strokeWidth="1.5" fill="rgba(107,143,191,.08)" />
          <path d="M24 44V32a12 12 0 0124 0v12" stroke="#6B8FBF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M20 44h32" stroke="#6B8FBF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "strategy":
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="32" stroke="#B8860B" strokeWidth="1.5" fill="rgba(184,134,11,.08)" />
          <path d="M22 50l8-14 8 6 12-20" stroke="#B8860B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "online":
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="32" stroke="#9B7AB5" strokeWidth="1.5" fill="rgba(155,122,181,.08)" />
          <rect x="20" y="26" width="32" height="22" rx="3" stroke="#9B7AB5" strokeWidth="1.5" fill="none" />
          <path d="M28 48v4M44 48v4M24 52h24" stroke="#9B7AB5" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="36" cy="37" r="5" stroke="#9B7AB5" strokeWidth="1.3" fill="none" />
        </svg>
      );
    case "restart":
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="32" stroke="#C4877A" strokeWidth="1.5" fill="rgba(196,135,122,.08)" />
          <path d="M24 36a12 12 0 1112-12" stroke="#C4877A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M36 18l-4-4 4-4" stroke="#C4877A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
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
  const typeId = (type as DiagnosisTypeId) || "calm";
  const diagType = DIAGNOSIS_TYPES[typeId] ?? DIAGNOSIS_TYPES.calm;

  // counselorTagsに一致するカウンセラーを最大2件取得
  const matchedCounselors = COUNSELORS.filter((c) =>
    c.diagnosisTypes?.some((t) => t === typeId)
  ).slice(0, 2);

  const shareText = encodeURIComponent(
    `私の婚活タイプは「${diagType.name}」でした。#ふたりへ`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "var(--white)", paddingTop: 80 }}>

        {/* ═══ 結果ヒーロー ═══ */}
        <div
          style={{
            background: diagType.gradient,
            padding: "56px 32px 48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--mid)",
                fontFamily: "DM Serif Display, serif",
                marginBottom: 16,
              }}
            >
              診断結果
            </div>

            <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
              <TypeSymbol typeId={typeId} />
            </div>

            <h1
              style={{
                fontFamily: "Shippori Mincho, serif",
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 400,
                color: "var(--black)",
                letterSpacing: "0.05em",
                lineHeight: 1.3,
                marginBottom: 12,
              }}
            >
              {diagType.name}
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--ink)",
                letterSpacing: "0.03em",
              }}
            >
              {diagType.subtitle}
            </p>
          </div>
        </div>

        {/* ═══ 結果詳細 ═══ */}
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px" }}>

          {/* ① タイプ説明 */}
          <p
            style={{
              fontSize: 15,
              color: "var(--ink)",
              lineHeight: 2.2,
              marginBottom: 28,
            }}
          >
            {diagType.description}
          </p>

          {/* ② タグ */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {diagType.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 12,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: diagType.gradient,
                  color: "var(--ink)",
                  fontFamily: "Noto Sans JP, sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.03em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ③ カウンセラーへのアドバイス */}
          <div
            className="ep-quote"
            style={{
              marginBottom: 36,
              borderRadius: "0 8px 8px 0",
            }}
          >
            <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 2, fontWeight: 300 }}>
              {diagType.advice}
            </p>
          </div>

          {/* ④ 相性の良いカウンセラー */}
          <div
            style={{
              background: "var(--pale)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--accent)",
                fontFamily: "DM Serif Display, serif",
                marginBottom: 16,
              }}
            >
              このタイプに相性の良いカウンセラー
            </div>

            {matchedCounselors.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {matchedCounselors.map((c) => (
                  <Link
                    key={c.id}
                    href={`/counselors/${c.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      background: "white",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1px solid var(--border)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: c.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <circle cx="11" cy="8" r="4" fill={c.svgColor} opacity=".6" />
                        <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={c.svgColor} strokeWidth="1.2" fill="none" opacity=".4" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          color: "var(--black)",
                          fontFamily: "Noto Sans JP, sans-serif",
                          fontWeight: 400,
                          marginBottom: 2,
                        }}
                      >
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>
                        {c.agencyName} · {c.area}
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M7 4l4 4-4 4" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300 }}>
                近日公開予定です。
              </p>
            )}

            {/* TODO: Supabase連携後、/search に ?type={typeId} パラメータを追加して
                      診断タイプでカウンセラーをフィルタリングできるようにする */}
            <Link
              href="/search"
              className="btn btn-primary"
              style={{ display: "block", textAlign: "center", marginTop: 16 }}
            >
              すべて見る
            </Link>
          </div>

          {/* ⑤ あとから見返したい人向けリンク */}
          {/* TODO: Supabase Auth 実装後、マイページの登録・ログイン画面（/mypage/register 等）に差し替え */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Link
              href="/mypage"
              style={{
                fontSize: 13,
                color: "var(--accent)",
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 300,
                letterSpacing: "0.03em",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              あとから見返したい人はこちら（無料）
            </Link>
          </div>

          {/* ⑥ SNSシェア */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
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
                letterSpacing: "0.03em",
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M12.6 1h2.4L9.6 6.9 16 15h-4.8l-3.6-4.7L3.2 15H.8l5.8-6.6L0 1h4.9l3.3 4.3L12.6 1zM11.8 13.5h1.3L4.3 2.4H2.9l8.9 11.1z" />
              </svg>
              Xでシェアする
            </a>
          </div>

          {/* ⑦ もう一度診断する */}
          <div style={{ textAlign: "center" }}>
            <Link
              href="/diagnosis"
              style={{
                fontSize: 12,
                color: "var(--accent)",
                letterSpacing: "0.05em",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              もう一度診断する
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
