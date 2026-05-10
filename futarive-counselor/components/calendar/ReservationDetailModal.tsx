'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logPersonalDataAccess } from '@/lib/supabase/audit'
import type { Reservation } from '@/lib/types'

interface Props {
  slotId: string
  onClose: () => void
}

export default function ReservationDetailModal({ slotId, onClose }: Props) {
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data, error: rvErr } = await supabase
        .from('reservations')
        .select('*')
        .eq('slot_id', slotId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (rvErr) {
        setError('予約情報の取得に失敗しました')
        setLoading(false)
        return
      }
      setReservation(data as Reservation | null)
      setLoading(false)

      // 個人情報閲覧ログ
      if (data) {
        logPersonalDataAccess('reservations', data.id, data.user_id ?? null)
      }
    }
    load()
  }, [slotId])

  const fmtDateTime = (iso: string | null) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleString('ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric',
      weekday: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  const statusLabel = (s: Reservation['status']) =>
    s === 'active' ? '予約中' : s === 'canceled' ? 'キャンセル済' : '面談完了'

  return (
    <div className="kc-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="kc-modal" style={{ maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="kc-modal-title" style={{ margin: 0 }}>予約者情報</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }} aria-label="閉じる">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--text-mid)', padding: '20px 0', textAlign: 'center' }}>
            読み込み中…
          </p>
        ) : error ? (
          <p style={{ fontSize: 13, color: 'var(--danger)', padding: '12px 14px', background: 'var(--bg-elev)', borderRadius: 10 }}>
            {error}
          </p>
        ) : !reservation ? (
          <div style={{
            padding: '20px 16px',
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            fontSize: 12,
            color: 'var(--text-mid)',
            lineHeight: 1.8,
          }}>
            この予約枠は <strong>booked</strong> ですが、結びついた予約レコードが見つかりませんでした。
            <br/>
            手動でステータス変更された可能性があります。
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* ステータスバッジ */}
            <div>
              <span className={`kc-badge kc-badge-${reservation.status === 'active' ? 'booked' : reservation.status === 'canceled' ? 'locked' : 'open'}`}>
                {statusLabel(reservation.status)}
              </span>
              {reservation.meeting_type && (
                <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-mid)' }}>
                  {reservation.meeting_type}
                </span>
              )}
            </div>

            <Field label="面談日時" value={fmtDateTime(reservation.start_at)} />
            <Field label="お名前" value={reservation.user_name || '（未入力）'} />
            <Field
              label="メールアドレス"
              value={reservation.user_email || '（未入力）'}
              copyable
            />
            {reservation.user_phone && (
              <Field
                label="電話番号"
                value={reservation.user_phone}
                copyable
              />
            )}

            {reservation.memo && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>
                  ご相談メモ
                </div>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text-deep)',
                  lineHeight: 1.8,
                  padding: '10px 12px',
                  background: 'var(--bg-elev)',
                  borderRadius: 10,
                  whiteSpace: 'pre-wrap',
                }}>
                  {reservation.memo}
                </div>
              </div>
            )}

            {reservation.status === 'canceled' && reservation.cancel_reason && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>
                  キャンセル理由
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-mid)',
                  lineHeight: 1.7,
                  padding: '8px 12px',
                  background: 'var(--bg-elev)',
                  borderRadius: 10,
                }}>
                  {reservation.cancel_reason}
                </div>
              </div>
            )}

            <div style={{
              fontSize: 10,
              color: 'var(--text-light)',
              paddingTop: 6,
              borderTop: '1px solid var(--border)',
              lineHeight: 1.7,
            }}>
              申込日時：{fmtDateTime(reservation.created_at)}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <button className="kc-btn kc-btn-ghost" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // noop
    }
  }
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          flex: 1,
          fontSize: 14,
          color: 'var(--text-deep)',
          lineHeight: 1.6,
          wordBreak: 'break-all',
        }}>
          {value}
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="kc-btn kc-btn-ghost kc-btn-sm"
            style={{ flexShrink: 0 }}
            aria-label={`${label}をコピー`}
          >
            {copied ? '✓' : 'コピー'}
          </button>
        )}
      </div>
    </div>
  )
}
