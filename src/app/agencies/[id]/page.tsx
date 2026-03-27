import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AGENCIES, COUNSELORS, PLAN_PHOTO_LIMITS, type Agency, type Counselor } from "@/lib/data";

/* ────────────────────────────────────────────────────────────
   ユーティリティ
──────────────────────────────────────────────────────────── */
function formatPrice(n: number) {
  return n.toLocaleString("ja-JP") + "円";
}

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12">
          <path
            d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z"
            fill={s <= Math.round(rating) ? "var(--accent)" : "var(--light)"}
          />
        </svg>
      ))}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   カウンセラーカード（横スクロール用）
──────────────────────────────────────────────────────────── */
function CounselorScrollCard({ c }: { c: Counselor }) {
  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        background: "var(--white)",
        border: "1px solid var(--light)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* トップ */}
      <div
        style={{
          background: c.gradient,
          padding: "24px 16px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="5" fill={c.svgColor} opacity=".65" />
            <path
              d="M3 22c0-4.971 4.029-9 9-9s9 4.029 9 9"
              stroke={c.svgColor}
              strokeWidth="1.2"
              fill="none"
              opacity=".45"
            />
          </svg>
        </div>
        <p
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 15,
            color: "var(--ink)",
            letterSpacing: ".04em",
          }}
        >
          {c.name}
        </p>
        <p style={{ fontSize: 10, color: "var(--mid)" }}>{c.role}</p>
        <span
          style={{
            fontSize: 10,
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            borderRadius: 20,
            padding: "2px 10px",
            background: "rgba(200,169,122,.08)",
          }}
        >
          経験 {c.experience}年
        </span>
      </div>

      {/* ボディ */}
      <div style={{ padding: "14px 16px 18px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {c.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                color: "var(--mid)",
                border: "1px solid var(--light)",
                borderRadius: 20,
                padding: "2px 8px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
          <StarRating rating={c.rating} size={11} />
          <span style={{ fontSize: 12, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
            {c.rating}
          </span>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>（{c.reviewCount}件）</span>
        </div>

        <Link
          href={`/counselors/${c.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            width: "100%",
            padding: "9px 0",
            background: "var(--black)",
            color: "var(--white)",
            borderRadius: 50,
            fontSize: 11,
            letterSpacing: ".06em",
            fontFamily: "var(--font-sans)",
          }}
        >
          面談を予約する
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ページ本体
──────────────────────────────────────────────────────────── */
export async function generateStaticParams() {
  return AGENCIES.map((a) => ({ id: String(a.id) }));
}

export default async function AgencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agency: Agency | undefined = AGENCIES.find((a) => a.id === Number(id));
  if (!agency) notFound();

  const counselors = COUNSELORS.filter((c) => agency.counselorIds.includes(c.id));

  return (
    <>
      <Header />

      <main style={{ paddingTop: 64 }}>
        {/* ═══ ヒーロー ═══ */}
        <section
          style={{
            background: agency.gradient,
            padding: "48px 0 0",
          }}
        >
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 40px" }}>
            {/* パンくず */}
            <p style={{ fontSize: 11, color: "rgba(0,0,0,.4)", marginBottom: 24 }}>
              <Link href="/" style={{ color: "inherit" }}>
                ふたりへ
              </Link>
              {" > "}
              <Link href="/search?tab=agency" style={{ color: "inherit" }}>
                相談所を探す
              </Link>
              {" > "}
              <span>{agency.name}</span>
            </p>

            {/* 種別タグ */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {agency.type.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    color: "rgba(0,0,0,.5)",
                    border: "1px solid rgba(0,0,0,.15)",
                    borderRadius: 20,
                    padding: "3px 12px",
                    fontFamily: "DM Sans, sans-serif",
                    letterSpacing: ".1em",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* 相談所名 */}
            <h1
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "clamp(28px,5vw,48px)",
                color: "var(--ink)",
                fontWeight: 400,
                marginBottom: 28,
                lineHeight: 1.3,
              }}
            >
              {agency.name}
            </h1>

            {/* キャンペーンバナー */}
            {agency.campaign && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(200,169,122,.15)",
                  border: "1px solid rgba(200,169,122,.35)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  marginBottom: 24,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1l1.1 3.4H10L7.5 6.6l.9 3L6 8.1l-2.4 1.5.9-3L2 5.4h2.9z" fill="var(--accent)" />
                </svg>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    letterSpacing: ".06em",
                    fontFamily: "Noto Sans JP, sans-serif",
                  }}
                >
                  {agency.campaign}
                </span>
              </div>
            )}

            {/* 統計 */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[
                { label: "口コミ評価", value: String(agency.rating), unit: "" },
                { label: "口コミ件数", value: String(agency.reviewCount), unit: "件" },
                { label: "在籍カウンセラー", value: String(counselors.length), unit: "名" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 32,
                      color: "var(--ink)",
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 4,
                    }}
                  >
                    {stat.value}
                    <span style={{ fontSize: 14, fontFamily: "Noto Sans JP, sans-serif", color: "var(--mid)" }}>
                      {stat.unit}
                    </span>
                  </p>
                  <p style={{ fontSize: 11, color: "var(--mid)", marginTop: 4 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          {/* ═══ ギャラリー ═══ */}
          {agency.photos.length > 0 && (() => {
            const visiblePhotos = agency.photos.slice(0, PLAN_PHOTO_LIMITS[agency.plan]);
            return (
              <section style={{ padding: "56px 0 0" }}>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: ".28em",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    marginBottom: 8,
                    fontFamily: "DM Sans, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 18,
                      height: 1,
                      background: "var(--accent)",
                      verticalAlign: "middle",
                    }}
                  />
                  Gallery
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-mincho)",
                    fontSize: 26,
                    color: "var(--ink)",
                    fontWeight: 400,
                    marginBottom: 20,
                  }}
                >
                  フォトギャラリー
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  {visiblePhotos.map((photo, i) => (
                    <div
                      key={i}
                      style={{
                        height: 180,
                        background: photo.bg,
                        borderRadius: 10,
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* カメラアイコン（プレースホルダー） */}
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" opacity={0.35}>
                        <path
                          d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6z"
                          stroke="var(--ink)"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <circle cx="12" cy="13" r="3" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
                        <path d="M9 3v4h6" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      {/* キャプション */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "20px 12px 10px",
                          background: "linear-gradient(to top, rgba(0,0,0,.35), transparent)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,.9)",
                            letterSpacing: ".04em",
                            fontFamily: "Noto Sans JP, sans-serif",
                          }}
                        >
                          {photo.caption}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* ═══ 料金プラン ═══ */}
          <section style={{ padding: "56px 0 0" }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: ".28em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: 8,
                fontFamily: "DM Sans, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 1,
                  background: "var(--accent)",
                  verticalAlign: "middle",
                }}
              />
              料金プラン
            </p>
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 26,
                color: "var(--ink)",
                fontWeight: 400,
                marginBottom: 24,
              }}
            >
              プランを選ぶ
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {agency.plans.map((plan) => (
                <div
                  key={plan.name}
                  style={{
                    border: plan.popular ? "1px solid var(--accent)" : "1px solid var(--light)",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: plan.popular ? "rgba(200,169,122,.04)" : "var(--white)",
                  }}
                >
                  {/* プランヘッダー */}
                  <div
                    style={{
                      padding: "16px 20px 12px",
                      borderBottom: "1px solid var(--pale)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-mincho)",
                        fontSize: 17,
                        color: "var(--ink)",
                        fontWeight: 400,
                      }}
                    >
                      {plan.name}
                    </p>
                    {plan.popular && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--accent)",
                          background: "rgba(200,169,122,.15)",
                          borderRadius: 20,
                          padding: "2px 10px",
                          letterSpacing: ".06em",
                        }}
                      >
                        人気
                      </span>
                    )}
                  </div>

                  {/* 料金内訳 */}
                  <div style={{ padding: "4px 20px 16px" }}>
                    {[
                      { label: "入会金", value: formatPrice(plan.admission) },
                      { label: "月会費", value: formatPrice(plan.monthly) },
                      { label: "お見合い料", value: plan.omiai === 0 ? "含む" : formatPrice(plan.omiai) },
                      { label: "成婚料", value: formatPrice(plan.marriage) },
                    ].map((row, i, arr) => (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderBottom: i < arr.length - 1 ? "1px solid var(--pale)" : "none",
                        }}
                      >
                        <span style={{ fontSize: 13, color: "var(--mid)" }}>{row.label}</span>
                        <span style={{ fontSize: 15, fontWeight: 400, color: "var(--black)" }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ 特徴 ═══ */}
          <section style={{ padding: "48px 0 0" }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: ".28em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: 8,
                fontFamily: "DM Sans, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 1,
                  background: "var(--accent)",
                  verticalAlign: "middle",
                }}
              />
              Features
            </p>
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 26,
                color: "var(--ink)",
                fontWeight: 400,
                marginBottom: 20,
              }}
            >
              この相談所の特徴
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {agency.features.map((f) => (
                <span
                  key={f}
                  style={{
                    fontSize: 11,
                    color: "var(--mid)",
                    border: "1px solid var(--light)",
                    borderRadius: 20,
                    padding: "5px 12px",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </section>

          {/* ═══ 在籍カウンセラー（横スクロール） ═══ */}
          <section style={{ padding: "56px 0 0" }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: ".28em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: 8,
                fontFamily: "DM Sans, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 1,
                  background: "var(--accent)",
                  verticalAlign: "middle",
                }}
              />
              find your counselor
            </p>
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 26,
                color: "var(--ink)",
                fontWeight: 400,
                marginBottom: 24,
              }}
            >
              在籍カウンセラー
            </h2>

            <div
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                paddingBottom: 16,
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {counselors.map((c) => (
                <CounselorScrollCard key={c.id} c={c} />
              ))}
            </div>
          </section>

          {/* ═══ アクセス・営業時間 ═══ */}
          <section style={{ padding: "56px 0 0" }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: ".28em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: 8,
                fontFamily: "DM Sans, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 1,
                  background: "var(--accent)",
                  verticalAlign: "middle",
                }}
              />
              Access
            </p>
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 26,
                color: "var(--ink)",
                fontWeight: 400,
                marginBottom: 20,
              }}
            >
              アクセス・営業時間
            </h2>

            <div
              style={{
                background: "var(--pale)",
                borderRadius: 12,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {[
                { key: "営業時間", val: agency.hours },
                { key: "定休日", val: agency.holiday },
                { key: "アクセス", val: agency.access },
              ].map((row, i, arr) => (
                <div
                  key={row.key}
                  style={{
                    display: "flex",
                    gap: 24,
                    padding: "14px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--light)" : "none",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      letterSpacing: ".04em",
                      minWidth: 72,
                      paddingTop: 1,
                    }}
                  >
                    {row.key}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--ink)" }}>{row.val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ 口コミ ═══ */}
          <section style={{ padding: "56px 0 100px" }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: ".28em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: 8,
                fontFamily: "DM Sans, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 1,
                  background: "var(--accent)",
                  verticalAlign: "middle",
                }}
              />
              reviews
            </p>
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 26,
                color: "var(--ink)",
                fontWeight: 400,
                marginBottom: 24,
              }}
            >
              口コミ
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {agency.reviews.map((rv) => (
                <div
                  key={rv.id}
                  style={{
                    background: "var(--pale)",
                    borderRadius: 12,
                    padding: "20px 24px",
                    border: "1px solid var(--light)",
                  }}
                >
                  {/* ヘッダー */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* SVGアバター */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "var(--light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="9" r="4" fill="var(--muted)" opacity=".7" />
                          <path
                            d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7"
                            stroke="var(--muted)"
                            strokeWidth="1.3"
                            fill="none"
                            opacity=".5"
                          />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontSize: 13, color: "var(--ink)" }}>{rv.user}</p>
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--green)",
                            background: "rgba(122,158,135,.12)",
                            borderRadius: 20,
                            padding: "1px 8px",
                          }}
                        >
                          面談済み
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StarRating rating={rv.rating} />
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{rv.date}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.8 }}>{rv.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ═══ 固定フッターボタン ═══ */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: "16px 24px",
          background: "linear-gradient(to top, rgba(250,250,248,1) 60%, rgba(250,250,248,0))",
          pointerEvents: "none",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", pointerEvents: "auto" }}>
          <Link
            href={`/search?tab=counselor&agency=${agency.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "15px 24px",
              background: "var(--black)",
              color: "var(--white)",
              borderRadius: 50,
              fontSize: 14,
              letterSpacing: ".08em",
              fontFamily: "var(--font-sans)",
              boxShadow: "0 8px 32px rgba(14,14,14,.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 22c0-4.971 4.029-9 9-9s9 4.029 9 9" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            無料面談を予約する
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
