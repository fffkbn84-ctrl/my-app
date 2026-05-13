'use client'

/**
 * 「面談完了待ち」セクション
 *
 * Hot Pepper Beauty 方式：店舗（カウンセラー/相談所）側が「来店確認/施術完了」を
 * 押す。ここでは過去の予約（start_at < now）かつ status='active' の予約を
 * 一覧化し、ワンタップで status='completed' / completed_at=now() に更新する。
 *
 * 完了マークがついた時点で user-site のマイページに「面談完了」バッジが立ち、
 * 「口コミを書く」CTA が解禁される。
 */
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, Reservation } from '@/lib/types'

interface Props {
  scopedCounselors: Counselor[]
  onUpdated?: () => void   // 完了マーク後に親の集計を再計算したい場合のフック
}

function formatJa(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const w = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getMonth() + 1}/${d.getDate()}（${w[d.getDay()]}）${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function PendingCompletionsSection({ scopedCounselors, onUpdated }: Props) {
  const [rows, setRows] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const load = async () => {
      const ids = scopedCounselors.map(c => c.id)
      if (ids.length === 0) {
        setRows([])
        setLoading(false)
        return
      }
      const supabase = createClient()
      const nowIso = new Date().toISOString()
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .in('counselor_id', ids)
        .eq('status', 'active')
        .lte('start_at', nowIso)
        .order('start_at', { ascending: false })
        .limit(30)
      setRows((data as Reservation[]) ?? [])
      setLoading(false)
    }
    load()
  }, [scopedCounselors])

  const handleComplete = async (reservation: Reservation) => {
    const ok = window.confirm(
      `この予約を「面談完了」としてマークしますか？\n\n${formatJa(reservation.start_at)}\n${reservation.user_name} さん / ${reservation.counselor_name ?? ''} カウンセラー\n\n※ 完了マーク後、お客様の口コミ投稿が可能になります。`
    )
    if (!ok) return
    setCompletingId(reservation.id)
    const supabase = createClient()
    const { error } = await supabase
      .from('reservations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', reservation.id)
    setCompletingId(null)
    if (error) {
      window.alert(`完了マークに失敗しました：${error.message}`)
      return
    }
    setRows(prev => prev.filter(r => r.id !== reservation.id))
    setToast('面談完了をマークしました')
    setTimeout(() => setToast(''), 2500)
    onUpdated?.()
  }

  if (loading) {
    return (
      <div className="kc-card" style={{ padding: '20px 22px', marginBottom: 28 }}>
        <SectionTitle count={0} loading />
        <p style={{ fontSize: 12, color: 'var(--text-mid)' }}>読み込み中...</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return null   // 空のときはセクションごと出さない（ノイズ削減）
  }

  return (
    <div className="kc-card" style={{ padding: '20px 22px', marginBottom: 28 }}>
      <SectionTitle count={rows.length} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(r => {
          const completing = completingId === r.id
          return (
            <div
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: 'var(--bg-elev)',
                borderRadius: 10,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 12,
                    color: 'var(--text-mid)',
                    marginBottom: 2,
                  }}
                >
                  {formatJa(r.start_at)}
                  {r.meeting_type ? `・${r.meeting_type}` : ''}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-deep)' }}>
                  {r.user_name} さん
                </div>
                {r.counselor_name && (
                  <div style={{ fontSize: 11, color: 'var(--text-light)' }}>
                    担当: {r.counselor_name}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="kc-btn kc-btn-primary kc-btn-sm"
                onClick={() => handleComplete(r)}
                disabled={completing}
                style={{ flexShrink: 0 }}
              >
                {completing ? (
                  '...'
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 7.5L6 11l6-8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    面談完了
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {toast && (
        <div className="kc-toast" style={{ position: 'fixed' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

function SectionTitle({ count, loading = false }: { count: number; loading?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.3" />
        <path d="M4.5 7l2 2 3-4" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-deep)',
          fontFamily: 'Shippori Mincho, serif',
        }}
      >
        面談完了待ち
      </span>
      {!loading && count > 0 && (
        <span
          style={{
            fontSize: 10,
            background: 'rgba(168, 124, 42, .15)',
            color: 'var(--accent)',
            padding: '2px 8px',
            borderRadius: 20,
            marginLeft: 4,
          }}
        >
          {count}件
        </span>
      )}
    </div>
  )
}
