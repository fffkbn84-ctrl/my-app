'use client'

/**
 * 「面談完了待ち」— ダッシュボードの「ちいさな『しなきゃ』」カード内に
 * 行として埋め込むコンポーネント。
 *
 * Hot Pepper Beauty 方式：店舗（カウンセラー/相談所）側がワンタップで
 * 面談完了をマークし、お客様の口コミ投稿を解禁する設計。
 *
 * 親（dashboard）には件数を onCountChange で通知し、しなきゃ全体の件数バッジに
 * 合算してもらう。0 件のときは何もレンダリングしない。
 */
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, Reservation } from '@/lib/types'

interface Props {
  scopedCounselors: Counselor[]
  /** 完了待ち件数が変化したときに親へ通知（しなきゃ件数バッジ用） */
  onCountChange?: (count: number) => void
}

function formatJa(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const w = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getMonth() + 1}/${d.getDate()}（${w[d.getDay()]}）${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function PendingCompletionsRows({ scopedCounselors, onCountChange }: Props) {
  const [rows, setRows] = useState<Reservation[]>([])
  const [completingId, setCompletingId] = useState<string | null>(null)
  // 完了直後の案内（閉じるまで表示）。口コミはお客様がマイページから投稿する運用。
  const [completedInfo, setCompletedInfo] = useState<{ userName: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      const ids = scopedCounselors.map(c => c.id)
      if (ids.length === 0) {
        setRows([])
        onCountChange?.(0)
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
      const list = (data as Reservation[]) ?? []
      setRows(list)
      onCountChange?.(list.length)
    }
    load()
    // onCountChange は親で useCallback されない想定なので依存に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedCounselors])

  const handleComplete = async (reservation: Reservation) => {
    const ok = window.confirm(
      `この予約を「面談完了」としてマークしますか？\n\n${formatJa(reservation.start_at)}\n${reservation.user_name} さん / ${reservation.counselor_name ?? ''} カウンセラー\n\n※ 完了マーク後、お客様の口コミ投稿が可能になります。`
    )
    if (!ok) return
    setCompletingId(reservation.id)
    const supabase = createClient()
    // 口コミはお客様がマイページから投稿する運用（認証コード発行・送付は不要）。
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
    setRows(prev => {
      const next = prev.filter(r => r.id !== reservation.id)
      onCountChange?.(next.length)
      return next
    })
    setCompletedInfo({ userName: reservation.user_name ?? '' })
  }

  if (rows.length === 0 && !completedInfo) return null

  return (
    <>
      {rows.map(r => {
        const completing = completingId === r.id
        return (
          <div key={r.id} className="todo-row pending-row">
            <span className="todo-tag todo-tag-complete">要・完了</span>
            <div className="todo-body" style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-deep)' }}>
                {r.user_name} さん
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>
                {formatJa(r.start_at)}
                {r.meeting_type ? ` ・${r.meeting_type}` : ''}
                {r.counselor_name ? ` ・担当: ${r.counselor_name}` : ''}
              </span>
            </div>
            <button
              type="button"
              className="kc-btn kc-btn-primary pending-action"
              onClick={(e) => {
                e.stopPropagation()
                handleComplete(r)
              }}
              disabled={completing}
              style={{ flexShrink: 0 }}
            >
              {completing ? (
                '処理中…'
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2 7.5L6 11l6-8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  完了をマーク
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ marginLeft: 2, opacity: .8 }}>
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        )
      })}

      {/* 完了直後の口コミ受付情報カード — 閉じるまで永続表示 */}
      {completedInfo && (
        <div
          style={{
            marginTop: 12,
            padding: '14px 16px',
            background: 'rgba(122,158,135,.1)',
            border: '1.5px solid rgba(122,158,135,.5)',
            borderRadius: 12,
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={() => setCompletedInfo(null)}
            aria-label="閉じる"
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-mid)',
              fontSize: 18,
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
          <div
            style={{
              fontSize: 11,
              color: 'var(--success, #7A9E87)',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '.16em',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            ✓ 面談完了
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-deep)', lineHeight: 1.7, margin: 0 }}>
            <b>{completedInfo.userName}</b> 様は、ご自身のマイページから口コミを投稿できるようになりました。
            こちらでの操作や、URL・コードのお渡しは不要です。
          </p>
        </div>
      )}
    </>
  )
}
