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
 *  4. ユーザーが Kinda type / Kinda note を共有してる予約は「事前共有あり」バッジ
 *
 * 予約が 0 件なら丸ごと非表示。
 * カウンセラーが「予約確定したもの・明日来るもの」を朝イチ確認できる箱。
 * トーン: ユーザー満足度に直結する仕事のため、業務責任を促す表現を使う。
 */

interface Props {
  scopedCounselors: Counselor[]
}

// Reservation 型に notes が無いので Row 取得用に extend（DB の実カラムは notes）
type ReservationWithNotes = Reservation & {
  notes?: string | null
}

/**
 * 「事前共有あり」判定 — Kinda type または Kinda note が共有されている
 */
function hasSharedDiagnosis(r: ReservationWithNotes): boolean {
  return !!(r.shared_kinda_type_key || r.shared_kinda_note_key)
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

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid rgba(168,136,88,.18)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <p style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
          ⓘ ご対応の目安
        </p>
        <ul style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.85, margin: 0, paddingLeft: 18 }}>
          <li><span style={{ color: '#A88858', fontWeight: 500 }}>要返信</span>の予約は<span style={{ color: '#A88858', fontWeight: 500 }}>24時間以内</span>のご対応をお願いします（ユーザー満足度に直結します）</li>
          <li>明日の面談は<span style={{ fontWeight: 500 }}>前日中に予習</span>。共有された診断結果がある場合は必ず目を通してください</li>
          <li>カレンダー → 予約者を見る → 「予約者へメッセージを送る」から返信できます</li>
        </ul>
      </div>
    </div>
  )
}

/** 予約からの経過時間を「N分前 / N時間前 / N日前」で返す */
function formatTimeSinceBooking(createdAt: string | null): { label: string; hoursElapsed: number } | null {
  if (!createdAt) return null
  const diffMs = Date.now() - new Date(createdAt).getTime()
  if (diffMs < 0) return null
  const minutes = Math.floor(diffMs / 1000 / 60)
  if (minutes < 1) return { label: 'たった今予約', hoursElapsed: 0 }
  if (minutes < 60) return { label: `${minutes}分前に予約`, hoursElapsed: 0 }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return { label: `${hours}時間前に予約`, hoursElapsed: hours }
  const days = Math.floor(hours / 24)
  return { label: `${days}日前に予約`, hoursElapsed: hours }
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
  const bookingAge = formatTimeSinceBooking(reservation.created_at ?? null)
  const reschedUserRequested = reservation.reschedule_status === 'requested' && reservation.reschedule_requested_by === 'user'
  const reschedCounselorPending = reservation.reschedule_status === 'requested' && reservation.reschedule_requested_by === 'counselor'
  // 24時間以上経過 & 質問あり & 未返信 → 赤枠で警告
  const isOverdue = hasQuestion && !hasMessage && bookingAge !== null && bookingAge.hoursElapsed >= 24

  return (
    <div
      style={{
        padding: '10px 12px',
        background: isOverdue
          ? 'rgba(192,122,110,.08)'
          : highlight
            ? 'rgba(168,136,88,.10)'
            : 'var(--bg-elev)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        border: isOverdue ? '1.5px solid rgba(192,122,110,.7)' : '1px solid var(--border)',
        boxShadow: isOverdue ? '0 0 0 3px rgba(192,122,110,.08)' : undefined,
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
      {reschedUserRequested && (
        <span
          style={{
            fontSize: 10,
            color: '#fff',
            background: 'var(--accent)',
            padding: '2px 8px',
            borderRadius: 10,
            flexShrink: 0,
            fontWeight: 700,
          }}
          title="ユーザーから日程変更の申請が届いています"
        >
          日程変更の申請あり
        </span>
      )}
      {reschedCounselorPending && (
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-mid)',
            background: 'var(--card)',
            padding: '2px 8px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            flexShrink: 0,
          }}
          title="日程変更を提案中・ユーザーの了承待ち"
        >
          日程調整中
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
      {hasSharedDiagnosis(reservation) && (
        <span
          style={{
            fontSize: 10,
            color: 'var(--accent)',
            padding: '2px 8px',
            borderRadius: 10,
            background: 'rgba(200,169,122,.12)',
            border: '1px solid rgba(200,169,122,.3)',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
          title="ユーザーが Kinda type または Kinda note の結果を共有しています"
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          事前共有
        </span>
      )}
      {/* 予約からの経過時間。24時間以上 & 質問未返信なら赤系で強調 */}
      {bookingAge && (
        <span
          style={{
            fontSize: 10,
            color: isOverdue ? '#C07A6E' : 'var(--text-light)',
            padding: '2px 8px',
            borderRadius: 10,
            background: isOverdue ? 'rgba(192,122,110,.12)' : 'transparent',
            border: isOverdue ? '1px solid rgba(192,122,110,.5)' : 'none',
            flexShrink: 0,
            fontWeight: isOverdue ? 600 : 400,
          }}
          title={reservation.created_at ? `予約申込: ${new Date(reservation.created_at).toLocaleString('ja-JP')}` : ''}
        >
          {isOverdue ? `24時間経過 · ${bookingAge.label}` : bookingAge.label}
        </span>
      )}
    </div>
  )
}
