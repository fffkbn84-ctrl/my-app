'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, Reservation } from '@/lib/types'

/**
 * 「これからの面談」セクション — dashboard のトップに表示する前日リマインダー兼予約確認。
 *
 * 構成:
 *  1. 明日の面談（強調・前日リマインダー）
 *  2. 直近 7 日の面談（通常表示）
 *  3. 質問あり（notes 入力あり）の予約は「要返信」or「返信済」バッジを併記
 *
 * 予約が 0 件なら丸ごと非表示。
 * カウンセラーが「予約確定したもの・明日来るもの」を朝イチ確認できる箱。
 */

interface Props {
  scopedCounselors: Counselor[]
}

// Reservation 型に notes が無いので Row 取得用に extend（DB の実カラムは notes）
type ReservationWithNotes = Reservation & {
  notes?: string | null
}

export default function UpcomingReservationsSection({ scopedCounselors }: Props) {
  const [reservations, setReservations] = useState<ReservationWithNotes[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      if (scopedCounselors.length === 0) {
        if (active) {
          setReservations([])
          setLoading(false)
        }
        return
      }
      const supabase = createClient()
      const ids = scopedCounselors.map((c) => c.id)
      const now = new Date()
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .in('counselor_id', ids)
        .eq('status', 'active')
        .gte('start_at', now.toISOString())
        .lte('start_at', sevenDaysLater.toISOString())
        .order('start_at', { ascending: true })
        .limit(20)
      if (!active) return
      setReservations((data as ReservationWithNotes[]) ?? [])
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [scopedCounselors])

  if (loading) return null
  if (reservations.length === 0) return null

  // 明日 = 翌日 00:00 〜 翌々日 00:00（端末ローカル時刻）
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

  const tomorrowItems = reservations.filter((r) => {
    if (!r.start_at) return false
    const t = new Date(r.start_at).getTime()
    return t >= tomorrow.getTime() && t < dayAfterTomorrow.getTime()
  })
  const upcomingItems = reservations.filter((r) => !tomorrowItems.includes(r))

  // 質問あり（notes 入力済み）かつ未返信の数
  const needsReplyCount = reservations.filter(
    (r) => r.notes && r.notes.trim().length > 0 && !r.agency_message
  ).length

  return (
    <div
      style={{
        background: 'rgba(168,136,88,.06)',
        border: '1px solid rgba(168,136,88,.2)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 12,
        padding: '16px 18px',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontFamily: 'Shippori Mincho, serif',
              fontWeight: 500,
              fontSize: 15,
              color: 'var(--text-deep)',
            }}
          >
            これからの面談
          </span>
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 10,
              color: 'var(--accent)',
              letterSpacing: '.1em',
            }}
          >
            {reservations.length} 件
            {needsReplyCount > 0 && ` · 要返信 ${needsReplyCount}`}
          </span>
        </div>
        <Link
          href="/calendar"
          style={{
            fontSize: 11,
            color: 'var(--accent)',
            textDecoration: 'none',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '.06em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          カレンダーで見る
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 6h8M6 2l4 4-4 4" />
          </svg>
        </Link>
      </div>

      {tomorrowItems.length > 0 && (
        <div style={{ marginBottom: upcomingItems.length > 0 ? 14 : 0 }}>
          <p
            style={{
              fontSize: 10,
              color: 'var(--accent)',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              margin: '0 0 6px',
            }}
          >
            Tomorrow · 明日の面談
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tomorrowItems.map((r) => (
              <ReservationLine
                key={r.id}
                reservation={r}
                highlight
                scopedCounselors={scopedCounselors}
              />
            ))}
          </div>
        </div>
      )}

      {upcomingItems.length > 0 && (
        <div>
          <p
            style={{
              fontSize: 10,
              color: 'var(--text-mid)',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              margin: '0 0 6px',
            }}
          >
            Upcoming · 直近 7 日
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcomingItems.map((r) => (
              <ReservationLine
                key={r.id}
                reservation={r}
                scopedCounselors={scopedCounselors}
              />
            ))}
          </div>
        </div>
      )}

      <p
        style={{
          fontSize: 11,
          color: 'var(--text-mid)',
          lineHeight: 1.75,
          marginTop: 14,
          marginBottom: 0,
          paddingTop: 10,
          borderTop: '1px solid rgba(168,136,88,.18)',
        }}
      >
        質問付きの予約は、面談前日までに「カレンダー → 予約者を見る」からメッセージ返信できます。
        夜中の予約も翌朝の確認で十分。返信は必須ではありません。
      </p>
    </div>
  )
}

function ReservationLine({
  reservation,
  highlight = false,
  scopedCounselors,
}: {
  reservation: ReservationWithNotes
  highlight?: boolean
  scopedCounselors: Counselor[]
}) {
  const hasQuestion = !!(reservation.notes && reservation.notes.trim().length > 0)
  const hasMessage = !!reservation.agency_message
  const dt = reservation.start_at ? new Date(reservation.start_at) : null
  const counselor = scopedCounselors.find((c) => c.id === reservation.counselor_id)

  return (
    <div
      style={{
        padding: '10px 12px',
        background: highlight ? 'rgba(168,136,88,.10)' : 'var(--bg-elev)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        border: '1px solid var(--border)',
      }}
    >
      <span
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-deep)',
          flexShrink: 0,
        }}
      >
        {dt
          ? `${dt.getMonth() + 1}/${dt.getDate()} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
          : '—'}
      </span>
      <span
        style={{
          fontSize: 12,
          color: 'var(--text)',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {reservation.user_name || '（名前未入力）'}
        {counselor && scopedCounselors.length > 1 && (
          <span style={{ fontSize: 10, color: 'var(--text-light)', marginLeft: 6 }}>
            · {counselor.name}
          </span>
        )}
      </span>
      {reservation.meeting_type && (
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-mid)',
            padding: '2px 7px',
            background: 'var(--card)',
            borderRadius: 10,
            flexShrink: 0,
          }}
        >
          {reservation.meeting_type}
        </span>
      )}
      {hasQuestion && !hasMessage && (
        <span
          style={{
            fontSize: 10,
            color: '#A88858',
            background: 'rgba(168,136,88,.18)',
            padding: '2px 8px',
            borderRadius: 10,
            border: '1px solid rgba(168,136,88,.4)',
            flexShrink: 0,
            fontWeight: 500,
          }}
        >
          要返信
        </span>
      )}
      {hasQuestion && hasMessage && (
        <span
          style={{
            fontSize: 10,
            color: 'var(--success, #7A9E87)',
            padding: '2px 8px',
            borderRadius: 10,
            background: 'rgba(122,158,135,.15)',
            border: '1px solid rgba(122,158,135,.3)',
            flexShrink: 0,
          }}
        >
          返信済
        </span>
      )}
    </div>
  )
}
