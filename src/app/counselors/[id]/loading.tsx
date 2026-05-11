/**
 * /counselors/[id] のスケルトン。Kinda talk リールモーダル等からの遷移時に
 * クリック直後に画面が反応するよう、SSR 完了前に表示される。
 */
export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      {/* ヘッダー高さぶんのスペーサー */}
      <div style={{ height: 64 }} />

      {/* ヒーロー部のスケルトン */}
      <div
        style={{
          background:
            "linear-gradient(180deg, #FAF4EA 0%, #F5ECDB 50%, #EFE3CB 100%)",
          padding: "48px 20px 56px",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {/* パンくず */}
          <div className="sk-pulse" style={{ width: 220, height: 12, marginBottom: 24 }} />

          {/* バッジ */}
          <div className="sk-pulse" style={{ width: 180, height: 28, borderRadius: 14, marginBottom: 20 }} />

          {/* アバター + 名前 */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div className="sk-pulse" style={{ width: 80, height: 80, borderRadius: "50%" }} />
            <div>
              <div className="sk-pulse" style={{ width: 200, height: 28, marginBottom: 8 }} />
              <div className="sk-pulse" style={{ width: 140, height: 14 }} />
            </div>
          </div>

          {/* タグ */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <div className="sk-pulse" style={{ width: 80, height: 24, borderRadius: 12 }} />
            <div className="sk-pulse" style={{ width: 100, height: 24, borderRadius: 12 }} />
            <div className="sk-pulse" style={{ width: 90, height: 24, borderRadius: 12 }} />
          </div>
        </div>
      </div>

      {/* コンテンツ部のスケルトン */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px" }}>
        <div className="sk-pulse" style={{ width: 160, height: 24, marginBottom: 24 }} />
        <div className="sk-pulse" style={{ width: "100%", height: 14, marginBottom: 10 }} />
        <div className="sk-pulse" style={{ width: "90%", height: 14, marginBottom: 10 }} />
        <div className="sk-pulse" style={{ width: "92%", height: 14, marginBottom: 32 }} />

        <div className="sk-pulse" style={{ width: 200, height: 24, marginBottom: 16 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <div className="sk-pulse" style={{ height: 200, borderRadius: 16 }} />
          <div className="sk-pulse" style={{ height: 200, borderRadius: 16 }} />
        </div>
      </div>

      <style>{`
        .sk-pulse {
          background: linear-gradient(90deg, rgba(0,0,0,.05), rgba(0,0,0,.09), rgba(0,0,0,.05));
          background-size: 200% 100%;
          border-radius: 6px;
          animation: sk-pulse 1.4s ease-in-out infinite;
        }
        @keyframes sk-pulse {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}
