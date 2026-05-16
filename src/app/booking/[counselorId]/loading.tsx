/**
 * /booking/[counselorId] のスケルトン。
 * カウンセラー詳細から「予約する」をタップした瞬間に表示される。
 * SSR の getCounselorById + getAgencyById が走り終わるまで体感を埋める。
 */
export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      {/* ヘッダー高さぶんのスペーサー */}
      <div style={{ height: 64 }} />

      {/* ページ見出し領域 */}
      <div style={{ maxWidth: 768, margin: "0 auto", padding: "60px 20px 40px" }}>
        <div className="bk-sk-pulse" style={{ width: 130, height: 11, marginBottom: 14 }} />
        <div className="bk-sk-pulse" style={{ width: "70%", height: 36, marginBottom: 14 }} />
        <div className="bk-sk-pulse" style={{ width: "55%", height: 13 }} />
      </div>

      {/* ステップインジケーター（4 ステップ） */}
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto 32px",
          padding: "0 20px",
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", flex: 1 }}>
            <div className="bk-sk-pulse" style={{ width: 28, height: 28, borderRadius: "50%" }} />
            <div className="bk-sk-pulse" style={{ width: 56, height: 10 }} />
          </div>
        ))}
      </div>

      {/* カレンダーカード */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px" }}>
        <div
          className="bk-sk-pulse"
          style={{ width: "100%", height: 400, borderRadius: 16 }}
        />
        <div className="bk-sk-pulse" style={{ width: "100%", height: 56, borderRadius: 28, marginTop: 24 }} />
      </div>

      <style>{`
        .bk-sk-pulse {
          background: linear-gradient(90deg, rgba(0,0,0,.05), rgba(0,0,0,.09), rgba(0,0,0,.05));
          background-size: 200% 100%;
          border-radius: 6px;
          animation: bk-sk-pulse 1.4s ease-in-out infinite;
        }
        @keyframes bk-sk-pulse {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}
