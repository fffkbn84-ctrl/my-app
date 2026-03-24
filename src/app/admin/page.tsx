import type { Metadata } from "next";
import { adminStats, adminReservations, adminReviews } from "@/lib/mock/admin";

export const metadata: Metadata = {
  title: "ダッシュボード | 統括管理 | ふたりへ",
};

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-lg p-6 border border-light bg-white"
    >
      <p className="text-xs tracking-widest text-mid uppercase mb-2">{label}</p>
      <p
        className="text-3xl font-light mb-1"
        style={{
          fontFamily: "var(--font-serif)",
          color: accent ? "var(--accent)" : "var(--ink)",
        }}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-mid">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const recentReservations = adminReservations.slice(0, 5);
  const recentReviews = adminReviews.slice(0, 3);

  return (
    <div className="p-8 max-w-6xl">
      {/* ページヘッダー */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-2">
          Dashboard
        </p>
        <h1
          className="text-2xl text-ink"
          style={{ fontFamily: "var(--font-mincho)" }}
        >
          ダッシュボード
        </h1>
        <p className="text-sm text-mid mt-1">2026年3月 現在</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="今月の予約"
          value={String(adminStats.monthlyReservations)}
          sub="件"
          accent
        />
        <StatCard
          label="今月の売上"
          value={`¥${adminStats.monthlyRevenue.toLocaleString()}`}
          sub="手数料収益"
        />
        <StatCard
          label="累計予約"
          value={String(adminStats.totalReservations)}
          sub="件"
        />
        <StatCard
          label="累計売上"
          value={`¥${adminStats.totalRevenue.toLocaleString()}`}
          sub="累計収益"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard
          label="登録相談所"
          value={String(adminStats.totalAgencies)}
          sub="社"
        />
        <StatCard
          label="登録カウンセラー"
          value={String(adminStats.totalCounselors)}
          sub="名"
        />
        <StatCard
          label="総口コミ数"
          value={String(adminStats.totalReviews)}
          sub="件"
        />
      </div>

      {/* 最近の予約 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-base text-ink"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            最近の予約
          </h2>
          <a
            href="/admin/reservations"
            className="text-xs text-accent hover:underline"
          >
            すべて見る →
          </a>
        </div>
        <div className="bg-white rounded-lg border border-light overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light">
                <th className="text-left px-4 py-3 text-xs text-mid font-normal">
                  利用者
                </th>
                <th className="text-left px-4 py-3 text-xs text-mid font-normal">
                  カウンセラー
                </th>
                <th className="text-left px-4 py-3 text-xs text-mid font-normal">
                  日時
                </th>
                <th className="text-left px-4 py-3 text-xs text-mid font-normal">
                  ステータス
                </th>
                <th className="text-right px-4 py-3 text-xs text-mid font-normal">
                  売上
                </th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((res, i) => (
                <tr
                  key={res.id}
                  className="border-b border-light last:border-0"
                  style={{
                    background: i % 2 === 0 ? "var(--white)" : "var(--pale)",
                  }}
                >
                  <td className="px-4 py-3 text-ink">{res.userName}</td>
                  <td className="px-4 py-3 text-mid text-xs">
                    <div className="text-ink">{res.counselorName}</div>
                    <div className="text-muted">{res.agencyName}</div>
                  </td>
                  <td className="px-4 py-3 text-mid text-xs">{res.slotDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          res.status === "confirmed"
                            ? "rgba(122,158,135,0.15)"
                            : "rgba(160,160,160,0.15)",
                        color:
                          res.status === "confirmed"
                            ? "var(--green)"
                            : "var(--muted)",
                      }}
                    >
                      {res.status === "confirmed" ? "確定" : "キャンセル"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-ink">
                    {res.revenue > 0
                      ? `¥${res.revenue.toLocaleString()}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 最近の口コミ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-base text-ink"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            最近の口コミ
          </h2>
          <a
            href="/admin/reviews"
            className="text-xs text-accent hover:underline"
          >
            すべて見る →
          </a>
        </div>
        <div className="space-y-3">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg border border-light p-4"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-sm text-ink font-medium">
                    {review.counselorName}
                  </span>
                  <span className="text-xs text-mid ml-2">
                    {review.agencyName}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {review.sourceType === "proxy" && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{
                        color: "var(--muted)",
                        borderColor: "var(--light)",
                      }}
                    >
                      代理掲載
                    </span>
                  )}
                  <span
                    className="text-xs"
                    style={{ color: "var(--accent)" }}
                  >
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-mid leading-relaxed line-clamp-2">
                {review.body}
              </p>
              <p className="text-xs text-muted mt-2">
                {review.userName ?? "匿名"} · {review.createdAt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
