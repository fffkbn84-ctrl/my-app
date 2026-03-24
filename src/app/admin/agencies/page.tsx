import type { Metadata } from "next";
import { adminAgencies } from "@/lib/mock/admin";

export const metadata: Metadata = {
  title: "相談所管理 | 統括管理 | ふたりへ",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-xs">
      <span style={{ color: "var(--accent)" }}>{"★".repeat(Math.round(rating))}</span>
      <span style={{ color: "var(--light)" }}>{"★".repeat(5 - Math.round(rating))}</span>
      <span className="text-mid ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function AdminAgenciesPage() {
  return (
    <div className="p-8 max-w-5xl">
      {/* ページヘッダー */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-2">
          Agencies
        </p>
        <h1
          className="text-2xl text-ink"
          style={{ fontFamily: "var(--font-mincho)" }}
        >
          相談所管理
        </h1>
        <p className="text-sm text-mid mt-1">
          登録相談所 {adminAgencies.length} 社
        </p>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-lg border border-light overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b border-light"
              style={{ background: "var(--pale)" }}
            >
              <th className="text-left px-5 py-3 text-xs text-mid font-normal">
                相談所名
              </th>
              <th className="text-right px-4 py-3 text-xs text-mid font-normal">
                カウンセラー
              </th>
              <th className="text-right px-4 py-3 text-xs text-mid font-normal">
                累計予約
              </th>
              <th className="text-right px-4 py-3 text-xs text-mid font-normal">
                口コミ
              </th>
              <th className="text-right px-4 py-3 text-xs text-mid font-normal">
                平均評価
              </th>
              <th className="text-right px-5 py-3 text-xs text-mid font-normal">
                登録日
              </th>
            </tr>
          </thead>
          <tbody>
            {adminAgencies.map((agency, i) => (
              <tr
                key={agency.id}
                className="border-b border-light last:border-0"
                style={{
                  background: i % 2 === 0 ? "var(--white)" : "var(--pale)",
                }}
              >
                <td className="px-5 py-4">
                  <p className="text-ink font-medium">{agency.name}</p>
                </td>
                <td className="px-4 py-4 text-right text-mid text-xs">
                  {agency.counselorCount} 名
                </td>
                <td className="px-4 py-4 text-right text-mid text-xs">
                  {agency.reservationCount} 件
                </td>
                <td className="px-4 py-4 text-right text-mid text-xs">
                  {agency.reviewCount} 件
                </td>
                <td className="px-4 py-4 text-right">
                  <Stars rating={agency.avgRating} />
                </td>
                <td className="px-5 py-4 text-right text-xs text-muted">
                  {agency.joinedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 注記 */}
      <p className="text-xs text-muted mt-4">
        ※ 最初の100〜150社は1年間掲載無料（面談成立手数料のみ）
      </p>
    </div>
  );
}
