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

/** ランダムな 6 桁英数（紛らわしい O / 0 / I / 1 は除外） */
function generateReviewCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) {
    s += chars[Math.floor(Math.random() * chars.length)]
  }
  return `TKN-${s}`
}

export default function PendingCompletionsRows({ scopedCounselors, onCountChange }: Props) {
  const [rows, setRows] = useState<Reservation[]>([])
  const [completingId, setCompletingId] = useState<string | null>(null)
  // 完了直後に発行された口コミ受付情報。閉じるまで永続表示する。
  // ふうかさん要望：トースト一瞬で消えるとトークンを控え忘れるため、
  // 明示的に「閉じる」を押すまで URL とコードを画面に残す。
  const [completedInfo, setCompletedInfo] = useState<{
    reservationId: string
    userName: string
    token: string
    code: string
  } | null>(null)
  const [copyFlash, setCopyFlash] = useState<'url' | 'code' | null>(null)

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
    // 既に発行済みなら使い回す（再発行で混乱を生まない）
    const token = reservation.review_token ?? crypto.randomUUID()
    const code = reservation.review_code ?? generateReviewCode()
    const { error } = await supabase
      .from('reservations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        review_token: token,
        review_code: code,
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
    setCompletedInfo({
      reservationId: reservation.id,
      userName: reservation.user_name ?? '',
      token,
      code,
    })
  }

  const reviewUrl = (token: string): string => {
    if (typeof window === 'undefined') return `/reviews/new?token=${token}`
    return `${window.location.origin.replace(/counselor\./, '').replace(/-counselor\b/, '')}/reviews/new?token=${token}`
  }

  const handleCopy = async (kind: 'url' | 'code', text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFlash(kind)
      setTimeout(() => setCopyFlash(null), 1800)
    } catch {
      /* clipboard 拒否は無視（クリック&選択で代替可能） */
    }
  }

  if (rows.length === 0 && !completedInfo) return null

  return (
    <>
      {rows.map(r => {
        const completing = completingId === r.id
        return (
          <div key={r.id} className="todo-row pending-row">
            <span className="todo-tag todo-tag-complete">完了</span>
            <div className="todo-body" style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-deep)' }}>
                {r.user_name} さん
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>
                {formatJa(r.start_at)}
                {r.meeting_type ? ` ・${r.meeting_type}` : ''}
                {r.counselor_name ? ` ・担当: ${r.counselor_name}` : ''}
              </span>
            </div>
            <button
              type="button"
              className="kc-btn kc-btn-primary kc-btn-sm"
              onClick={(e) => {
                e.stopPropagation()
                handleComplete(r)
              }}
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
            ✓ 面談完了 · 口コミ受付 URL を発行しました
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-deep)', lineHeight: 1.7, margin: '0 0 10px' }}>
            下記のリンクまたは認証コードを <b>{completedInfo.userName}</b> 様にお送りください。
            これがあれば「面談済み口コミ」として投稿いただけます。
          </p>
          <div style={{ fontSize: 10, color: 'var(--text-mid)', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>口コミ受付 URL</span>
            <button
              type="button"
              onClick={() => handleCopy('url', reviewUrl(completedInfo.token))}
              style={{
                fontSize: 10,
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '2px 8px',
                cursor: 'pointer',
                color: copyFlash === 'url' ? 'var(--success, #7A9E87)' : 'var(--text-mid)',
              }}
            >
              {copyFlash === 'url' ? '✓ コピーしました' : 'コピー'}
            </button>
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              padding: '6px 10px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              marginBottom: 8,
              wordBreak: 'break-all',
              userSelect: 'all',
            }}
          >
            {reviewUrl(completedInfo.token)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-mid)', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>認証コード（手動入力用）</span>
            <button
              type="button"
              onClick={() => handleCopy('code', completedInfo.code)}
              style={{
                fontSize: 10,
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '2px 8px',
                cursor: 'pointer',
                color: copyFlash === 'code' ? 'var(--success, #7A9E87)' : 'var(--text-mid)',
              }}
            >
              {copyFlash === 'code' ? '✓ コピーしました' : 'コピー'}
            </button>
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: 600,
              padding: '6px 10px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              letterSpacing: '.1em',
              userSelect: 'all',
            }}
          >
            {completedInfo.code}
          </div>
          <p style={{ fontSize: 10, color: 'var(--text-mid)', margin: '10px 0 0', lineHeight: 1.6 }}>
            後からカレンダーの該当予約を開いても同じ情報を確認できます。
          </p>
        </div>
      )}
    </>
  )
}
