'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Counselor, Reservation } from '@/lib/types'
import KanbanColumn from '@/components/inbox/KanbanColumn'
import ReservationDetailModal from '@/components/calendar/ReservationDetailModal'
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
  const [viewingSlotId, setViewingSlotId] = useState<string | null>(null)

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
    buckets.closed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).splice(20) // 最新20件で打ち切り
    return buckets
  }, [reservations])

  const handleOpenReservation = (r: Reservation) => {
    if (!r.slot_id) {
      // slot_id がない予約は ReservationDetailModal が表示できないので暫定で何もしない
      // （ふたりへの予約は必ず slot 経由なので通常ありえない）
      return
    }
    setViewingSlotId(r.slot_id)
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
      <div className="eyebrow" style={{ marginBottom: 8 }}>INBOX</div>
      <h1 className="page-title" style={{ marginBottom: 8 }}>受信トレイ</h1>
      <p style={{
        fontSize: 13,
        color: 'var(--text-mid)',
        margin: '0 0 18px',
        lineHeight: 1.7,
        maxWidth: 720,
      }}>
        ふたりへから届いた予約を、対応状況ごとに整理して表示します。
        左の列ほど早めの対応が必要です。
      </p>

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
            <span style={{ fontSize: 10, color: 'var(--text-light)', letterSpacing: '.05em' }}>
              SCOPE
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
      ) : (
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
            subtitle="完了・キャンセル済み(最新20件)"
            items={grouped.closed}
            onOpenReservation={handleOpenReservation}
            accentColor="#7A9E87"
            emptyText="クローズ済みはまだありません"
          />
        </div>
      )}

      {viewingSlotId && (
        <ReservationDetailModal
          slotId={viewingSlotId}
          onClose={() => setViewingSlotId(null)}
        />
      )}
    </div>
  )
}
