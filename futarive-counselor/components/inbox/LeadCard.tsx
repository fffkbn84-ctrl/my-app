'use client'

import type { Reservation } from '@/lib/types'
import { KINDA_TYPE_LABEL, KINDA_NOTE_WEATHER, type KindaTypeKey } from '@/lib/diagnosisLabels'
import ElapsedBadge, { computeEscalation } from './ElapsedBadge'

/** 4 列のどこに属するかを表す */
export type ColumnKey = 'pending' | 'contacted' | 'needs_report' | 'closed'

interface Props {
  reservation: Reservation
  column: ColumnKey
  onOpen: () => void
}

/** 申込からの相対時間（短縮形）。「3時間前 / 2日前」 */
function relativeFromNow(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const min = Math.floor(ms / 60000)
  if (min < 60) return `${Math.max(0, min)}分前`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}時間前`
  const d = Math.floor(h / 24)
  return `${d}日前`
}

function formatStartAt(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('ja-JP', {
    month: 'numeric', day: 'numeric',
    weekday: 'short', hour: '2-digit', minute: '2-digit',
  })
}

/** 面談予定時刻までの残り時間（時間単位）。負なら過ぎている */
function hoursUntilStart(iso: string | null): number | null {
  if (!iso) return null
  return (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60)
}

export default function LeadCard({ reservation, column, onOpen }: Props) {
  const r = reservation

  // 日程変更まわり（詳細を開く前に分かるように・要対応の最上位）
  const reschedUserRequested = r.reschedule_status === 'requested' && r.reschedule_requested_by === 'user'
  const reschedCounselorPending = r.reschedule_status === 'requested' && r.reschedule_requested_by === 'counselor'

  // 経過時間バッジ：列によって表示を切り替える
  let badge: React.ReactNode
  if (column === 'pending') {
    badge = <ElapsedBadge createdAt={r.created_at} />
  } else if (column === 'contacted') {
    const h = hoursUntilStart(r.start_at)
    if (h !== null) {
      const isUrgent = h <= 24 && h >= 0
      const label = h < 0
        ? '面談時刻を過ぎています'
        : h < 1
          ? '面談まもなく'
          : h < 24
            ? `面談まで約${Math.floor(h)}時間`
            : `面談まで${Math.floor(h / 24)}日`
      badge = <ElapsedBadge createdAt={r.created_at} override={{ label, tone: isUrgent ? 'urgent' : 'neutral' }} />
    } else {
      badge = <ElapsedBadge createdAt={r.created_at} override={{ label: '連絡済み' }} />
    }
  } else if (column === 'needs_report') {
    const h = hoursUntilStart(r.start_at) ?? 0
    const hoursAgo = Math.abs(h)
    const label = hoursAgo < 24
      ? `面談から${Math.floor(hoursAgo)}時間`
      : `面談から${Math.floor(hoursAgo / 24)}日`
    badge = <ElapsedBadge createdAt={r.created_at} override={{ label, tone: 'urgent' }} />
  } else {
    // closed
    if (r.status === 'completed') {
      badge = <ElapsedBadge createdAt={r.created_at} override={{ label: '面談完了' }} />
    } else {
      badge = <ElapsedBadge createdAt={r.created_at} override={{ label: 'キャンセル' }} />
    }
  }

  // pending 列で critical（48h超）ならカード全体を赤縁にする
  const escalation = column === 'pending' ? computeEscalation(r.created_at).level : 'normal'
  const isCritical = escalation === 'critical'

  // Kinda type / Kinda note の事前共有
  const sharedType = r.shared_kinda_type_key
    ? KINDA_TYPE_LABEL[r.shared_kinda_type_key as KindaTypeKey]
    : null
  const sharedNoteLabel = r.shared_kinda_note_key
    ? KINDA_NOTE_WEATHER[r.shared_kinda_note_key]
    : null

  // 自由記述の抜粋（先頭40字）
  const freeTextSnippet = r.shared_kinda_note_freetext
    ? r.shared_kinda_note_freetext.trim().slice(0, 40) +
      (r.shared_kinda_note_freetext.trim().length > 40 ? '…' : '')
    : null

  // 事前に伝えたいこと（notes）の抜粋
  const notesSnippet = r.notes
    ? r.notes.trim().slice(0, 60) + (r.notes.trim().length > 60 ? '…' : '')
    : null

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        textAlign: 'left',
        width: '100%',
        background: reschedUserRequested ? '#FFF8F0' : 'var(--card)',
        border: reschedUserRequested
          ? '1.5px solid var(--accent)'
          : `1px solid ${isCritical ? 'rgba(192,122,110,.5)' : 'var(--border)'}`,
        borderLeft: reschedUserRequested
          ? '3px solid var(--accent)'
          : isCritical ? '3px solid #C07A6E' : `1px solid ${'var(--border)'}`,
        borderRadius: 12,
        padding: '12px 14px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: isCritical ? '0 1px 0 rgba(192,122,110,.08)' : 'none',
        transition: 'transform .15s, box-shadow .15s, background .15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = reschedUserRequested ? '#FFF1E0' : 'var(--card-warm)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = reschedUserRequested ? '#FFF8F0' : 'var(--card)'
      }}
    >
      {/* 日程変更の申請バナー（最優先で目立たせる） */}
      {reschedUserRequested && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '.02em' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M7 4v3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="7" cy="10" r=".6" fill="currentColor"/>
          </svg>
          日程変更の申請あり・要・確認
        </div>
      )}
      {reschedCounselorPending && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--text-mid)' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          日程変更を提案中・ユーザーの了承待ち
        </div>
      )}
      {/* ヘッダー行：経過バッジ + 面談形式 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {badge}
        {r.meeting_type && (
          <span style={{
            fontSize: 10,
            fontFamily: 'DM Sans, sans-serif',
            color: r.meeting_type === 'オンライン' ? '#5A7FAF' : '#A88858',
            background: r.meeting_type === 'オンライン' ? 'rgba(90,127,175,.10)' : 'rgba(168,136,88,.10)',
            padding: '2px 7px',
            borderRadius: 20,
            letterSpacing: '.04em',
          }}>
            {r.meeting_type}
          </span>
        )}
        {r.agency_message && column === 'contacted' && (
          <span style={{
            fontSize: 10,
            color: 'var(--success)',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '.04em',
          }}>
            ✓ 連絡済み
          </span>
        )}
      </div>

      {/* 氏名 + 申込時刻 */}
      <div>
        <div style={{
          fontSize: 14,
          color: 'var(--text-deep)',
          fontWeight: 500,
          marginBottom: 2,
        }}>
          {r.user_name || '（氏名未登録）'}
          {r.status === 'completed' && (
            <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--text-light)' }}>様</span>
          )}
        </div>
        <div style={{
          fontSize: 11,
          color: 'var(--text-light)',
          fontFamily: 'DM Sans, sans-serif',
          letterSpacing: '.02em',
        }}>
          申込 {relativeFromNow(r.created_at)} · 面談 {formatStartAt(r.start_at)}
        </div>
      </div>

      {/* Kinda 共有情報 */}
      {(sharedType || sharedNoteLabel) && (
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}>
          {sharedType && (
            <span style={{
              fontSize: 10,
              color: 'white',
              background: sharedType.bg,
              fontFamily: 'Shippori Mincho, serif',
              fontWeight: 500,
              padding: '2px 9px',
              borderRadius: 20,
            }}>
              {sharedType.name}
            </span>
          )}
          {sharedNoteLabel && (
            <span style={{
              fontSize: 10,
              color: 'white',
              background: '#D4A090',
              fontFamily: 'Shippori Mincho, serif',
              fontWeight: 500,
              padding: '2px 9px',
              borderRadius: 20,
            }}>
              {sharedNoteLabel}
            </span>
          )}
        </div>
      )}

      {/* your words（自由記述抜粋）—最重要のシグナル */}
      {freeTextSnippet && (
        <div style={{
          fontSize: 12,
          color: 'var(--text)',
          fontFamily: 'Shippori Mincho, serif',
          lineHeight: 1.7,
          padding: '8px 10px',
          background: 'rgba(212,160,144,.08)',
          borderLeft: '2px solid #D4A090',
          borderRadius: 6,
        }}>
          「{freeTextSnippet}」
          <div style={{
            fontSize: 9,
            color: '#B8806E',
            marginTop: 2,
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '.06em',
            textTransform: 'uppercase',
          }}>
            your words
          </div>
        </div>
      )}

      {/* notes（事前に伝えたいこと）の抜粋 */}
      {notesSnippet && !freeTextSnippet && (
        <div style={{
          fontSize: 12,
          color: 'var(--text-mid)',
          lineHeight: 1.7,
          padding: '8px 10px',
          background: 'var(--bg-elev)',
          borderRadius: 6,
        }}>
          {notesSnippet}
          <div style={{
            fontSize: 9,
            color: 'var(--text-light)',
            marginTop: 2,
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '.06em',
            textTransform: 'uppercase',
          }}>
            事前に伝えたいこと
          </div>
        </div>
      )}

      {/* フッター：アクション促進 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-light)' }}>
          タップで詳細
        </span>
        <span style={{
          fontSize: 11,
          color: 'var(--accent)',
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          letterSpacing: '.04em',
        }}>
          {column === 'pending' ? '対応する →' :
           column === 'contacted' ? '確認する →' :
           column === 'needs_report' ? '完了報告 →' : '見る →'}
        </span>
      </div>
    </button>
  )
}
