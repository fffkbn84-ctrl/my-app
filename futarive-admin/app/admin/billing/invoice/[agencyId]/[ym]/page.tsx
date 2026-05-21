// futarive-admin/app/admin/billing/invoice/[agencyId]/[ym]/page.tsx
//
// 月次請求書ページ（印刷向け）
// URL: /admin/billing/invoice/{agency_id}/{YYYY-MM}
// ブラウザの印刷ダイアログ（Cmd/Ctrl+P）で PDF として保存できる
//
// AdminShell は components/AdminShell.tsx 側で /admin/billing/invoice/ を除外している

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

type Params = Promise<{ agencyId: string; ym: string }>

type AgencyRow = {
  id: string
  name: string
  address?: string | null
}

type CounselorRow = { name: string | null }
type ReservationRow = { user_name: string | null; start_at: string | null }

type BillingEventDetail = {
  id: string
  confirmed_at: string | null
  reservation_at: string | null
  amount_jpy: number
  invoice_number: string | null
  paid_at: string | null
  counselors: CounselorRow | null
  reservations: ReservationRow | null
}

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`
const fmtDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' }) : '—'

export default async function InvoicePage({ params }: { params: Params }) {
  const { agencyId, ym } = await params
  const m = /^(\d{4})-(\d{2})$/.exec(ym)
  if (!m) notFound()
  const year = Number(m[1])
  const month = Number(m[2])

  const supabase = await createClient()

  const startUTC = new Date(Date.UTC(year, month - 1, 1) - 9 * 60 * 60 * 1000) // JST 月初を UTC で
  const endUTC = new Date(Date.UTC(year, month, 1) - 9 * 60 * 60 * 1000)        // 翌月 JST 月初を UTC で

  const { data: agencyData } = await supabase
    .from('agencies').select('*').eq('id', agencyId).maybeSingle()
  const agency = agencyData as AgencyRow | null
  if (!agency) notFound()

  const { data: rawEvents } = await supabase
    .from('billing_events')
    .select('id, confirmed_at, reservation_at, amount_jpy, invoice_number, paid_at, counselors(name), reservations(user_name, start_at)')
    .eq('agency_id', agencyId)
    .eq('status', 'confirmed')
    .gte('confirmed_at', startUTC.toISOString())
    .lt('confirmed_at', endUTC.toISOString())
    .order('confirmed_at', { ascending: true })

  const events = (rawEvents ?? []) as unknown as BillingEventDetail[]

  const total = events.reduce((s, e) => s + (e.amount_jpy ?? 0), 0)
  const invoiceNumber = events[0]?.invoice_number ?? `INV-${year}-${String(month).padStart(2, '0')}-${agencyId.slice(0, 8)}`
  const issueDate = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })

  return (
    <div className="invoice-root">
      <style>{INVOICE_STYLES}</style>

      <div className="no-print invoice-toolbar">
        <button onClick={undefined} className="invoice-toolbar-btn" id="invoice-print-btn">
          🖨 印刷 / PDF 保存
        </button>
        <a href="/admin/billing" className="invoice-toolbar-link">← 課金管理に戻る</a>
        <script dangerouslySetInnerHTML={{ __html: `document.getElementById('invoice-print-btn').addEventListener('click', () => window.print())` }} />
      </div>

      <article className="invoice-page">
        <header className="invoice-header">
          <h1 className="invoice-title">請 求 書</h1>
          <div className="invoice-meta">
            <div>請求書番号：<strong>{invoiceNumber}</strong></div>
            <div>発行日：{issueDate}</div>
            <div>請求対象月：{year}年{month}月</div>
          </div>
        </header>

        <section className="invoice-parties">
          <div className="invoice-to">
            <div className="invoice-label">請求先</div>
            <div className="invoice-name">{agency.name} 御中</div>
            {agency.address && <div className="invoice-addr">{agency.address}</div>}
          </div>

          <div className="invoice-from">
            <div className="invoice-label">請求元</div>
            <div className="invoice-name">ふたりへ運営事務局</div>
            <div className="invoice-addr">
              {/* 本番リリース時に書き換え */}
              〒XXX-XXXX 東京都〇〇区〇〇<br />
              担当：ふうか
            </div>
          </div>
        </section>

        <section className="invoice-summary">
          <div className="invoice-summary-label">ご請求金額（税込）</div>
          <div className="invoice-summary-amount">{yen(total)}</div>
          <div className="invoice-summary-note">
            お振込先：〇〇銀行 〇〇支店 普通 〇〇〇〇〇〇〇 フタリヘウンエイ
          </div>
        </section>

        <section className="invoice-detail">
          <div className="invoice-detail-title">明細</div>
          {events.length === 0 ? (
            <p className="invoice-empty">該当月の請求対象データがありません</p>
          ) : (
            <table className="invoice-table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>確定日</th>
                  <th style={{ width: 100 }}>面談予定</th>
                  <th>カウンセラー</th>
                  <th>利用者</th>
                  <th style={{ width: 90 }}>支払い</th>
                  <th style={{ width: 90, textAlign: 'right' }}>金額</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td>{fmtDate(e.confirmed_at)}</td>
                    <td>{fmtDate(e.reservation_at)}</td>
                    <td>{e.counselors?.name ?? '—'}</td>
                    <td>{e.reservations?.user_name ?? '—'}</td>
                    <td>{e.paid_at ? `済 ${fmtDate(e.paid_at)}` : '—'}</td>
                    <td style={{ textAlign: 'right' }}>{yen(e.amount_jpy)}</td>
                  </tr>
                ))}
                <tr className="invoice-table-total">
                  <td colSpan={5} style={{ textAlign: 'right', fontWeight: 700 }}>合計（{events.length}件）</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{yen(total)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </section>

        <footer className="invoice-footer">
          <p>本請求書は Kinda ふたりへ の利用規約・送客料規定に基づき発行されています。</p>
          <p>ご不明な点は <strong>fffkbn84@gmail.com</strong> までお問い合わせください。</p>
        </footer>
      </article>
    </div>
  )
}

const INVOICE_STYLES = `
  body { background: #F0EDE6; margin: 0; }
  .invoice-root {
    font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif;
    color: #1A1612;
  }
  .invoice-toolbar {
    background: white;
    border-bottom: 1px solid #E5E0D8;
    padding: 12px 24px;
    display: flex;
    gap: 16px;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .invoice-toolbar-btn {
    background: #A87C2A;
    color: white;
    border: none;
    padding: 8px 18px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
  }
  .invoice-toolbar-btn:hover { opacity: 0.9; }
  .invoice-toolbar-link {
    color: #6B6B6B;
    text-decoration: none;
    font-size: 13px;
  }
  .invoice-toolbar-link:hover { color: #A87C2A; }

  .invoice-page {
    max-width: 800px;
    margin: 24px auto;
    background: white;
    padding: 40px 48px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    border-radius: 4px;
  }

  .invoice-header {
    border-bottom: 2px solid #1A1612;
    padding-bottom: 16px;
    margin-bottom: 32px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }
  .invoice-title {
    font-family: 'Shippori Mincho', serif;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: 0.3em;
    margin: 0;
  }
  .invoice-meta {
    font-size: 13px;
    line-height: 1.8;
    text-align: right;
    color: #555;
  }

  .invoice-parties {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }
  .invoice-to, .invoice-from { flex: 1; min-width: 240px; }
  .invoice-label {
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.1em;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .invoice-name {
    font-family: 'Shippori Mincho', serif;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 6px;
  }
  .invoice-addr {
    font-size: 12px;
    color: #666;
    line-height: 1.7;
  }

  .invoice-summary {
    background: #F7F4EF;
    border-left: 4px solid #A87C2A;
    padding: 20px 24px;
    margin-bottom: 32px;
  }
  .invoice-summary-label {
    font-size: 12px;
    color: #888;
    margin-bottom: 6px;
  }
  .invoice-summary-amount {
    font-family: 'DM Sans', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #A87C2A;
    margin-bottom: 10px;
  }
  .invoice-summary-note {
    font-size: 12px;
    color: #666;
  }

  .invoice-detail { margin-bottom: 32px; }
  .invoice-detail-title {
    font-family: 'Shippori Mincho', serif;
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 12px;
    border-left: 3px solid #A87C2A;
    padding-left: 10px;
  }
  .invoice-empty { color: #888; font-size: 13px; padding: 20px 0; }

  .invoice-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .invoice-table th {
    background: #F7F4EF;
    padding: 8px 10px;
    text-align: left;
    font-weight: 500;
    color: #555;
    border-bottom: 1px solid #E5E0D8;
  }
  .invoice-table td {
    padding: 8px 10px;
    border-bottom: 1px solid #F0EDE6;
  }
  .invoice-table-total td {
    background: #FAF7F2;
    border-top: 2px solid #1A1612;
    padding: 12px 10px;
    font-size: 13px;
  }

  .invoice-footer {
    border-top: 1px solid #E5E0D8;
    padding-top: 16px;
    margin-top: 32px;
    font-size: 11px;
    color: #888;
    line-height: 1.8;
  }

  /* === 印刷設定 === */
  @media print {
    @page { size: A4; margin: 12mm; }
    body { background: white; }
    .invoice-toolbar, .no-print { display: none !important; }
    .invoice-page {
      max-width: 100%;
      margin: 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }
    .invoice-summary { break-inside: avoid; }
    .invoice-table { font-size: 11px; }
  }
`
