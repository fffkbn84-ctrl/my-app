import type { Metadata } from "next";
import { adminReservations } from "@/lib/mock/admin";

export const metadata: Metadata = {
  title: "予約一覧 | 統括管理 | ふたりへ",
};

export default function AdminReservationsPage() {
  const confirmed = adminReservations.filter((r) => r.status === "confirmed");
  const totalRevenue = confirmed.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <div className="p-8 max-w-5xl">
      {/* ページヘッダー */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-2">
          Reservations
        </p>
        <h1
          className="text-2xl text-ink"
          style={{ fontFamily: "var(--font-mincho)" }}
        >
          予約一覧
        </h1>
        <p className="text-sm text-mid mt-1">
          全 {adminReservations.length} 件 ·
          確定 {confirmed.length} 件 ·
          売上合計 ¥{totalRevenue.toLocaleString()}
        </p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-light p-5">
          <p className="text-xs text-mid tracking-widest uppercase mb-2">
            確定予約
          </p>
          <p
            className="text-3xl font-light"
            style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
          >
            {confirmed.length}
          </p>
          <p className="text-xs text-mid">件</p>
        </div>
        <div className="bg-white rounded-lg border border-light p-5">
          <p className="text-xs text-mid tracking-widest uppercase mb-2">
            キャンセル
          </p>
          <p
            className="text-3xl font-light"
            style={{ fontFamily: "var(--font-serif)", color: "var(--muted)" }}
          >
            {adminReservations.length - confirmed.length}
          </p>
          <p className="text-xs text-mid">件</p>
        </div>
        <div className="bg-white rounded-lg border border-light p-5">
          <p className="text-xs text-mid tracking-widest uppercase mb-2">
            売上合計
          </p>
          <p
            className="text-3xl font-light"
            style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
          >
            ¥{totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-mid">手数料収益</p>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-lg border border-light overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b border-light"
              style={{ background: "var(--pale)" }}
            >
              <th className="text-left px-4 py-3 text-xs text-mid font-normal">
                予約ID
              </th>
              <th className="text-left px-4 py-3 text-xs text-mid font-normal">
                利用者
              </th>
              <th className="text-left px-4 py-3 text-xs text-mid font-normal">
                カウンセラー / 相談所
              </th>
              <th className="text-left px-4 py-3 text-xs text-mid font-normal">
                面談日時
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
            {adminReservations.map((res) => (
              <tr key={res.id} className="border-b border-light last:border-0">
                <td className="px-4 py-3 text-xs text-muted font-mono">
                  #{res.id}
                </td>
                <td className="px-4 py-3">
                  <p className="text-ink text-sm">{res.userName}</p>
                  <p className="text-xs text-muted">{res.userEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-ink text-sm">{res.counselorName}</p>
                  <p className="text-xs text-muted">{res.agencyName}</p>
                </td>
                <td className="px-4 py-3 text-xs text-mid whitespace-nowrap">
                  {res.slotDate}
                </td>
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
                <td className="px-4 py-3 text-right text-sm">
                  {res.revenue > 0 ? (
                    <span style={{ color: "var(--ink)" }}>
                      ¥{res.revenue.toLocaleString()}
                    </span>
                  ) : (
                    <span style={{ color: "var(--muted)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
