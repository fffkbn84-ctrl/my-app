'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Counselor, Reservation } from '@/lib/types'
import { useRouter } from 'next/navigation'
import KanbanColumn from '@/components/inbox/KanbanColumn'
import type { ColumnKey } from '@/components/inbox/LeadCard'

// dashboard / calendar と共有する context localStorage キー
const SCOPE_STORAGE_KEY = 'kinda-dashboard-context'
const ALL_SENTINEL = 'ALL'

/** Reservation を 4 列のどこに振り分けるか */
function classifyReservation(r: Reservation): ColumnKey {
  if (r.status === 'completed' || r.status === 'canceled') return 'closed'
  // active 以下のみ
  if (!r.start_at) return 'pending'
  const startMs = new Date(r.start_at).getTime()
  if (startMs <= Date.now()) return 'needs_report' // 面談時刻過ぎたが完了処理してない
  if (!r.agency_message_at) return 'pending'        // メッセージまだ送ってない
  return 'contacted'
}

export default function InboxPage() {
  const [counselorsInScope, setCounselorsInScope] = useState<Counselor[]>([])
  const [selectedScope, setSelectedScope] = useState<string>(ALL_SENTINEL)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const [tab, setTab] = useState<'work' | 'all'>('work')
  // クローズ列の表示件数（最初は 20、ボタンで +20 ずつ増やす）
  const CLOSED_PAGE_SIZE = 20
  const [closedVisibleCount, setClosedVisibleCount] = useState(CLOSED_PAGE_SIZE)

  // 初期化：スコープ取得 + localStorage 復元
  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const scoped: Counselor[] = []
      const { data: own } = await supabase
        .from('counselors').select('*').eq('owner_user_id', user.id)
      if (own) scoped.push(...(own as Counselor[]))

      const { data: agencies } = await supabase
        .from('agencies').select('id').eq('owner_user_id', user.id)
      const agencyIds = ((agencies as { id: string }[] | null) ?? []).map(a => a.id)
      if (agencyIds.length > 0) {
        const { data: rows } = await supabase
          .from('counselors').select('*')
          .in('agency_id', agencyIds)
          .order('created_at', { ascending: true })
        const ids = new Set(scoped.map(c => c.id))
        for (const c of (rows as Counselor[] | null) ?? []) {
          if (!ids.has(c.id)) scoped.push(c)
        }
      }
      setCounselorsInScope(scoped)

      let stored: string = ALL_SENTINEL
      try {
        const s = localStorage.getItem(SCOPE_STORAGE_KEY)
        if (s) stored = s
      } catch {}
      // 保存された値がスコープ外なら全件にフォールバック
      if (stored !== ALL_SENTINEL && !scoped.find(c => c.id === stored)) {
        stored = ALL_SENTINEL
      }
      setSelectedScope(stored)
    }
    init()
  }, [])

  // 予約取得
  const loadReservations = useCallback(async (scope: string, list: Counselor[]) => {
    if (list.length === 0) { setReservations([]); setLoading(false); return }
    const ids = scope === ALL_SENTINEL ? list.map(c => c.id) : [scope]
    const supabase = createClient()
    // 過去6か月分まで取得（古すぎる closed は除外）
    const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString()
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .in('counselor_id', ids)
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })

    if (error) {
      setError(`予約の取得に失敗：${describeError(error)}`)
      setLoading(false)
      return
    }
    setReservations((data as Reservation[]) ?? [])
    setError('')
    setLoading(false)
  }, [])

  useEffect(() => {
    if (counselorsInScope.length === 0) return
    setLoading(true)
    loadReservations(selectedScope, counselorsInScope)
  }, [selectedScope, counselorsInScope, loadReservations])

  // Realtime 購読：reservations 変更で再読込
  useEffect(() => {
    if (counselorsInScope.length === 0) return
    const supabase = createClient()
    const channel = supabase
      .channel('inbox-reservations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        loadReservations(selectedScope, counselorsInScope)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selectedScope, counselorsInScope, loadReservations])

  const handleScopeChange = (next: string) => {
    setSelectedScope(next)
    try { localStorage.setItem(SCOPE_STORAGE_KEY, next) } catch {}
  }

  // 列ごとに振り分け
  const grouped = useMemo(() => {
    const buckets: Record<ColumnKey, Reservation[]> = {
      pending: [],
      contacted: [],
      needs_report: [],
      closed: [],
    }
    for (const r of reservations) {
      const col = classifyReservation(r)
      buckets[col].push(r)
    }
    // 列ごとのソート
    buckets.pending.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // 古い順 = 経過長い順 = 優先
    buckets.contacted.sort((a, b) => (new Date(a.start_at ?? 0).getTime()) - (new Date(b.start_at ?? 0).getTime())) // 直近の面談から
    buckets.needs_report.sort((a, b) => (new Date(b.start_at ?? 0).getTime()) - (new Date(a.start_at ?? 0).getTime())) // 直近の完了未報告から
    // クローズは古い分まで保持（表示は closedVisibleCount で制御）
    buckets.closed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return buckets
  }, [reservations])

  // スコープ切替で closed の表示件数をリセット
  useEffect(() => {
    setClosedVisibleCount(CLOSED_PAGE_SIZE)
  }, [selectedScope])

  const handleOpenReservation = (r: Reservation) => {
    // 全部入りの予約詳細ページへ（日程調整・メッセージ・完了処理もここで）
    router.push(`/reservations/${r.id}`)
  }

  if (loading && reservations.length === 0) {
    return (
      <div style={{ padding: 32, color: 'var(--text-mid)' }}>
        読み込み中...
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1280, paddingBottom: 80 }}>
      <h1 className="page-title" style={{ marginBottom: 8 }}>予約</h1>
      <p style={{
        fontSize: 13,
        color: 'var(--text-mid)',
        margin: '0 0 16px',
        lineHeight: 1.7,
        maxWidth: 720,
      }}>
        {tab === 'work'
          ? 'ふたりへから届いた予約を、対応状況ごとに整理して表示します。左の列ほど早めの対応が必要です。'
          : '予定・過去のすべての予約を一覧で確認できます。カードを選ぶと日程調整・メッセージ・完了処理ができます。'}
      </p>

      {/* タブ切替：やること（カンバン）/ すべての予約（一覧） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {([['work', 'やること'], ['all', 'すべての予約']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`kc-btn kc-btn-sm ${tab === key ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* スコープ切替 + カレンダーへのリンク */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        marginBottom: 18,
      }}>
        {counselorsInScope.length > 1 && (
          <div style={{
            padding: '8px 12px',
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-light)' }}>
              表示範囲
            </span>
            <select
              className="kc-select"
              value={selectedScope}
              onChange={e => handleScopeChange(e.target.value)}
              style={{ minWidth: 160, fontSize: 12 }}
            >
              <option value={ALL_SENTINEL}>全カウンセラー</option>
              {counselorsInScope.map(c => (
                <option key={c.id} value={c.id}>{c.name} さん</option>
              ))}
            </select>
          </div>
        )}

        <Link
          href="/calendar"
          className="kc-btn kc-btn-ghost kc-btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          予約枠の追加・編集
        </Link>
      </div>

      {error && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(192,122,110,.08)',
          border: '1px solid rgba(192,122,110,.4)',
          borderRadius: 10,
          color: '#9A3B2C',
          fontSize: 12,
          marginBottom: 14,
        }}>
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          borderRadius: 14,
        }}>
          <p style={{
            fontFamily: 'Shippori Mincho, serif',
            fontStyle: 'italic',
            fontSize: 15,
            color: 'var(--text-mid)',
            margin: 0,
            lineHeight: 1.8,
          }}>
            まだ予約は届いていません。<br/>
            <span style={{ fontSize: 12 }}>
              プロフィールとリールを整えると、ご縁につながりやすくなります。
            </span>
          </p>
        </div>
      ) : tab === 'work' ? (
        <div className="inbox-kanban">
          <KanbanColumn
            column="pending"
            title="要対応"
            subtitle="まだメッセージを返していない予約"
            items={grouped.pending}
            onOpenReservation={handleOpenReservation}
            accentColor="#C07A6E"
            emptyText="未対応の予約はありません"
          />
          <KanbanColumn
            column="contacted"
            title="連絡済み・面談前"
            subtitle="メッセージを送って面談を待っている予約"
            items={grouped.contacted}
            onOpenReservation={handleOpenReservation}
            accentColor="#A88858"
            emptyText="面談待ちはありません"
          />
          <KanbanColumn
            column="needs_report"
            title="要・完了報告"
            subtitle="面談時刻を過ぎているが完了処理していない予約"
            items={grouped.needs_report}
            onOpenReservation={handleOpenReservation}
            accentColor="#D4A23D"
            emptyText="完了報告待ちはありません"
          />
          <KanbanColumn
            column="closed"
            title="クローズ"
            subtitle="完了・キャンセル済み"
            items={grouped.closed.slice(0, closedVisibleCount)}
            totalCount={grouped.closed.length}
            hasMore={grouped.closed.length > closedVisibleCount}
            onShowMore={() => setClosedVisibleCount(c => c + CLOSED_PAGE_SIZE)}
            onOpenReservation={handleOpenReservation}
            accentColor="#7A9E87"
            emptyText="クローズ済みはまだありません"
          />
        </div>
      ) : (
        <AllReservationsList reservations={reservations} onOpen={handleOpenReservation} />
      )}

    </div>
  )
}

/** 「すべての予約」タブ：予定 / 過去 の一覧（旧・予約管理ページの内容を統合） */
function AllReservationsList({ reservations, onOpen }: { reservations: Reservation[]; onOpen: (r: Reservation) => void }) {
  const upcoming = reservations
    .filter(r => r.status === 'active')
    .sort((a, b) => new Date(a.start_at ?? 0).getTime() - new Date(b.start_at ?? 0).getTime())
  const past = reservations
    .filter(r => r.status !== 'active')
    .sort((a, b) => new Date(b.start_at ?? b.created_at).getTime() - new Date(a.start_at ?? a.created_at).getTime())

  return (
    <div style={{ maxWidth: 700 }}>
      {upcoming.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>予定</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(r => <ReservationCard key={r.id} r={r} onClick={() => onOpen(r)} />)}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <p className="eyebrow" style={{ marginBottom: 12 }}>過去の予約</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {past.map(r => <ReservationCard key={r.id} r={r} onClick={() => onOpen(r)} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function ReservationCard({ r, onClick }: { r: Reservation; onClick: () => void }) {
  const isPendingUserRequest = r.reschedule_status === 'requested' && r.reschedule_requested_by === 'user'
  const isPendingCounselorRequest = r.reschedule_status === 'requested' && r.reschedule_requested_by === 'counselor'

  const dateStr = r.start_at
    ? new Date(r.start_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })
    : '日時未定'
  const timeStr = r.start_at && r.end_at
    ? `${new Date(r.start_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} – ${new Date(r.end_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
    : ''

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
        background: 'var(--card)',
        border: `1px solid ${isPendingUserRequest ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 14, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background .15s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-deep)' }}>{r.user_name}</span>
          {isPendingUserRequest && <span className="kc-badge kc-badge-urgent" style={{ fontSize: 10 }}>日程変更申請あり</span>}
          {isPendingCounselorRequest && <span className="kc-badge kc-badge-booking" style={{ fontSize: 10 }}>了承待ち</span>}
          {r.status === 'canceled' && (
            <span style={{ fontSize: 10, background: 'var(--bg-elev)', color: 'var(--text-mid)', borderRadius: 6, padding: '2px 8px' }}>キャンセル済み</span>
          )}
          {r.status === 'completed' && <span className="kc-badge kc-badge-booking" style={{ fontSize: 10 }}>完了</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>
          {dateStr}{timeStr ? `　${timeStr}` : ''}{r.meeting_type ? `　${r.meeting_type}` : ''}
        </div>
      </div>
      <svg style={{ flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3l4 4-4 4" stroke="var(--text-light)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
