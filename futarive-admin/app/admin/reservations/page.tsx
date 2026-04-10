'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
interface ReservationRow {
  id: string
  slot_id: string | null
  counselor_id: string | null
  user_name: string
  user_email: string
  user_phone: string | null
  notes: string | null
  review_token: string | null
  review_code: string | null
  review_token_used: boolean
  created_at: string
}

type ReservationFull = ReservationRow & {
  counselor_name: string
  start_at: string | null
  end_at: string | null
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationFull[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<ReservationFull | null>(null)

  useEffect(() => { loadReservations() }, [])

  async function loadReservations() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('reservations')
      .select('*, counselors(name), slots(start_at, end_at)')
      .order('created_at', { ascending: false })
    setReservations(
      (data ?? []).map((r: Record<string, unknown>) => ({
        ...r,
        counselor_name: (r.counselors as { name?: string } | null)?.name ?? '—',
        start_at: (r.slots as { start_at?: string } | null)?.start_at ?? null,
        end_at: (r.slots as { end_at?: string } | null)?.end_at ?? null,
      })) as ReservationFull[]
    )
    setLoading(false)
  }

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">予約管理</h1>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : reservations.length === 0 ? (
          <div className="empty-state">予約データがありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>面談日時</th>
                  <th>ユーザー名</th>
                  <th>メールアドレス</th>
                  <th>カウンセラー</th>
                  <th>口コミ済み</th>
                  <th>予約日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(r.start_at)}</td>
                    <td style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>{r.user_name}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{r.user_email}</td>
                    <td style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{r.counselor_name}</td>
                    <td>
                      <span className={r.review_token_used ? 'badge badge-published' : 'badge badge-draft'}>
                        {r.review_token_used ? '済み' : '未'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(r.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td>
                      <button onClick={() => setDetail(r)} className="btn btn-ghost btn-sm">詳細</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">予約詳細</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['予約ID', detail.id],
                ['ユーザー名', detail.user_name],
                ['メールアドレス', detail.user_email],
                ['電話番号', detail.user_phone ?? '—'],
                ['カウンセラー', detail.counselor_name],
                ['面談開始', fmt(detail.start_at)],
                ['面談終了', fmt(detail.end_at)],
                ['備考', detail.notes ?? '—'],
                ['口コミトークン', detail.review_token ?? '—'],
                ['口コミコード', detail.review_code ?? '—'],
                ['口コミ済み', detail.review_token_used ? 'はい' : 'いいえ'],
                ['予約日時', fmt(detail.created_at)],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, alignItems: 'start' }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 13, wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setDetail(null)} className="btn btn-ghost">閉じる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
