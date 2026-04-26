import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { placesHomeData } from "@/lib/mock/places-home";
import type { BadgeType } from "@/lib/mock/places-home";

/* ────────────────────────────────────────────────────────────
   モック口コミ
──────────────────────────────────────────────────────────── */
const shopReviews: Record<string, {
  id: string; rating: number; title: string; text: string; author: string; date: string; situation: string;
}[]> = {
  "5": [
    { id: "r1", rating: 5, title: "お見合いに完璧な空間でした", text: "個室で周りを気にせず話せました。スタッフの方々も気を利かせてくれて、程よいタイミングで席を外してくれました。料理も美味しく、会話が弾みました。初対面でも緊張しにくい雰囲気です。", author: "30代・女性", date: "2026年2月", situation: "お見合い" },
    { id: "r2", rating: 5, title: "雰囲気が最高、リピート確定", text: "ソムリエのいるフレンチで、ワインの話をしながら自然に打ち解けられました。2回目のデートで利用しましたが、相手にも喜んでもらえました。少し値段は張りますが、特別な日にふさわしいお店です。", author: "30代・男性", date: "2026年1月", situation: "2回目以降のデート" },
    { id: "r3", rating: 4, title: "予約必須ですが価値あり", text: "人気店なので予約が取りづらいですが、それだけの価値はあります。個室は少し狭いですが、二人でゆっくり話すには十分。お料理のクオリティが高くデート全体の満足度が上がりました。", author: "20代・女性", date: "2025年12月", situation: "初デート" },
  ],
  "6": [
    { id: "r4", rating: 5, title: "初デートにちょうどいい距離感", text: "銀座の和カフェで、落ち着いた雰囲気がちょうどよかったです。お茶とお菓子を楽しみながら自然に話が進みました。コースではなく単品で頼めるので、時間調整がしやすいのも良かった。", author: "30代・女性", date: "2026年2月", situation: "初デート" },
    { id: "r5", rating: 4, title: "和の雰囲気でリラックスできた", text: "抹茶スイーツが美味しく、話題にもなりました。個室は2組限定なので早めの予約がベターです。スタッフの対応も丁寧で、婚活慣れした様子が感じられました。", author: "40代・女性", date: "2026年1月", situation: "お見合い" },
  ],
  "9": [
    { id: "r6", rating: 5, title: "特別感が最高。プロポーズにも", text: "鉄板焼きの目の前でのパフォーマンスが会話のきっかけになりました。個室でプロポーズしたのですが、スタッフの方が花を用意してくれて感動しました。一生の思い出になりました。", author: "30代・男性", date: "2026年3月", situation: "プロポーズ" },
    { id: "r7", rating: 5, title: "大切な人との食事に間違いない", text: "値段は高いですが、それ以上の体験ができます。シェフの技術を見ながら自然と会話が弾みます。お見合い2回目のデートで利用しましたが、相手の評価がぐっと上がりました（笑）。", author: "30代・男性", date: "2026年2月", situation: "2回目以降のデート" },
  ],
};

/* ────────────────────────────────────────────────────────────
   バッジ設定
──────────────────────────────────────────────────────────── */
const BADGE_CONFIG: Record<BadgeType, { label: string; color: string; bg: string }> = {
  certified: { label: "Kinda ふたりへ取材済み", color: "var(--accent)", bg: "color-mix(in srgb, var(--accent) 12%, transparent)" },
  agency:    { label: "相談所おすすめ",   color: "var(--blue)",   bg: "color-mix(in srgb, var(--blue) 12%, transparent)" },
  listed:    { label: "掲載店",           color: "var(--muted)",  bg: "color-mix(in srgb, var(--muted) 12%, transparent)" },
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 12 12"
          fill={star <= Math.round(rating) ? "var(--accent)" : "var(--light)"}>
          <path d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z" />
        </svg>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ページ
──────────────────────────────────────────────────────────── */
export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopData = placesHomeData.find((s) => s.id === id);
  if (!shopData) notFound();
  const shop = shopData;

  const reviews = shopReviews[id] ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;
  const badge = BADGE_CONFIG[shop.badgeType];

  return (
    <>
      <Header />

      <main className="pt-16">
        {/* パンくず */}
        <div className="bg-pale border-b border-light">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-ink transition-colors">トップ</Link>
            <span>/</span>
            <Link href="/shops" className="hover:text-ink transition-colors">お店一覧</Link>
            <span>/</span>
            <span className="text-ink">{shop.name}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ─── 左カラム ─── */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-5">

                {/* お店カード */}
                <div className="bg-white rounded-2xl border border-light overflow-hidden">
                  <div className="aspect-video bg-pale flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.15">
                      <path d="M16 8v12c0 4 3 7 7 7v13" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                      <path d="M24 8v32" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                      <path d="M32 8c0 0 0 8-4 11v21" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                      <path d="M16 8c0 0 0 6 0 10" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="p-6">
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full mb-3"
                      style={{ color: badge.color, background: badge.bg }}
                    >
                      {shop.badgeType === "certified" && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                          <path d="M5 0a5 5 0 100 10A5 5 0 005 0zm2.3 3.8L4.5 6.6 2.7 4.8a.5.5 0 00-.7.7l2.1 2.1a.5.5 0 00.7 0l3.2-3.2a.5.5 0 00-.7-.6z" />
                        </svg>
                      )}
                      {badge.label}
                    </span>

                    <h1 className="text-xl text-ink mb-1" style={{ fontFamily: "var(--font-mincho)" }}>
                      {shop.name}
                    </h1>

                    <p className="text-xs text-muted flex items-center gap-1 mb-4">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5.5 1C3.6 1 2 2.6 2 4.5c0 2.8 3.5 5.5 3.5 5.5S9 7.3 9 4.5C9 2.6 7.4 1 5.5 1z" />
                        <circle cx="5.5" cy="4.5" r="1.2" />
                      </svg>
                      {shop.location}
                    </p>

                    {avgRating !== null && (
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-light">
                        <StarRating rating={avgRating} size={16} />
                        <span className="text-lg font-medium text-ink">{avgRating.toFixed(1)}</span>
                        <span className="text-sm text-muted">({reviews.length}件)</span>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      {[
                        { label: "カテゴリ", value: shop.categoryLabel },
                        ...(shop.priceRange ? [{ label: "価格帯", value: shop.priceRange }] : []),
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between text-sm">
                          <span className="text-muted text-xs">{item.label}</span>
                          <span className="text-ink text-xs">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {shop.features.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-pale text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 口コミ投稿CTA */}
                <div className="bg-pale rounded-2xl border border-light p-5">
                  <p className="text-xs text-muted mb-2">このお店を利用したことがありますか？</p>
                  <p className="text-sm text-ink mb-4" style={{ fontFamily: "var(--font-mincho)" }}>
                    口コミを投稿して、婚活する人たちの参考に
                  </p>
                  <Link
                    href={`/shops/${shop.id}/review`}
                    className="block w-full text-center px-5 py-3 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-all duration-200"
                    style={{ boxShadow: "0 4px 16px rgba(200,169,122,0.25)" }}
                  >
                    口コミを書く
                  </Link>
                  <p className="text-xs text-muted text-center mt-2">利用後なら誰でも投稿できます</p>
                </div>
              </div>
            </aside>

            {/* ─── 右カラム ─── */}
            <div className="lg:col-span-2 space-y-10">

              {/* お店紹介 */}
              <section>
                <h2 className="text-lg text-ink mb-4 pb-3 border-b border-light" style={{ fontFamily: "var(--font-mincho)" }}>
                  お店について
                </h2>
                <p className="text-sm text-mid leading-relaxed">{shop.description}</p>

                {shop.badgeType === "certified" && (
                  <div
                    className="mt-5 p-4 rounded-xl border-l-4 bg-pale text-xs text-mid leading-relaxed"
                    style={{ borderLeftColor: "var(--accent)" }}
                  >
                    <p className="font-medium text-ink mb-1">Kinda ふたりへ取材メモ</p>
                    <p>Kinda ふたりへスタッフが実際に訪問し、婚活・お見合いシーンでの利用に適しているか確認しました。個室・半個室の有無、スタッフの配慮、雰囲気などを総合的に評価しています。</p>
                  </div>
                )}
              </section>

              {/* 口コミ */}
              <section>
                <div className="flex items-end justify-between mb-4 pb-3 border-b border-light">
                  <h2 className="text-lg text-ink" style={{ fontFamily: "var(--font-mincho)" }}>
                    口コミ・評価
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">{reviews.length}件</span>
                    <Link
                      href={`/shops/${shop.id}/review`}
                      className="text-xs text-accent hover:opacity-70 transition-opacity flex items-center gap-1"
                    >
                      ＋ 口コミを書く
                    </Link>
                  </div>
                </div>

                {reviews.length > 0 ? (
                  <>
                    {avgRating !== null && (
                      <div className="bg-pale rounded-2xl p-6 mb-6 flex items-center gap-6">
                        <div className="text-center shrink-0">
                          <p className="text-5xl text-ink leading-none mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                            {avgRating.toFixed(1)}
                          </p>
                          <StarRating rating={avgRating} size={16} />
                          <p className="text-xs text-muted mt-1">{reviews.length}件</p>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviews.filter((r) => r.rating === star).length;
                            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                            return (
                              <div key={star} className="flex items-center gap-2 text-xs">
                                <span className="text-muted w-3">{star}</span>
                                <div className="flex-1 h-1.5 bg-light rounded-full overflow-hidden">
                                  <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-muted w-4">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-6 border border-light">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <StarRating rating={review.rating} />
                              <h3 className="text-sm font-medium text-ink mt-2">{review.title}</h3>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
                              >
                                {review.situation}
                              </span>
                              <p className="text-xs text-muted mt-1">{review.date}</p>
                            </div>
                          </div>
                          <p className="text-sm text-mid leading-relaxed">{review.text}</p>
                          <p className="text-xs text-muted mt-3">{review.author}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-sm text-muted mb-4">まだ口コミがありません</p>
                    <Link
                      href={`/shops/${shop.id}/review`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity"
                    >
                      最初の口コミを書く
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* モバイル固定CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-light p-4">
        <Link
          href={`/shops/${shop.id}/review`}
          className="block w-full text-center px-6 py-3.5 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-all duration-200"
        >
          このお店の口コミを書く
        </Link>
      </div>

      <Footer />
    </>
  );
}
